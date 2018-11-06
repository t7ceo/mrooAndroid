package com.twin7.mrro.ExAudio;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;

import com.twin7.mrro.GlobalApplication.GlobalApplication;
import com.twin7.mrro.R;


import com.twin7.mrro.util.Util;


public class RecordingActivity extends Activity {
    final String TAG = "RecordingActivity";


    //또는 낮은 품질의 오디오로 22050을 사용 할 수 있다.
    private final String StartRecordingLabel = "Start Recording";
    private final String StopRecordingLabel = "Stop Recording";

    private String songId;


    static Context mContext;
    Wavplay wavPlayVoice;

    static ProgressBar mProgressBar;

    MixWavFile mixWfile;

    Button button;

    AudioRecordClass audRec;


    public void onCreate(final Bundle savedInstanceState){

        super.onCreate(savedInstanceState);
        setContentView(R.layout.record_main);


        mContext = this;
        mixWfile = new MixWavFile(false, mContext);


        //------------------------------------------
        //송아이디로 음악을 로컬로 다운로드 한다.
        //------------------------------------------
        Intent intent = getIntent();
        songId = intent.getExtras().getString("sid");
        //songId를 환경변수에 저장하여 다음 실행에서 같은 songId의 곡은 다운로드 하지 않는다.
        //xml 파일에 저장한 환경변수를 가져와서 처리 한다.
        SharedPreferences sdcenter = getSharedPreferences("mrroActivity", 0);
        String songIdOld = sdcenter.getString("songId", "0");
        if(!songIdOld.equals(songId)){
            Log.d(TAG, "sid======"+songId+"////songIdOld="+songIdOld);
            SharedPreferences.Editor edit = getSharedPreferences("mrroActivity", 0).edit();
            edit.putString("songId", songId);
            edit.commit();

            getSongInfo(songId);   //선택한 노래를 서버에서 다운로드 하여 song.wav 로 저장한다.
        }


        //------------------------------------------

            mProgressBar = (ProgressBar) findViewById(R.id.progressBar);
            audRec = new AudioRecordClass(mContext);
            audRec.getFileInfo("/mrro/mixMusic/","song.wav");   //파일의 정보를 출력한다.

            //wavPlayMusic = new Wavplay(mContext, "song.wav");
            wavPlayVoice = new Wavplay(mContext, "imsi.wav");


            BtnOnClickListener onClickListener = new BtnOnClickListener();
            button = (Button) findViewById(R.id.button);
            button.setText(StartRecordingLabel);
            button.setOnClickListener(onClickListener);

            //Button buttonPlay = (Button) findViewById(R.id.playBtn);
            //Button buttonStop = (Button) findViewById(R.id.stopBtn);
            Button mixWav = (Button) findViewById(R.id.mixWav);
            mixWav.setOnClickListener(onClickListener);


    }

    public static void progressDisp(int pr){
        //프로그래스 바를 출력 한다.
        mProgressBar.setProgress(pr);
    }



    class BtnOnClickListener implements Button.OnClickListener{
        public void onClick(View view){
            switch (view.getId()){
                case R.id.button:    //녹음 버튼클릭===============

                    if(!GlobalApplication.mIsRecording) {
                        button.setText(StopRecordingLabel);
                        audRec.recordGo();
                    } else{
                        button.setText(StartRecordingLabel);
                        audRec.recordStopNow();
                        progressDisp(0);
                    }

                    break;    //녹음버튼 종료=====================
                case R.id.mixWav:    //믹스버튼 클릭============================

                    Log.d(TAG, "mixWav Start");

                    mixWfile = new MixWavFile(false, mContext);
                    mixWfile.start();

                    break;    //믹스버튼 종료===========================
                    /*
                case R.id.playBtn:

                    //wavPlayMusic.audioProPlay();

                    //wavPlayVoice = new Wavplay(mContext, "endSong.wav");
                    //wavPlayVoice.audioProPlay();

                    mMediaPlayer.release();
                    mediaWavPlayer("endSong.wav");

                    break;
                case R.id.stopBtn:

                    Log.d(TAG, "노래 종료");
                    /*
                    //wavPlayMusic.audioProStop();
                    wavPlayVoice.audioProStop();
                    //finish();

                    //wavPlayVoice.audioProPlay();
                    //wavPlayMusic.audioProPlay();

                    mMediaPlayer.release();
                    //mMediaPlayerV.release();
                    */
    /*
                    //mRecorder.stop();
                    mMediaPlayer.stop();
                    mMediaPlayer.release();

                    finish();


                    break;
                    */
            }
        }
    }




    public void endActivity(Context mContext){

        finish();
    }



    public void onDestroy() {
        //mRecorder.release();
        GlobalApplication.goMsPlay = true;

        wavPlayVoice.audioProStop();

        super.onDestroy();
    }




    public static void getSongInfo(String songid){
        //songId 로 서어에 있는 mp3 파일을 로컬로 다운로드 한다.
        //다운로드한 mp3 파일을 song.wav 파일로 컨버터 한다.
        String url = "http://mroo.co.kr/mrphp/allphpfile/getMrAll.php";
        ContentValues vv = new ContentValues();
        vv.put("mode", "getSongInfo");
        vv.put("sid", songid);
        //AsyncTask를 통해 HttpURLConnection 수행
        Util.NetworkTask networkTask = new Util.NetworkTask(vv, mContext, songid);

        if(Build.VERSION.SDK_INT < 11){
            networkTask.execute(url);
        }else{
            networkTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, url);
        }

    }



}
