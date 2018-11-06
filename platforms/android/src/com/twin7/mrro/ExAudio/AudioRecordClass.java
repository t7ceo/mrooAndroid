package com.twin7.mrro.ExAudio;

import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.media.audiofx.BassBoost;
import android.media.audiofx.PresetReverb;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Environment;
import android.os.PowerManager;
import android.util.Log;
import android.widget.Toast;

import com.twin7.mrro.GlobalApplication.GlobalApplication;
import com.twin7.mrro.util.Util;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class AudioRecordClass {
    public final String TAG = "AudioRecord";

    private long aSampleRate;
    private int Channels;
    private int BitsPerSample;
    private int AudFormat;
    private static Context mContext;

    private int bufferSize = 0;
    private static AudioRecord mRecorder;

    private static short[] mBuffer;

    static MediaPlayer mMediaPlayer;
    static MediaPlayer mMediaPlayerV;

    private static File rawFile;

    private FileInputStream is;


    private String mainFile;

    static WaveHeader header;


    public AudioRecordClass(Context mContext){
        this.mContext = mContext;
        Log.d(TAG, "***********생성자");
    }

    public void getFileInfo(String url, String sc){

        mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + url + sc;

        Thread thread = new Thread(new Runnable(){

            public void run() {

                try {
                    is = new FileInputStream(mainFile);
                    header = new WaveHeader(is);
                    Log.d(TAG, "getSampleRate=" + GlobalApplication.getSampleRate + " WAV File header \n" + header.toString(mainFile));
                    header.setSampleRate(header.getSampleRate());     //


                    GlobalApplication.getSampleRate = header.getSampleRate();
                    GlobalApplication.getBitsPerSample = header.getBitsPerSample();
                    GlobalApplication.gChannels = header.getChannels();
                    GlobalApplication.getAudioFormat = header.getAudioFormat();


                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }

            }});

        thread.start();

    }


    public void recordStopNow(){

        //button.setText(StartRecordingLabel);
        GlobalApplication.mIsRecording = false;
        mRecorder.stop();

        if(mMediaPlayer.isPlaying()){
            mMediaPlayer.release();
            mMediaPlayer = null;
        }

        mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/song.wav";
        try {
            is = new FileInputStream(mainFile);
            header = new WaveHeader(is);
            GlobalApplication.gChannels = header.getChannels();
            GlobalApplication.getSampleRate = header.getSampleRate();
            GlobalApplication.getBitsPerSample = header.getBitsPerSample();
            GlobalApplication.getAudioFormat = header.getAudioFormat();


            Log.d(TAG, "녹음 중지하고 파일을 저장한다. GlobalApplication.getSampleRate="+GlobalApplication.getSampleRate);
            File waveFile = Util.getFile("wav");
            try{
                //------------------------------------------------------------
                Util.rawTowave(rawFile, waveFile);   //raw 파일을 wav 파일로 컨버터 한다.
                //------------------------------------------------------------
            }catch (IOException e){
                Toast.makeText(mContext, "Recorded to "+ waveFile.getName(), Toast.LENGTH_SHORT).show();
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }


    }


    public void recordGo(){

        mMediaPlayer = new MediaPlayer();

        this.aSampleRate = GlobalApplication.getSampleRate;
        this.Channels = GlobalApplication.gChannels;
        this.BitsPerSample = GlobalApplication.getBitsPerSample;
        this.AudFormat = GlobalApplication.getAudioFormat;


        Log.d("Record", "Rec Button Click SampleRate======" + aSampleRate + "///");


        bufferSize = 0;
        //AudioRecord 객체에서 사용하는 내부 버터의 크기를 계산한다.
        if (GlobalApplication.gChannels == 1) {
            bufferSize = AudioRecord.getMinBufferSize((int) aSampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
            mRecorder = new AudioRecord(MediaRecorder.AudioSource.MIC, (int) GlobalApplication.getSampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize);
        } else if (GlobalApplication.gChannels == 2) {
            bufferSize = AudioRecord.getMinBufferSize((int) GlobalApplication.getSampleRate, AudioFormat.CHANNEL_IN_STEREO, AudioFormat.ENCODING_PCM_16BIT);
            mRecorder = new AudioRecord(MediaRecorder.AudioSource.MIC, (int) GlobalApplication.getSampleRate, AudioFormat.CHANNEL_IN_STEREO, AudioFormat.ENCODING_PCM_16BIT, bufferSize);
        } else {
            bufferSize = AudioRecord.getMinBufferSize((int) GlobalApplication.getSampleRate, AudioFormat.CHANNEL_IN_STEREO, AudioFormat.ENCODING_PCM_16BIT);
            mRecorder = new AudioRecord(MediaRecorder.AudioSource.MIC, (int) GlobalApplication.getSampleRate, AudioFormat.CHANNEL_IN_STEREO, AudioFormat.ENCODING_PCM_16BIT, bufferSize);
        }


        //음향 효과===============================================
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            /*
            //노이즈 제거
            boolean noiseinf = NoiseSuppressor.isAvailable();
            if(noiseinf){
                NoiseSuppressor.create(mRecorder.getAudioSessionId());
            }
            //*/
        }



        //볼륨 강제설정======================================================================
        AudioManager am = (AudioManager)mContext.getSystemService(Context.AUDIO_SERVICE);
        int previousVolume = am.getStreamVolume(AudioManager.STREAM_MUSIC);
        Log.d("effff","record volume Stand======"+previousVolume);
        previousVolume = 11;
        //am.setStreamVolume(AudioManager.STREAM_MUSIC, 10, 0);
        am.setStreamVolume(AudioManager.STREAM_MUSIC, (previousVolume - 4), 0);
        am.setStreamVolume(AudioManager.STREAM_VOICE_CALL, (previousVolume + 5), 0);
        am.setStreamVolume(AudioManager.STREAM_ACCESSIBILITY, (previousVolume + 5), 0);
        //am.setStreamVolume(AudioManager., previousVolume, 0);
        Log.d("effff","record volume ---======"+previousVolume);
        //=================================================================================



        mBuffer = new short[bufferSize];
        //Log.d("Record", "녹음을 시작 한다. ChunkSize=" + header.getChunkSize() + " SampleRate=" + GlobalApplication.getSampleRate + "///getBitsPerSample=" + GlobalApplication.getBitsPerSample + "////gChannels=" + GlobalApplication.gChannels + "///gAudioFormat=" + GlobalApplication.getAudioFormat);

        //button.setText(StopRecordingLabel);
        GlobalApplication.mIsRecording = true;


        //song.wav 파일을 플레이 한다.-------------------------------
        //wavPlayMusic = new Wavplay(mContext, "song.wav");
        //wavPlayMusic.audioProPlay();
        //------------------------------------------------------



        GlobalApplication.goMsPlay = false;
        //녹음이 먼저 되는 문제가 있다.
        //음악 플레이 되고 녹음 되게 해야 한다.
        mediaMP3Player();

        //Log.d("Record", "crrrrtt Go While======="+mMediaPlayer.getCurrentPosition()+"////goMsPlay="+GlobalApplication.goMsPlay);
        while (!GlobalApplication.goMsPlay) {
            //음악이 정상적으로 플페이 될때 가지 기다린다.
            //Log.d("Record", "crrrrtt Now While======="+mMediaPlayer.getCurrentPosition());
        }

        if (GlobalApplication.goMsPlay) {
            //음악이 플레이 되면 녹음을 시작 한다.
            //Log.d("Record","startBufferWrite********"+mMediaPlayer.getCurrentPosition()+"////goMsPlay="+GlobalApplication.goMsPlay);
            //녹음 작업을 수행한다.
            mRecorder.startRecording();
            rawFile = Util.getFile("raw");    //확장자가 .raw 인 파일을 가져온다.
            startBuffereWrite(rawFile);
        }




    }



    //-------------------------------------------------------------------------------
    //mp3 파일을 풀레이 한다.
    public static void mediaMP3Player(){

        mMediaPlayer = new MediaPlayer();

        String songFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/song.mp3";
        Log.d("Record", "노래 플레이===="+songFile+"////isPlay="+mMediaPlayer.isPlaying());
        MP3playTask mp3playTaskS;
        mp3playTaskS = new MP3playTask("M", mContext);


        if(Build.VERSION.SDK_INT < 11){
            mp3playTaskS.execute(songFile);
        }else{
            mp3playTaskS.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, songFile);
        }

    }




    private void startBuffereWrite(final File file){


        Thread thread = new Thread(new Runnable(){

            public void run(){
                DataOutputStream output = null;

                //GlobalApplication.goBgSong = true; //false;
                //GlobalApplication.goBgSong = true;

                try{

                    output = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(file)));


                    //GlobalApplication.goMsPlay = true;
                    //사용자가 중지 보튼을 누를 때가지 녹음을 수행한다.
                    while(GlobalApplication.mIsRecording){

                        double sum = 0;

                        //녹음한 데이터는 mBuffer에 넣어 반환한다.
                        int readSize = mRecorder.read(mBuffer, 0, mBuffer.length);
                        for(int i=0; i < readSize; i++){
                            //녹음한 데이터를 파일로 저장한다.
                            output.writeShort(mBuffer[i]);
                            sum += mBuffer[i] * mBuffer[i];
                        }


                        if(readSize > 0){
                            final double amplitude = sum / readSize;
                            RecordingActivity.progressDisp((int) Math.sqrt(amplitude));
                        }

                    }


                } catch (IOException e) {
                    Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
                }finally{

                    RecordingActivity.progressDisp(0);

                    if(output != null){
                        try{
                            output.flush();
                        } catch (IOException e) {
                            Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
                        }finally{
                            try{
                                output.close();
                            } catch (IOException e) {
                                Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    }
                }
            }
        });

        thread.start();

    }



    public static void mediaWavPlayer(String fnam){

        String songFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/"+fnam;
        Log.d("uuuuuu", "노래 플레이===="+songFile);
        MP3playTask mp3playTaskSW;
        mp3playTaskSW = new MP3playTask("M", mContext);


        if(Build.VERSION.SDK_INT < 11){
            mp3playTaskSW.execute(songFile);
        }else{
            mp3playTaskSW.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, songFile);
        }
    }





    //---AsyncTask----------------------------------------------------------------------------

    //==============================================================================
    public static class MP3playTask extends AsyncTask<String, Integer, String> {

        String  gubun = "";
        Context mContextt = null;
        private MP3playTask(String inf, Context mContext) {

            mContextt = mContext;
            gubun = inf;

            Log.d("RecordingActivity", "gubun====="+inf);
        }


        protected void onPreExecute(){
            //super.onPreExecute();
            Log.d("RecordingActivity", "onPostExecutet Start======");
        }


        protected String doInBackground(String... url){


            String result = "ok";
            //Log.d("RecordingActivity", "play Start======"+url[0]);
            try {

                mMediaPlayer.setDataSource(url[0]);
                mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
                mMediaPlayer.setWakeMode(mContextt, PowerManager.PARTIAL_WAKE_LOCK);

                //Visualizer mVisualizer = new Visualizer(mMediaPlayer.getAudioSessionId());
                //Equalizer mEqualizer = new Equalizer(0, mMediaPlayer.getAudioSessionId());
                //mEqualizer.setEnabled(true);


                PresetReverb mReverb = new PresetReverb(0, mMediaPlayer.getAudioSessionId());
                mReverb.setPreset(PresetReverb.PRESET_SMALLROOM);
                mReverb.setEnabled(true);
                mMediaPlayer.setAuxEffectSendLevel(1.0f);


                BassBoost bassBoost = new BassBoost(0, mMediaPlayer.getAudioSessionId());
                bassBoost.setEnabled(false);
                BassBoost.Settings bassBoostSettingTemp = bassBoost.getProperties();
                BassBoost.Settings bassBoostSetting = new BassBoost.Settings(bassBoostSettingTemp.toString());
                bassBoostSetting.strength = (1000 / 19);
                bassBoost.setProperties(bassBoostSetting);
                mMediaPlayer.setAuxEffectSendLevel(1.0f);

                mMediaPlayer.setVolume(10, 10);



                mMediaPlayer.prepare();

                if(gubun == "M"){
                    mMediaPlayer.start();
                }else{
                    mMediaPlayerV.start();
                }
                while(mMediaPlayer.getCurrentPosition() <= GlobalApplication.shinkGab){
                }
                GlobalApplication.goMsPlay = true;


            } catch (IOException e) {
                e.printStackTrace();
                result = "no";
            }

            return result;
        }

        @Override
        protected void onCancelled() {


            super.onCancelled();
        }

        protected void onPostExecute(String s){

            Log.d("RecordingActivity", "onPostExecutett====444=="+s);


            //doInBackground() 로 부터 리턴된 값이 onPostExecute()의 매개변수로 넘어 오므로 s를 출력한다.
            super.onPostExecute(s);

        }

    }
//---AsyncTask-End--------------------------------------------------------------------------



}
