package com.twin7.mrro.GlobalApplication;


import android.app.Activity;
import android.app.Application;

import android.content.pm.PackageManager;

import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;


import com.kakao.auth.KakaoSDK;
import com.plugin.gcm.PushPlugin;
import com.twin7.mrro.Kakao.KakaoSDKAdapter;


import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.MalformedURLException;
import java.net.URL;


public class GlobalApplication extends Application {

    private static GlobalApplication instance;
    //노티피케이션 음악플레이 관련====================
    private static GlobalApplication mInstance;
    public static String playInf = "DIRECT";
    public static String barText = "";
    public static String musicLink = "";

    public static int gChannels = 2;
    public static int getBitsPerSample = 16;
    public static long getSampleRate = 44100;
    public static int getAudioFormat = 1;
    public static boolean goBgSong = false;
    public static boolean goMsPlay = false;
    public static int shinkGab = 12;


    public static boolean mIsRecording = false;  //녹음 시작과 종료를 알려 주는 불리언 변수
    //=========================================


    public static GlobalApplication getGlobalApplicationContext() {

        if (instance == null) {

            throw new IllegalStateException("This Application does not inherit com.kakao.GlobalApplication");

        }

        return instance;
    }



    @Override
    public void onCreate() {

        super.onCreate();

        instance = this;
        // Kakao Sdk 초기화
        KakaoSDK.init(new KakaoSDKAdapter());

        //노티피케이션 음악플레이 관련=========
        mInstance = this;
        //==============================

    }

    //노티피케이션 음악플레이 관련==================
    public static GlobalApplication getInstance() {
        return mInstance;
    }

    public class CommandActions {
        public final static String REWIND = "REWIND";
        public final static String TOGGLE_PLAY = "TOGGLE_PLAY";
        public final static String FORWARD = "FORWARD";
        public final static String CLOSE = "CLOSE";
    }
    //=======================================


    @Override
    public void onTerminate() {

        super.onTerminate();

        instance = null;

    }

    public class BroadcastActions {
        public final static String PREPARED = "PREPARED";
    }

    //네이티브에서 콜도바로 값전송
    public static void sendCordova(String sdGab){
        JSONObject json;

        try
        {
            json = new JSONObject().put("event", "musicBar");
            json.put("rtGab", sdGab);
            // Send this JSON data to the JavaScript application above EVENT should be set to the msg type
            // In this case this is the registration ID
            PushPlugin.sendJavascript( json );

        }
        catch( JSONException e)
        {
            // No message to the user is sent, JSON failed

        }

    }


    //서버에서 파일을 읽어서(url) -> 로컬에 저장한다.(outFileName)
    public static void readIntoFile(String url, String outFileName){
        try {
            URL source = new URL(url);
            BufferedInputStream in = new BufferedInputStream(source.openStream());
            FileOutputStream fos = new FileOutputStream(outFileName);
            BufferedOutputStream bout = new BufferedOutputStream(fos, 1024);

            byte[] data = new byte[1024];
            int x = 0;
            while ((x = in.read(data, 0, 1024)) >= 0) {
                bout.write(data, 0, x);
            }
            fos.flush();
            bout.flush();
            fos.close();
            bout.close();
            in.close();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void requestPermission(Activity activity, String permission) {
        if (ContextCompat.checkSelfPermission(activity, permission)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(activity, new String[]{permission}, 0);
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

    //에코 처리
//------------------------------------------------------------------------------------------
    public static void setEchoWav(String bfile){


        Thread thread = new Thread(new Runnable(){

            public void run(){

                String subFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/" + bfile;
                try {
                    byte[] bytesTemp = GlobalApplication.sampleToByteArray(subFile, false);


                    Log.d("effffff","setEchoWav Length********"+bytesTemp.length);

                    byte [] temp = bytesTemp.clone();

                    RandomAccessFile randomAccessFile = new RandomAccessFile(subFile, "rw");
                    randomAccessFile.seek(44);
                    //Echo
                    int N = (int)(GlobalApplication.getSampleRate  / 8);
                    for(int n = N + 1; n < bytesTemp.length; n++){
                        bytesTemp[n] = (byte)(temp[n] * temp[n - N]);
                    }
                    randomAccessFile.write(bytesTemp);
                    Log.d("effffff","setEchoWav********");


                } catch (IOException e) {
                    e.printStackTrace();
                    Log.d("effffff","setEchoWav Error33********");
                }


            }
        });

        thread.run();
    }



//------------------------------------------------------------------------------------------

}

