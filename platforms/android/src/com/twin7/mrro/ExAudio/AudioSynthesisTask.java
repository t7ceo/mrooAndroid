package com.twin7.mrro.ExAudio;

import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Build;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

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
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import com.twin7.mrro.GlobalApplication.GlobalApplication;



public class AudioSynthesisTask extends Thread {

    static boolean keepGoing;


    public AudioSynthesisTask(boolean b){

        keepGoing = b;

    }


    public void run(){

        final int freqBase = 100;
        final long freqrange = (long)44100;
        int sampleLength = 0;


        double angle = 0;
        double volume = 1.0; //볼륨 0.0 ~ 1.0 범위를 갖는다.

        //mixFiles("http://mroo.co.kr/mrphp/music/imsi/aa.wav", "http://mroo.co.kr/mrphp/music/imsi/aa.wav", "http://mroo.co.kr/mrphp/music/imsi/imsi.mp4");
        //mixFilesWav("http://mroo.co.kr/mrphp/music/imsi/aa-bak.wav", "http://mroo.co.kr/mrphp/music/imsi/aa.wav", "http://mroo.co.kr/mrphp/music/imsi/imsi.mp4");




        //mix2Wav("aa-bak.wav", "cc.wav", "drVoice.wav", 11025, 4, 8);
        noMixWav("aa-bak.wav", "drVoice.wav", 11025, 2, 8);



/*
        //스트림 모드를 위해 버퍼 크기를 미리 계산한다.
            int minSize = AudioTrack.getMinBufferSize(freqrange, AudioFormat.CHANNEL_CONFIGURATION_STEREO, AudioFormat.ENCODING_PCM_16BIT);

            AudioTrack audioTrack;

            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
                //안드로이드 버전 6.0 이후에서 사용한다.
                audioTrack = new AudioTrack.Builder().setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
                        .setAudioFormat(new AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT).setSampleRate(freqrange).setChannelMask(AudioFormat.CHANNEL_OUT_STEREO).build())
                        .setBufferSizeInBytes(minSize)
                        .setTransferMode(AudioTrack.MODE_STREAM).build();
            }else{
                //안드로이드 버전 6.0 이전에서 사용한다.
                audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, freqrange, AudioFormat.CHANNEL_CONFIGURATION_STEREO,
                        AudioFormat.ENCODING_PCM_16BIT, minSize, AudioTrack.MODE_STREAM);
            }


//////============================
        //로컬에 옴긴파일과 서버의 파일을 설정한다.
        List<Short> music1 = createMusicArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/aa.wav");
        List<Short> music2 = createMusicArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/cc.wav");


        //completeStreams(music1, music2);
        short[] music1Array = buildShortArray(music1);
        //short[] music2Array = buildShortArray(music2);

        sampleLength = music1Array.length;


//////================================

        short samples[] = new short[sampleLength * 2]; //버퍼를 두배로 잡아야 한다.

        Log.d("MixFile","====SampleLength="+sampleLength+"///samples[]="+samples.length);

        audioTrack.play();

        final double fix = 2 * Math.PI;
            //종료를 요청하기 전까지는 무한반복작업을 수행한다.
            while(keepGoing){
                int rr = 0;
                for(int i=0; i < sampleLength; i++){
                    //angle += fix * freqBase / freqrange;

                    //왼쪽 채널의 소리를 만든다.
                    //samples[i++] = (short)(Math.sin(angle) * volume * Short.MAX_VALUE);
                    samples[rr] = (short)music1Array[i];

                    //Log.d("MixFile","====samples[rr]="+samples[rr]);
                    rr++;

                    //오른쪽 채널의 소리를 만든다.
                    //samples[i] = (short) (Math.cos(angle) * volume * Short.MAX_VALUE);
                    //samples[rr] = (short)music2Array[i];


                    //if(angle > (fix)) angle -= (fix);
                }



                byte[] byteBuffer = new byte[samples.length];
                int idx = 0;
                for(int i = 0; i < byteBuffer.length; i++){
                    int x = (int) (samples[idx++] * 127); //서로 교차하여 입력한다.
                    //int x = (int) (samples[idx++] * 1); //서로 교차하여 입력한다.
                    byteBuffer[i] = (byte) x;
                }


                //만들어진 값은 버퍼에 넣는다.
                audioTrack.write(samples, 0, samples.length);



            }

            //무한 반복 작업을 벗어나면 재생 작업을 종료시킨다.
            audioTrack.stop();
            audioTrack.release();

//*/



    }




