package com.twin7.mrro.ExAudio;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Build;
import android.os.Environment;
import android.util.Log;

import com.twin7.mrro.GlobalApplication.GlobalApplication;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class AudioSynthesisTask2 extends Thread {

    final String TAG = "SimpleAudioTrack";
    final Context mContext;
    AudioTrack audioTrack;

    public AudioSynthesisTask2(Context c){
        mContext = c;
    }


    public void run(){

        String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/imsi.wav";
        try {
            FileInputStream is = new FileInputStream(mainFile);

            WaveHeader header = new WaveHeader(is);
            Log.d(TAG, mainFile+" WAV File header \n" + header.toString(mainFile));




            int channels;  //안드로이드 채널 상수를 사용한다.
            switch(header.getChannels()){
                case 1: channels = AudioFormat.CHANNEL_OUT_MONO; break;
                case 2: channels = AudioFormat.CHANNEL_OUT_STEREO; break;
                case 4: channels = AudioFormat.CHANNEL_OUT_QUAD; break;
                default:
                    Log.d(TAG, "WAV channels error \n");
                    return;
            }

            final long freqRange = header.getSampleRate();

            //WAV 파일 내 데이터의 크기가 잘못된 것이 많아 검증하기 위해 사용했다.
            long size = header.getSubChunk2Size();
            int encoding; //WAV 파일은 숫자인 반면에 안드로이드는 인코딩 상수를 사용한다.

            switch(header.getBitsPerSample()){
                case 8: encoding = AudioFormat.ENCODING_PCM_8BIT; break;
                case 16: encoding = AudioFormat.ENCODING_PCM_16BIT; break;
                default:
                    encoding = AudioFormat.ENCODING_INVALID;
            }

            //내부 버퍼의 크기를 계산한다.
            int minSize = AudioTrack.getMinBufferSize((int)freqRange, channels, encoding);

            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
                audioTrack = new AudioTrack.Builder().setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build())
                        .setAudioFormat(new AudioFormat.Builder().setEncoding(encoding).setSampleRate((int)freqRange).setChannelMask(channels).build())
                        .setBufferSizeInBytes(minSize)
                        .setTransferMode(AudioTrack.MODE_STREAM)
                        .build();
            }else{
                audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, (int)freqRange, channels, encoding, minSize, AudioTrack.MODE_STREAM);
            }

            audioTrack.play();

            int i = 0;
            final int bufferSize = 4096;
            byte [] buffer = new byte[bufferSize];
            try{
                do{
                    i = is.read(buffer);
                    if(i < 0) break;

                    short[] shorts = new short[i / 2];

                    //WAV 파일의 데이터는 리틀-엔디언으로 되어 있다. 데이터를 읽을 때
                    //다음과 같이 리틀-엔디언으로 읽어 들이면 데이터의 위치가 바뀌어 진다.
                    ShortBuffer sb = ByteBuffer.wrap(buffer, 0, i).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer();
                    sb.get(shorts);

                    //음원을 Short 타입의 배열로 바꾸어 재생한다.
                    audioTrack.write(shorts, 0, shorts.length);

                    size -= i;
                } while (i >= 0);

                is.close();

            } catch (IOException e) {
                e.printStackTrace();
            }

            audioTrack.stop();
            audioTrack.release();


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }


        //noMixWav("aa-bak.wav", "drVoice.wav", 11025, 2, 8);

    }

    public void audiostop() {

        audioTrack.stop();
    }





    public static String dextobin(int g){

        //Log.d("mixA","dex="+g+"///bin="+Integer.toBinaryString(g));

        return Integer.toBinaryString(g);
    }

    public static int bintodex(String s){

        //Log.d("mixA","bin="+s+"///dex="+Integer.parseInt(s, 2));

        return Integer.parseInt(s, 2);
    }

    public static int[] littleEnd(String lt, int arsu){

        int len = lt.length();
        int addgab = 8;

        int [] gg = new int[arsu];
        Arrays.fill(gg, 0);


        int indx = 0;
        int ading = 0;
        while((len - ading) > 7){
            ading = (indx + 1) * addgab;

            gg[indx] = bintodex(lt.substring(len - ading, (len - (addgab * indx))));
            indx++;
        }
        if((len - ading) > 0){
            gg[indx++] = bintodex(lt.substring(0, (len - ading)));
        }

        /*
        for(int h = 0; h < indx; h++){
            Log.d("mixA", "array gg="+gg[h]+"///");
        }
        */

        return gg;
    }



}
