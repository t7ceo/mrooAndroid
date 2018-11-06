package com.twin7.mrro.util;

import android.content.ContentValues;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;

import com.twin7.mrro.ExAudio.GetMusic;
import com.twin7.mrro.GlobalApplication.GlobalApplication;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;

import cafe.adriel.androidaudioconverter.AndroidAudioConverter;
import cafe.adriel.androidaudioconverter.callback.IConvertCallback;

public class Util {

    static Context mContext;
    static GetMusic getMusic;

    public static class NetworkTask extends AsyncTask<String, Integer, String> {

        private ContentValues valuesg;
        private String Songid;

        public NetworkTask(ContentValues values, Context mContextg, String songid) {
            mContext = mContextg;
            valuesg = values;
            Songid = songid;
        }


        protected void onPreExecute(){
            //super.onPreExecute();
            Log.d("RecordingActivity", "onPostExecutet Start======");
        }


        protected String doInBackground(String... url){

            String result;
            RequestHttpURLConnection requestHttpURLConnection = new RequestHttpURLConnection();
            result = requestHttpURLConnection.request(url[0], valuesg);

            return result;
        }

        @Override
        protected void onCancelled() {


            super.onCancelled();
        }

        protected void onPostExecute(String s){

            Log.d("RecordingActivity", "onPostExecutett====444=="+s);

            endFunSongId(s, Songid);

            //doInBackground() 로 부터 리턴된 값이 onPostExecute()의 매개변수로 넘어 오므로 s를 출력한다.
            super.onPostExecute(s);

        }

    }


    public static void endFunSongId(String s, String  songId){
        //AsyncTask  결과 처리한다.
        //서버에서 mp3 파일을 로컬로 다운로드 하고 song.wav 라는 파일로 컨버터 한다.
        Log.d("RecordingActivity", "endFunSongId====="+s);
        String sng = "";
        String fld = "";

        try {
            JSONObject jo = new JSONObject(s);   // JSONArray 생성

            sng = songId+jo.getString("endfix");
            fld = jo.getString("fdir");
            fld = fld.replace("../", "/");
            fld = "http://mroo.co.kr"+fld;


            Log.d("RecordingActivity", "json==="+fld+"/"+sng);

            //서버에서 음악을 가져와서 로컬에 저장한다
            //서버에서 mp3 파일을 로컬로 다운로드 하고 song.wav 라는 파일로 컨버터 한다.
            getMusic = new GetMusic(mContext, fld+"/"+sng);
            getMusic.start();

        } catch (JSONException e) {
            e.printStackTrace();
        }


    }



    public static void convertAudio( String sourceF, String typeG){
        /**
         *  Update with a valid audio file!
         *  Supported formats: {@link AndroidAudioConverter.AudioFormat}
         */

        //File wavFile = new File(Environment.getExternalStorageDirectory(), "recorded_audio.wav");
        File wavFile = new File(Environment.getExternalStorageDirectory()+"/mrro/mixMusic/", sourceF);
        IConvertCallback callback = new IConvertCallback() {
            @Override
            public void onSuccess(File convertedFile) {
                //Toast.makeText(mContext, "SUCCESS: " + convertedFile.getPath(), Toast.LENGTH_LONG).show();
            }
            @Override
            public void onFailure(Exception error) {
                //Toast.makeText(mContext, "ERROR: " + error.getMessage(), Toast.LENGTH_LONG).show();
            }
        };
        //Toast.makeText(mContext, "Converting audio file..."+Environment.getExternalStorageDirectory()+"/mrro/mixMusic/", Toast.LENGTH_SHORT).show();

        switch(typeG){
            case "WAV":
                AndroidAudioConverter.with(mContext)
                        .setFile(wavFile)
                        .setFormat(cafe.adriel.androidaudioconverter.model.AudioFormat.WAV)
                        .setCallback(callback)
                        .convert();
                break;
            case "MP3":
                AndroidAudioConverter.with(mContext)
                        .setFile(wavFile)
                        .setFormat(cafe.adriel.androidaudioconverter.model.AudioFormat.MP3)
                        .setCallback(callback)
                        .convert();
                break;
            case "WMA":
                AndroidAudioConverter.with(mContext)
                        .setFile(wavFile)
                        .setFormat(cafe.adriel.androidaudioconverter.model.AudioFormat.WMA)
                        .setCallback(callback);
                break;
            case "AAC":
                AndroidAudioConverter.with(mContext)
                        .setFile(wavFile)
                        .setFormat(cafe.adriel.androidaudioconverter.model.AudioFormat.AAC)
                        .setCallback(callback);
                break;
        }

    }



