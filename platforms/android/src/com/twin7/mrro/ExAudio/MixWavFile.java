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
import com.twin7.mrro.util.Util;

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
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;



public class MixWavFile extends Thread {

    static boolean keepGoing;
    Context mContext;



    public MixWavFile(boolean b, Context mc){

        keepGoing = b;
        mContext = mc;
    }


    public void run(){

        final int freqBase = 100;
        final long freqrange = (long)44100;
        int sampleLength = 0;


        double angle = 0;
        double volume = 1.0; //볼륨 0.0 ~ 1.0 범위를 갖는다.

        Log.d("MixWavFile", "mix2Wav Run ");

        //mixFiles("http://mroo.co.kr/mrphp/music/imsi/aa.wav", "http://mroo.co.kr/mrphp/music/imsi/aa.wav", "http://mroo.co.kr/mrphp/music/imsi/imsi.mp4");
        //mixFilesWav("http://mroo.co.kr/mrphp/music/imsi/aa-bak.wav", "http://mroo.co.kr/mrphp/music/imsi/aa.wav", "http://mroo.co.kr/mrphp/music/imsi/imsi.mp4");



        //noMixWav("aa-bak.wav", "drVoice.wav", 11025, 2, 8);
        mix2Wav("song.wav", "imsi.wav", "endSong.wav");


    }





    public static  void mix2Wav(String urlMain, String urlSub, String fileOutput){
        Log.d("MixWavFile", "mix2Wav Start ");

        //서버에서  파일을 읽어 로컬에 저장한다.=====================================
        //String targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlMain.wav";
        //GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/"+urlMain, targetfile);

        //targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/voice/urlSub.wav";
        //GlobalApplication.readIntoFile("http://mroo.co.kr/mrphp/music/imsi/"+urlSub, targetfile);
        //==================================================================
        FileInputStream is = null;
        WaveHeader header;

        try {
            String mainFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/"+urlMain;
            String subFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/"+urlSub;
            String outFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/" + fileOutput;


            //GlobalApplication.setEchoWav(subFile);

            /*
            try {
                byte[] bytesTemp = GlobalApplication.sampleToByteArray(subFile, false);
                Log.d("effffff","setEchoWav Length********"+bytesTemp.length+"////SampleRate="+GlobalApplication.getSampleRate);
                byte [] temp = bytesTemp.clone();
                RandomAccessFile randomAccessFile = new RandomAccessFile(subFile, "rw");
                randomAccessFile.seek(44);
                //Echo
                int N = (int)((GlobalApplication.getSampleRate * 0.6));    //숫자가 클수록 에코 사이의 간격이 크다.
                for(int n = N + 64; n < bytesTemp.length; n++){
                    bytesTemp[n] = (byte)((int)((temp[n] + 0.4 * temp[n - N])));
                }
                randomAccessFile.write(bytesTemp);
                Log.d("effffff","setEchoWav********");


            } catch (IOException e) {
                e.printStackTrace();
                Log.d("effffff","setEchoWav Error33********");
            }
            */




            //song.wav 파일의 정보를 출력한다.
            try {

                is = new FileInputStream(mainFile);
                header = new WaveHeader(is);
                Log.d("mix2Wav", "mix2Wav00==========getSampleRate="+GlobalApplication.getSampleRate +" WAV File header \n" + header.toString(mainFile)+"//\ntotSzie="+(header.getChunkSize() + 8)+"///chSize="+ header.getChunkSize()+"//chSize2="+header.getChunk2Size()+"///diff="+(header.getChunkSize()-header.getSubChunk2Size()));
                header.setSampleRate(header.getSampleRate());


                GlobalApplication.getSampleRate = header.getSampleRate();
                GlobalApplication.getAudioFormat = header.getAudioFormat();
                GlobalApplication.getBitsPerSample = header.getBitsPerSample();
                GlobalApplication.gChannels = header.getChannels();


                byte[] dataMain = GlobalApplication.sampleToByteArray(mainFile, false); //종
                byte[] dataSub = GlobalApplication.sampleToByteArray(subFile, false); //종
                Log.d("MixWavFile", "mainFile len="+dataMain.length+"///"+header.toString(subFile));



                int AllLen = (int)header.getChunkSize() + 8;
                int DataLen = AllLen - 44;
                int fileLen = (DataLen * (GlobalApplication.gChannels)) + 44;   //채널의 숫자




                long golen = (dataMain.length * 2);
                byte[] output = new byte[(int)golen];


                for (int bf = 0; bf < 44; bf++) {   //0~43bit 값을 읽어서 배열에 저장
                    output[bf] = dataMain[bf];
                }

                int chnn = 4;   //4채널
                output[22] = (byte)(chnn >> 0);
                output[23] = (byte)(chnn >> 8);

                long chkSize = ((header.getChunkSize() *2) - 44);
                Log.d("MixChkSize","+++++dataMain="+header.getChunkSize()+"/////+chkSize="+chkSize);
                output[4] = (byte)(chkSize >> 0);
                output[5] = (byte)(chkSize >> 8);
                output[6] = (byte)(chkSize >> 16);
                output[7] = (byte)(chkSize >> 24);

                output[36] = dataSub[36]; //d
                output[37] = dataSub[37]; //a
                output[38] = dataSub[38]; //t
                output[39] = dataSub[39]; //a


                chkSize -= 36;
                output[40] = (byte)(chkSize >> 0);
                output[41] = (byte)(chkSize >> 8);
                output[42] = (byte)(chkSize >> 16);
                output[43] = (byte)(chkSize >> 24);



                //headOutput = null;
                Log.d("MixWavFile", "===Channels="+GlobalApplication.gChannels+"===File size=dataMain=" + dataMain.length + "//dataSub=" + dataSub.length + "////==All length=" + fileLen);


                int rr = 44;
                int bts = (GlobalApplication.getBitsPerSample / 8);
                bts *= 2;
                int gubun = GlobalApplication.gChannels;
                gubun = 4;
                switch(gubun){
                    case 2:

                        //bts *= 2;
                        Log.d("MixFile", "======bts="+bts);

                        int subC = 44;
                        //output 배열의 크기가 실제 데이터 보다 크도 괜찮다.
                        for (int i = 44; i < dataSub.length; i += bts) {

                            output[rr++] = dataSub[i];   //left
                            output[rr++] = dataSub[i+1];

                            //Log.d("MixFile","++++++"+dataMain[i]+"--"+dataMain[i+1]+"||||"+dataSub[i]+"--"+dataSub[i+1]);

                        }


                        break;
                    case 3:

                        for (int i = 44; i < dataMain.length; i++) {
                            output[rr++] = dataMain[i];   //left
                            output[rr++] = dataMain[i];   //right

                            if (i < dataSub.length) {
                                output[rr++] = dataSub[i];  //center
                            } else {
                                //if (rr < fileLen) output[rr++] = dataMain[i];
                            }

                        }

                        break;
                    case 4:


                        rr = 44;
                        for (int i = 44; i < dataMain.length; i += bts) {

                            if(i < (dataSub.length - 4)) {
                                output[rr++] = dataSub[i + 0];   //front right
                                output[rr++] = dataSub[i + 1];   //front right
                                output[rr++] = dataSub[i + 2];   //front left
                                output[rr++] = dataSub[i + 3];   //front left

                            }else{
                                if(i < (dataMain.length - 4)) {
                                    output[rr++] = 0;
                                    output[rr++] = 0;
                                    output[rr++] = 0;
                                    output[rr++] = 0;
                                }
                            }

                            if(i < (dataMain.length - 4)) {
                                output[rr++] = dataMain[i + 4];   //lear right
                                output[rr++] = dataMain[i + 5];   //lear right
                                output[rr++] = dataMain[i + 6];   //lear left
                                output[rr++] = dataMain[i + 7];   //lear left

                            }

                        }

                        break;
                }


                saveToFile(output, outFile);


                Log.d("mixwav","***************end*************"+outFile+"///mainLen="+dataMain.length+"////output len="+output.length);
                /*
                FileInputStream is2 = new FileInputStream(outFile);
                WaveHeader header2 = new WaveHeader(is2);
                header2.toString();
                */

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }


        }catch (IOException e) {
            e.printStackTrace();
        }



    }