    public void audiostop(){
        keepGoing = false;
    }


    private static short[] buildShortArray(List<Short> track){

        Log.d("MixFile","=====Track.size="+track.size());

        short[] shorts = new short[track.size()];
        for(int i=0; i < track.size(); i++)
            shorts[i] = track.get(i);
        return shorts;
    }

    public static void noMixWav(String urlMain, String fileOutput, int sampleRate, int chanel, int bitInf){

        //서버에서  파일을 읽어 로컬에 저장한다.=====================================
        String targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlMain.wav";
        GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/"+urlMain, targetfile);

        targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlSub.wav";
        //GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/"+urlSub, targetfile);
        //==================================================================

        try {
            String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/record3.wav";
            //String subFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/record3.wav";
            //String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlMain.wav";
            //String subFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlSub.wav";
            String outFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/" + fileOutput;


            byte[] dataMain = sampleToByteArray(mainFile, false); //종


            int fileLen = ((dataMain.length * (chanel / 2)));   //채널의 숫자
            byte[] output = new byte[fileLen];




            String ll;
            for (int ii = 0; ii < 44; ii++) {   //0~43bit 값을 읽어서 배열에 저장
                output[ii] = dataMain[ii];
                Log.d("MixFile", "0~43BIT====index===" + ii + "---Main=" + Integer.toBinaryString(dataMain[ii]));
            }
            Log.d("MixFile", "====File size=dataMain=" + dataMain.length + "////==fileLen=" + fileLen+"///output len="+output.length+"////disp gab="+bintodex("01000110"));


            int[] lt = littleEnd(dextobin(output.length - 8), 4);
            output[4] = (byte) lt[0];
            output[5] = (byte) lt[1];
            output[6] = (byte) lt[2];
            output[7] = (byte) lt[3];
            //--------------------------------------------------------------------------------
            int[] lt2 = littleEnd(dextobin(16), 4);
            output[16] = (byte) lt2[0];
            output[17] = (byte) lt2[1];
            output[17] = (byte) lt2[2];
            output[17] = (byte) lt2[3];
            //--------------------------------------------------------------------------------
            output[20] = (byte) 1;  //pcm 포맷
            output[21] = (byte) 0;
            //--------------------------------------------------------------------------------
            int[] lt3 = littleEnd(dextobin(chanel), 2);
            output[22] = (byte) lt3[0];  //채널 수
            output[23] = (byte) lt3[1];
            Log.d("MixFile", "====Byte 22===" + output[22] + "////rr=" + (byte) 3 + "///ox=" + 0x3);
            //--------------------------------------------------------------------------------
            int[] lt7 = littleEnd(dextobin(bitInf * chanel), 2);
            output[34] = (byte)lt7[0];     //샘플의 비트수를 가리킨다. - 8비트 단위로 저장했기 때문에 8비트 단위로 데이트를 읽는다.
            output[35] = (byte)lt7[1];
            //--------------------------------------------------------------------------------
            int[] lt6 = littleEnd(dextobin(((bitInf * chanel) * chanel) / 8), 2);
            output[32] = (byte)lt6[0];  //블록배열 하나의 샘플이 차지하는 크기를 바이트로 (output[34] * channels) / 8
            output[33] = (byte)lt6[1];
            //--------------------------------------------------------------------------------



/*
            //==================================================================
            //
            //==================================================================

            int[] lt4 = littleEnd(dextobin(sampleRate), 4);
            output[24] = (byte)lt4[0];  //샘플-레이트
            output[25] = (byte)lt4[1];
            output[26] = (byte)lt4[2];
            output[27] = (byte)lt4[3];



            int[] lt5 = littleEnd(dextobin((sampleRate * bitInf * chanel) / 8), 4);
            output[28] = (byte)lt5[0];   //바이트-레이트
            output[29] = (byte)lt5[1];
            output[30] = (byte)lt5[2];
            output[31] = (byte)lt5[3];

            //===================================================================
*/





            //output[40] = (byte)52; /// lt8[0];  //4~7비트 사이의 값에서 40을 뺀값이다.

//*
            int[] lt8 = littleEnd(dextobin((output.length - 44)), 4);
            output[40] = (byte) lt8[0];  //4~7비트 사이의 값에서 43을 뺀값이다.
            output[41] = (byte) lt8[1];
            output[42] = (byte) lt8[2];
            output[43] = (byte) lt8[3];
//*/
            //===================================


            int rr = 44;
            switch(chanel){
                case 1:
                case 2:

                    for (int i = 44; i < dataMain.length; i++) {
                        output[rr++] = dataMain[i];   //left
                        //output[rr++] = dataMain[i];  //right
                    }

                    break;

            }


            for(int o=0; o < 44; o++){
                Log.d("MixFile", "====Output ArrGab["+o+"]=" + Integer.toBinaryString(output[o]));
            }

            Log.d("MixFile", "====Output size===" + output.length + "////rr=" + rr+"////"+output[4]+"/"+output[5]+"/"+output[6]+"/"+output[7]+"///"+output[40]+"/"+output[41]+"/"+output[42]+"/"+output[43]+"///bintodex(00100110)="+bintodex("00000000"));

            saveToFile(output, outFile);

        }catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static  void mix2Wav(String urlMain, String urlSub, String fileOutput, int sampleRate, int chanel, int bitInf){

        //서버에서  파일을 읽어 로컬에 저장한다.=====================================
        String targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlMain.wav";
        GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/"+urlMain, targetfile);

        targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlSub.wav";
        GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/"+urlSub, targetfile);
        //==================================================================


        try {
            String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/record.wav";
            String subFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/record3.wav";
            //String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlMain.wav";
            //String subFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlSub.wav";
            String outFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/" + fileOutput;


            byte[] dataMain = sampleToByteArray(mainFile, false); //종
            byte[] dataSub = sampleToByteArray(subFile, false); //종


            int fileLen = ((dataMain.length * chanel));   //채널의 숫자
            byte[] output = new byte[fileLen];


            String ll;
            for (int ii = 0; ii < 44; ii++) {   //0~43bit 값을 읽어서 배열에 저장
                output[ii] = dataMain[ii];
                Log.d("MixFile", "0~43BIT====index===" + ii + "---Main=" + dataMain[ii] + "----Sub=" + dataSub[ii]);
            }
            Log.d("MixFile", "====File size=dataMain=" + dataMain.length + "//dataSub=" + dataSub.length + "////==All length=" + fileLen);

            //int allLength = output.length;


            int[] lt = littleEnd(dextobin(output.length - 4), 4);
            output[4] = (byte) lt[0];
            output[5] = (byte) lt[1];
            output[6] = (byte) lt[2];
            output[7] = (byte) lt[3];



            int[] lt2 = littleEnd(dextobin(16), 4);
            output[16] = (byte) lt2[0];
            output[17] = (byte) lt2[1];
            output[17] = (byte) lt2[2];
            output[17] = (byte) lt2[3];


            output[20] = (byte) 1;  //pcm 포맷
            output[21] = (byte) 0;


            int[] lt3 = littleEnd(dextobin(chanel), 2);
            output[22] = (byte) lt3[0];  //채널 수
            output[23] = (byte) lt3[1];
            Log.d("MixFile", "====Byte 22===" + output[22] + "////rr=" + (byte) 3 + "///ox=" + 0x3);



            //==================================================================
            //
            //==================================================================
            //*
            int[] lt4 = littleEnd(dextobin(sampleRate), 4);
            output[24] = (byte)lt4[0];  //샘플-레이트
            output[25] = (byte)lt4[1];
            output[26] = (byte)lt4[2];
            output[27] = (byte)lt4[3];
            //*/

            //*
            int[] lt5 = littleEnd(dextobin((sampleRate * bitInf * chanel) / 8), 4);
            output[28] = (byte)lt5[0];   //바이트-레이트
            output[29] = (byte)lt5[1];
            output[30] = (byte)lt5[2];
            output[31] = (byte)lt5[3];
            //*/
            //===================================================================

            int[] lt6 = littleEnd(dextobin((bitInf * chanel) / 8), 2);
            output[32] = (byte)lt6[0];  //블록배열 하나의 샘플이 차지하는 크기를 바이트로 (output[34] * channels) / 8
            output[33] = (byte)lt6[1];

            //===================================
            int[] lt7 = littleEnd(dextobin(bitInf), 2);
            output[34] = (byte)lt7[0];     //샘플의 비트수를 가리킨다. - 8비트 단위로 저장했기 때문에 8비트 단위로 데이트를 읽는다.
            output[35] = (byte)lt7[1];
            //====================================

/*
            int[] lt8 = littleEnd(dextobin((allLength - 44)), 4);
            output[40] = (byte) lt8[0];  //4~7비트 사이의 값에서 43을 뺀값이다.
            output[41] = (byte) lt8[1];
            output[42] = (byte) lt8[2];
            output[43] = (byte) lt8[3];
*/
            //===================================


            int rr = 44;
            switch(chanel){
                case 2:

                    for (int i = 44; i < dataMain.length; i++) {
                        output[rr++] = dataMain[i];   //left

                        if (i < dataSub.length) {
                            output[rr++] = dataSub[i];  //right
                        } else {
                            if (rr < fileLen) output[rr++] = dataMain[i];
                        }

                    }

                    break;
                case 3:

                    for (int i = 44; i < dataMain.length; i++) {
                        output[rr++] = dataMain[i];   //left
                        output[rr++] = dataMain[i];   //right

                        if (i < dataSub.length) {
                            output[rr++] = dataSub[i];  //center
                        } else {
                            if (rr < fileLen) output[rr++] = dataMain[i];
                        }

                    }

                    break;
                case 4:

                    for (int i = 44; i < dataMain.length; i++) {
                        output[rr++] = dataMain[i];   //front left
                        output[rr++] = dataMain[i];   //front right

                        if (i < dataSub.length) {
                            output[rr++] = dataSub[i];  //rear left
                            output[rr++] = dataSub[i];  //rear right
                        } else {
                            if (rr < fileLen){
                                output[rr++] = dataMain[i];
                                output[rr++] = dataMain[i];
                            }
                        }

                    }

                    break;
            }


            for(int o=0; o < 44; o++){
                Log.d("MixFile", "====Output ArrGab["+o+"]=" + output[o]);
            }

            Log.d("MixFile", "====Output size===" + output.length + "////rr=" + rr+"////"+output[4]+"/"+output[5]+"/"+output[6]+"/"+output[7]+"///"+output[40]+"/"+output[41]+"/"+output[42]+"/"+output[43]);

            saveToFile(output, outFile);

        }catch (IOException e) {
            e.printStackTrace();
        }



    }


    public static void mixFilesWav(String url, String fileInput2, String fileOuput){

        int freqBase = 100;
        final long freqrange = (long)44100;
        int sampleLength = 0;


        double angle = 0;
        double volume = 1.0; //볼륨 0.0 ~ 1.0 범위를 갖는다.


        String targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/hh.wav";
        fileOuput = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/endgo.wav";

        Log.d("MixFile", "===="+targetfile);
        //url을 읽어서 로컬에 저장한다. url -> targetfile;
        GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/aa-bak.wav", targetfile);
        targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/hh2.wav";
        //url을 읽어서 로컬에 저장한다. url -> targetfile;
        GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/cc.wav", targetfile);

        fileOuput = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/outf.wav";



        try {

            byte[] data0 = sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/hh2.wav", false); //종

            byte[] data = sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/hh.wav", false); //종



            int fileLen = ((data.length * 3));   //3채널
            byte[] output = new byte[fileLen];

            String ll;
            for(int ii=0; ii < 44; ii++){   //0~43bit 값을 읽어서 배열에 저장
                output[ii] = data[ii];
                Log.d("MixFile", "0~43BIT====index==="+ii+"---"+data0[ii]+"----data="+data[ii]);
            }
            Log.d("MixFile", "====File size=data="+data.length+"//data0="+data0.length+"////==All length="+Integer.toBinaryString(fileLen)+"///=="+fileLen);




            int[] lt = littleEnd(dextobin((output.length - 4)), 4);
            //Log.d("mixA", "innnnn="+lt[0]+"//"+lt[1]);


            output[4] = (byte)lt[0];
            output[5] = (byte)lt[1];
            output[6] = (byte)lt[2];
            output[7] = (byte)lt[3];

            output[16] = (byte)16;

            output[20] = (byte)1;  //pcm 포맷
            output[21] = (byte)0;


            output[22] = (byte)3;  //채널 수
            output[23] = (byte)0;

            Log.d("MixFile", "====Byte 22==="+output[22]+"////rr="+(byte)3+"///ox="+0x3);

            //=================================
            //*
            output[24] = (byte)17;  //샘플-레이트
            output[25] = (byte)43;
            output[26] = (byte)0;
            output[27] = (byte)0;

            output[28] = (byte)17;   //바이트-레이트
            output[29] = (byte)43;
            output[30] = (byte)0;
            output[31] = (byte)0;
            //*/
            //==================================

            output[32] = (byte)3;  //블록배열 하나의 샘플이 차지하는 크기를 바이트로 (output[34] * channels) / 8
            output[33] = (byte)0;

            //===================================

            output[34] = (byte)8;     //샘플의 비트수를 가리킨다. - 8비트 단위로 저장했기 때문에 8비트 단위로 데이트를 읽는다.
            output[35] = (byte)0;
            //====================================



            int[] lt2 = littleEnd(dextobin((output.length - 43)), 4);
            //Log.d("mixA", "innnnn="+lt[0]+"//"+lt[1]);


            output[40] = (byte)lt2[0];  //4~7비트 사이의 값에서 43을 뺀값이다.
            output[41] = (byte)lt2[1];
            output[42] = (byte)lt2[2];
            output[43] = (byte)lt2[3];

            //===================================


                int rr = 44;
                for (int i = 44; i < data.length; i++) {
                        output[rr++] = data[i];   //left
                        output[rr++] = data[i];   //right

                        if (i < data0.length){
                            output[rr++] = data0[i];  //center
                        }else{
                            if(rr < fileLen) output[rr++] = data[i];
                        }

                }


            Log.d("MixFile", "====Output size==="+output.length+"////rr="+rr+"////bintodex(00100110)"+bintodex("00100110"));

            saveToFile(output, fileOuput);


        } catch (IOException e) {
            e.printStackTrace();
        }



    }


    public static void mixFiles(String url, String fileInput2, String fileOuput){

        int freqBase = 100;
        final long freqrange = (long)44100;
        int sampleLength = 0;


        double angle = 0;
        double volume = 1.0; //볼륨 0.0 ~ 1.0 범위를 갖는다.


        //스트림 모드를 위해 버퍼 크기를 미리 계산한다.
        int minSize = AudioTrack.getMinBufferSize((int)freqrange, AudioFormat.CHANNEL_CONFIGURATION_STEREO, AudioFormat.ENCODING_PCM_16BIT);

        AudioTrack audioTrack;

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
            //안드로이드 버전 6.0 이후에서 사용한다.
            audioTrack = new AudioTrack.Builder().setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build())
                    .setAudioFormat(new AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT).setSampleRate((int)freqrange).setChannelMask(AudioFormat.CHANNEL_OUT_STEREO).build())
                    .setBufferSizeInBytes(minSize)
                    .setTransferMode(AudioTrack.MODE_STREAM).build();
        }else{
            //안드로이드 버전 6.0 이전에서 사용한다.
            audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, (int)freqrange, AudioFormat.CHANNEL_CONFIGURATION_STEREO,
                    AudioFormat.ENCODING_PCM_16BIT, minSize, AudioTrack.MODE_STREAM);
        }


        String targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/hh.wav";
        fileOuput = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/end.wav";

        Log.d("MixFile", "===="+targetfile);
        //url을 읽어서 로컬에 저장한다. url -> targetfile;
        GlobalApplication.readIntoFile(url, targetfile);




        //로컬에 옴긴파일과 서버의 파일을 설정한다.
        //List<Short> music1 = createMusicArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/imsi2.wav");
        //List<Short> music2 = createMusicArray(fileInput2);


        try {
            byte[] data = sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/hh.wav", false);

            byte[] data2 = sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/cc.wav", false);


            Log.d("MixFile", "====File size==="+data.length+"////=="+data.length);

            int fileLen = (data.length + data2.length);
            byte[] output = new byte[fileLen];

            for(int i=0; i < 44; i++){

                output[i] = data[i];

            }

            output[20] = 01;
            output[21] = 00;
            output[22] = 02;
            output[23] = 00;

            //output[34] = 10;
            //output[35] = 00;

            audioTrack.play();

            while(keepGoing) {

                int rr = 44;
                for (int i = 44; i < data2.length; i++) {

                    output[rr++] = data2[i];
                    if (i < data2.length) output[rr++] = data[i];

                }

                //만들어진 값은 버퍼에 넣는다.
                audioTrack.write(output, 0, output.length);
            }

            //saveToFile(output, fileOuput);


        } catch (IOException e) {
            e.printStackTrace();
        }


