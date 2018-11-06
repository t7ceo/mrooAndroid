package com.twin7.mrro.ExAudio;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.twin7.mrro.R;

import java.io.File;

import cafe.adriel.androidaudioconverter.AndroidAudioConverter;
import cafe.adriel.androidaudioconverter.callback.IConvertCallback;
import cafe.adriel.androidaudioconverter.callback.ILoadCallback;
import cafe.adriel.androidaudioconverter.model.AudioFormat;

public class MainActivity extends Activity implements View.OnClickListener{

    final String TAG = "SimpleAudioTrackAct";
    Button startSound;
    Button endSound;
    AudioSynthesisTask2 audioSynth;
    Context mContext;

    @SuppressLint("ClickableViewAccessibility")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exaudio);

        mContext = this;

        //사운드의 시작 버튼을 구현한다.
        startSound = (Button)this.findViewById(R.id.StartSound);
        startSound.setOnClickListener(this);

        endSound = (Button)this.findViewById(R.id.EndSound);
        endSound.setOnClickListener(this);

        endSound.setEnabled(false);

    }

    public void onPause(){
        super.onPause();

        //화면이 다른 프로그램에 의해 그려진다면 소리 재생 작업을 종료시킨다.
        //audioSynth.audiostop();

        endSound.setEnabled(false);
        startSound.setEnabled(true);

    }

    @Override
    public void onClick(View v) {

        Log.d("Simp", "click onnnnnnn");

        if(v == startSound){
            //convertAudio("drVoice.wav", "MP3");   //audio convert

            Log.d(TAG, "gogogogogo");
            audioSynth = new AudioSynthesisTask2(mContext);

            audioSynth.start();
            endSound.setEnabled(true);
            startSound.setEnabled(false);
        }else if(v == endSound){

            //audioSynth.audiostop();
            endSound.setEnabled(false);
            startSound.setEnabled(true);

        }
    }

/*

    public void convertAudio(String sourceF, String typeG){
        /**
         *  Update with a valid audio file!
         *  Supported formats: {@link AndroidAudioConverter.AudioFormat}
         */
/*
        //File wavFile = new File(Environment.getExternalStorageDirectory(), "recorded_audio.wav");
        File wavFile = new File(Environment.getExternalStorageDirectory()+"/mrro/voice/", sourceF);
        IConvertCallback callback = new IConvertCallback() {
            @Override
            public void onSuccess(File convertedFile) {
                Toast.makeText(MainActivity.this, "SUCCESS: " + convertedFile.getPath(), Toast.LENGTH_LONG).show();
            }
            @Override
            public void onFailure(Exception error) {
                Toast.makeText(MainActivity.this, "ERROR: " + error.getMessage(), Toast.LENGTH_LONG).show();
            }
        };
        Toast.makeText(this, "Converting audio file..."+Environment.getExternalStorageDirectory()+"/mrro/voice/", Toast.LENGTH_SHORT).show();

        switch(typeG){
            case "WAV":
                AndroidAudioConverter.with(this)
                        .setFile(wavFile)
                        .setFormat(AudioFormat.WAV)
                        .setCallback(callback)
                        .convert();
                break;
            case "MP3":
                AndroidAudioConverter.with(this)
                        .setFile(wavFile)
                        .setFormat(AudioFormat.MP3)
                        .setCallback(callback)
                        .convert();
                break;
            case "WMA":
                AndroidAudioConverter.with(this)
                        .setFile(wavFile)
                        .setFormat(AudioFormat.WMA)
                        .setCallback(callback);
                break;
            case "AAC":
                AndroidAudioConverter.with(this)
                        .setFile(wavFile)
                        .setFormat(AudioFormat.AAC)
                        .setCallback(callback);
                break;
        }

    }
*/

}