    static public byte chunk12x(int count, long value){
        int gg = 0;

        long jk = value;
        jk = (value * 2) + 4;

        switch(count){
            case 0:
                gg = (int)jk >> 0;
                break;
            case 1:
                gg = (int)jk >> 8;
                break;
            case 2:
                gg = (int)jk >> 16;

                break;
            case 3:
                gg = (int)jk >> 24;
                break;
        }

        return (byte)gg;
    }

    static public byte chunk22x(int count, long value){
        int gg = 0;

        long jk = value;
        jk = (value * 2) + 36;

        switch(count){
            case 0:
                gg = (int)jk >> 0;
                break;
            case 1:
                gg = (int)jk >> 8;
                break;
            case 2:
                gg = (int)jk >> 16;

                break;
            case 3:
                gg = (int)jk >> 24;
                break;
        }

        return (byte)gg;
    }


    static public byte dexTobinSet4(int count, long value){

        int gg = 0;
        switch(count){
            case 0:
                gg = (int)value >> 0;
                break;
            case 1:
                gg = (int)value >> 8;
                break;
            case 2:
                gg = (int)value >> 16;

                break;
            case 3:
                gg = (int)value >> 24;
                break;
        }

        return (byte)gg;

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


            byte[] dataMain = GlobalApplication.sampleToByteArray(mainFile, false); //종


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


    public static void mixFilesWav(String url, String fileInput2, String fileOuput){

        int freqBase = 100;
        final long freqrange = (long) 44100;
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

            byte[] data0 = GlobalApplication.sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/hh2.wav", false); //종

            byte[] data = GlobalApplication.sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/hh.wav", false); //종



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
            byte[] data = GlobalApplication.sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/hh.wav", false);

            byte[] data2 = GlobalApplication.sampleToByteArray(Environment.getExternalStorageDirectory().getAbsolutePath()+ "/mrro/voice/cc.wav", false);


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

            for(int i=0; i<mix.length; i++) dos.writeByte(mix[i]);


            Util.convertAudio("endSong.wav", "MP3");


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
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
