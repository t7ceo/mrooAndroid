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

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;
import java.util.Arrays;


public class GetMusic extends Thread {

    final String TAG = "GetMusic";
    final Context mContext;
    String musicName;

    public GetMusic(Context c, String mm){

        mContext = c;
        musicName = mm;
    }


    public void run(){
        String targetfile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/mrro/mixMusic/song.mp3";
        GlobalApplication.readIntoFile(musicName, targetfile);

        Util.convertAudio("song.mp3", "WAV");
    }



}
