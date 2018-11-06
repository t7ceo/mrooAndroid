package com.twin7.mrro.ExAudio;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Build;
import android.os.Environment;
import android.util.Log;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;

import com.twin7.mrro.GlobalApplication.GlobalApplication;
import com.twin7.mrro.ExAudio.RecordingActivity;

public class Wavplay extends Thread {

    final String TAG = "Wavplay";
    final Context mContext;
    AudioTrack audioTrack;
    private String sourceF;
    private Boolean playInf;
    private String playNum = "stop";
    private int pcount = 0;

    public Wavplay(Context c, String source){
        playInf = false;
        mContext = c;
        sourceF = source;
    }


    public void run(){

        Log.d(TAG, "실행상태==="+sourceF+"==" + playInf + "\n");
        playMusic();

    }


    private void playMusic(){

        String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/" + sourceF;
        try {
            FileInputStream is = new FileInputStream(mainFile);

            WaveHeader header = new WaveHeader(is);
            Log.d(TAG, " WAV File header \n" + header.toString(mainFile));


            int channels;  //안드로이드 채널 상수를 사용한다.
            switch (header.getChannels()) {
                case 1:
                    channels = AudioFormat.CHANNEL_OUT_MONO;
                    break;
                case 2:
                    channels = AudioFormat.CHANNEL_OUT_STEREO;
                    break;
                case 4:
                    channels = AudioFormat.CHANNEL_OUT_QUAD;
                    break;
                default:
                    Log.d(TAG, "WAV channels error \n");
                    return;
            }
            GlobalApplication.gChannels = channels;



            final long freqRange = header.getSampleRate();
            GlobalApplication.getSampleRate = freqRange;

            //WAV 파일 내 데이터의 크기가 잘못된 것이 많아 검증하기 위해 사용했다.
            long size = header.getSubChunk2Size();


            int encoding; //WAV 파일은 숫자인 반면에 안드로이드는 인코딩 상수를 사용한다.
            int getBps = header.getBitsPerSample();
            switch (getBps) {
                case 8:
                    encoding = AudioFormat.ENCODING_PCM_8BIT;
                    break;
                case 16:
                    encoding = AudioFormat.ENCODING_PCM_16BIT;
                    break;
                default:
                    encoding = AudioFormat.ENCODING_INVALID;
            }
            GlobalApplication.getBitsPerSample = getBps;




            //내부 버퍼의 크기를 계산한다.
            int minSize = AudioTrack.getMinBufferSize((int)freqRange, channels, encoding);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                audioTrack = new AudioTrack.Builder().setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build())
                        .setAudioFormat(new AudioFormat.Builder().setEncoding(encoding).setSampleRate((int)freqRange).setChannelMask(channels).build())
                        .setBufferSizeInBytes(minSize)
                        .setTransferMode(AudioTrack.MODE_STREAM)
                        .build();
            } else {
                audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, (int)freqRange, channels, encoding, minSize, AudioTrack.MODE_STREAM);
            }

            audioTrack.play();
            playInf = true;
            //GlobalApplication.goBgSong = false;
            AudioRecordClass.mediaMP3Player();



            int i = 0;
            pcount = 0;
            final int bufferSize = 4096;
            byte[] buffer = new byte[bufferSize];
            try {

                do {
                    pcount++;
                    i = is.read(buffer);
                    if (i < 0) break;


                    short[] shorts = new short[i / 2];

                    //WAV 파일의 데이터는 리틀-엔디언으로 되어 있다. 데이터를 읽을 때
                    //다음과 같이 리틀-엔디언으로 읽어 들이면 데이터의 위치가 바뀌어 진다.
                    ShortBuffer sb = ByteBuffer.wrap(buffer, 0, i).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer();
                    sb.get(shorts);

                    //음원을 Short 타입의 배열로 바꾸어 재생한다.
                    audioTrack.write(shorts, 0, shorts.length);
                    //GlobalApplication.goBgSong = true;

                    size -= i;
                } while (i >= 0 && playNum == "play");

                is.close();

            } catch (IOException e) {
                e.printStackTrace();
            }

            //audioTrack.stop();
            pcount = 0;
            audioTrack.release();
            playInf = false;


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }


    }


    public void audioProPlay(){

            playInf = true;
            playNum = "play";
            this.start();

    }

    public void audioProStop(){

            playInf = false;
            playNum = "stop";
            //audiostop();

    }

    public void audiostop() {

        //audioTrack.stop();
        audioTrack.release();
        //this.stop();
    }




}