/*
        try {
            byte[] data = sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/imsi2.wav", false);


            //completeStreams(music1, music2);
            //short[] music1Array = buildShortArray(music1);
            //short[] music2Array = buildShortArray(music2);

            Log.d("MixFile", "====File size==="+music1Array.length+"////=="+music2Array.length);


            short[] output = new short[music1Array.length];
            for(int i=0; i < output.length; i++){

                float samplef1 = music1Array[i] / 32768.0f;
                float samplef2 = music2Array[i] / 32768.0f;

                float mixed = samplef1 + samplef2;
                // reduce the volume a bit:
                mixed *= 0.8;
                // hard clipping
                if (mixed > 1.0f) mixed = 1.0f;
                if (mixed < -1.0f) mixed = -1.0f;
                short outputSample = (short)(mixed * 32768.0f);

                output[i] = outputSample;
            }

            saveToFile(output, fileOuput);


        } catch (IOException e) {
            e.printStackTrace();
        }
*/


    }

    private static List<Short> createMusicArray(String fileName){
        List<Short> audioData = new ArrayList<>();
        try {
            File file = new File(fileName);
            InputStream is = new FileInputStream(file);
            BufferedInputStream bis = new BufferedInputStream(is);
            DataInputStream dis = new DataInputStream(bis);
            int audioLength = (int) file.length();

            //INSERTING THE DATA IN THE FILE TO FILL THE UADIODATA ARRAY
            int i = 0;
            while (dis.available() > 0 && i < audioLength) {
                short data = dis.readShort();
                audioData.add(data);
                i++;
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return audioData;
    }

    private static void completeStreams(List<Short> track1, List<Short> track2){
        int size1 = track1.size();
        int size2 = track2.size();
        if(size1 > size2)
            completeList(track2, size1-size2);
        else if(size2 > size1)
            completeList(track1, size2-size1);
    }

    private static void completeList(List<Short> track, int difference){
        for(int i=0; i<difference; i++){
            Short data = 0;
            track.add(data);
        }
    }

    private static void saveToFile(byte[] mix, String targetFile){
        try {
            File output = new File(targetFile);
            OutputStream os = new FileOutputStream(output);
            BufferedOutputStream bos = new BufferedOutputStream(os);
            DataOutputStream dos = new DataOutputStream(bos);

            for(int i=0; i<mix.length; i++)
                dos.writeByte(mix[i]);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    public static byte[] sampleToByteArray(String sample, boolean swap) throws IOException{
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(sample));
        int BUFFERSIZE = 102400;
        byte[] buffer = new byte[BUFFERSIZE];
        while(bis.read(buffer) != - 1){
            baos.write(buffer);
        }
        byte[] outputByteArray = baos.toByteArray();
        bis.close();
        baos.close();

        if(swap){
            for(int i=0; i < outputByteArray.length - 1; i=i+2){
                byte byte0 = outputByteArray[i];
                outputByteArray[i] = outputByteArray[i+1];
                outputByteArray[i+1] = byte0;
            }
        }

        return outputByteArray;
    }


/*
    public void testPlay(String mp3) {
        try {
            File file = new File(mp3);
            AudioInputStream in = AudioSystem.getAudioInputStream(file);
            AudioInputStream din = null;
            AudioFormat baseFormat = in.getFormat();
            AudioFormat decodedFormat = new AudioFormat(AudioFormat.Encoding.PCM_SIGNED,
                    baseFormat.getSampleRate(),
                    16,
                    baseFormat.getChannels(),
                    baseFormat.getChannels() * 2,
                    baseFormat.getSampleRate(),
                    false);
            din = AudioSystem.getAudioInputStream(decodedFormat, in);

            play(decodedFormat, din);
            spi(decodedFormat, in);
            in.close();
        } catch (Exception e) {
            System.out.println("MP3");
        }

    }


    private void play(AudioFormat targetFormat, AudioInputStream din) throws IOException, LineUnavailableException {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] data = new byte[4096];
        SourceDataLine line = getLine(targetFormat);

        int nBytesRead = 0, nBytesWritten = 0;
        while (nBytesRead != -1) {
            nBytesRead = din.read(data, 0, data.length);
            if (nBytesRead != -1) {
                nBytesWritten = line.write(data, 0, nBytesRead);
                out.write(data, 0, 4096);
            }

        }

        byte[] audio = out.toByteArray();

    }
*/


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