    //PCM 포맷 파일을 WAV 포맷 파일로 변경한다.
    public static void rawTowave(final File rawFile, final File waveFile) throws IOException {
        //GlobalApplication.gChannels = 1;
        /*
        Channels = GlobalApplication.gChannels;
        SAMPLE_RATE = GlobalApplication.getSampleRate;
        bitsPerSample = GlobalApplication.getBitsPerSample;
        gAudioFormat = GlobalApplication.getAudioFormat;
        */


        int rawFileLength = (int) rawFile.length();

        byte[] rawData = new byte[rawFileLength];

        DataInputStream input = null;
        try{
            input = new DataInputStream(new FileInputStream(rawFile));
            input.read(rawData);

        }finally{
            if(input != null){
                input.close();
            }
        }

        Log.d("Record", "Create Raw go. SampleRate="+GlobalApplication.getSampleRate+"///getBitsPerSample="+GlobalApplication.getBitsPerSample+"////gChannels="+GlobalApplication.gChannels+"///gAudioFormat="+GlobalApplication.getAudioFormat);

        DataOutputStream output = null;
        try{

            output = new DataOutputStream(new FileOutputStream(waveFile));

            //Channels = 1;
            //bitsPerSample = 8;


            //WAV 포맷에 맞추어 헤더를 구성한다.
            writeString(output, "RIFF");   //정크 아이디 0-3
            writeInt(output, 36 + rawFileLength); //정크의 크기  4-7
            writeString(output, "WAVE");   //WAVE 포맷    8 - 11
            writeString(output, "fmt ");   //서브 정크의 아이디 12-15
            writeInt(output, 16); //서브 정크의 크기  16-19
            writeShort(output, (short)GlobalApplication.getAudioFormat); //오디오 포맷이 (1=PCM) 이다.    20-21
            writeShort(output, (short)GlobalApplication.gChannels); //모노(1채널) 스트레오(2채널) 쿼드(4채널).      22-23
            writeInt(output, (int)GlobalApplication.getSampleRate); //샘플-레이트    24-27

            //아래 'byte rate = (Aample Rate * BitsPerSample * Channels) / 8 이다.

            int byteR = (int)(GlobalApplication.getSampleRate * GlobalApplication.getBitsPerSample * GlobalApplication.gChannels) / 8; //바이트 레이트   28-31
            Log.d("Record", "rawTowav=====byteR="+byteR+"////sampleR="+GlobalApplication.getSampleRate+"///pitsPer="+GlobalApplication.getBitsPerSample+"///channels="+GlobalApplication.gChannels);
            writeInt(output, byteR);


            writeShort(output, (short)(GlobalApplication.getBitsPerSample * GlobalApplication.gChannels / 8));    //블록의 크기를 바이트로 설정   32-33
            writeShort(output, (short) GlobalApplication.getBitsPerSample);   //샘플의 비트수   34-35
            writeString(output, "data");   //서브정크의 아이디   36-39
            writeInt(output, rawFileLength); //서브정크의 크기    40-43

            //각각의 오디오 데이터를 big endian -> 리틀 엔디언으로 바꾸어 저장한다.
            short[] shorts = new short[rawFileLength / 2];


            ByteBuffer bb = ByteBuffer.wrap(rawData);
            //저장된 데이터는 빅엔디언 데이터이지만 읽는 순서를 바꾸어 리틀엔디언으로 만든다.
            ShortBuffer sb = bb.order(ByteOrder.LITTLE_ENDIAN).asShortBuffer();
            Log.d("Record","****rawTowave=정크1="+(rawFileLength+36)+"//채널="+GlobalApplication.gChannels+"///샘플레이트="+GlobalApplication.getSampleRate+"///바이트레이트="+(int)((GlobalApplication.getSampleRate * GlobalApplication.getBitsPerSample * GlobalApplication.gChannels) / 8)+"///블록크기="+(GlobalApplication.getBitsPerSample * GlobalApplication.gChannels / 8));


            sb.get(shorts);
            ByteBuffer bytes = ByteBuffer.allocate(rawFileLength);
            for(short s: shorts){
                bytes.putShort(s);
            }

            output.write(bytes.array());

        }finally {

            if (output != null) {
                output.close();
            }
        }
    }



    public static void writeInt(final DataOutputStream output, int value) throws IOException{
        Log.d("Util", "int 값을 저장한다."+value);

        output.write(value >> 0);
        output.write(value >> 8);
        output.write(value >> 16);
        output.write(value >> 24);
    }

    public static void writeShort(final DataOutputStream output, final short value) throws IOException{
        output.write(value >> 0);
        output.write(value >> 8);
    }

    public static void writeString(final DataOutputStream output, final String value) throws IOException{
        Log.d("Util", "Write String value="+value+"///len="+value.length());
        for(int i = 0; i < value.length(); i++){
            output.write(value.charAt(i));
        }
    }


    public static File getFile(final String suffix){
        //외장형 저장소 내 'test.xxx' 이름으로 저장한다.
        Log.d("Record", "test 파일을 저장한다.");
        return new File(Environment.getExternalStorageDirectory()+"/mrro/mixMusic/", "imsi"+"."+suffix);
    }




}
