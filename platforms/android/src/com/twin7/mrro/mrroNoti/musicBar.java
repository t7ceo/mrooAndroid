package com.twin7.mrro.mrroNoti;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import com.twin7.mrro.GlobalApplication.GlobalApplication;

import java.io.IOException;

public class musicBar extends Service {

    Context mContext;

    private MediaPlayer mMediaPlayer;
    private boolean isPrepared;


    private NotificationPlayer mNotificationPlayer;


    @Override
    public void onCreate() {
        super.onCreate();
        isPrepared = true;
        mContext = this;
        mMediaPlayer = new MediaPlayer();
        mMediaPlayer.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
        mNotificationPlayer = new NotificationPlayer((musicBar) mContext);
    }


    @Override
    public IBinder onBind(Intent intent) {

        return null;
    }



    @Override
    public int onStartCommand(Intent intent, int flags, int startId)
    {
        Log.d("appActivity","musicBar onStartCommand===isPrepared="+isPrepared+"///tit=///isPlaying===="+isPlaying()+"//action="+intent.getAction()+"///url=="+GlobalApplication.musicLink);

        if (intent != null) {
            String action = intent.getAction();
            if (GlobalApplication.CommandActions.TOGGLE_PLAY.equals(action)) {
                if (isPlaying()) {
                    pause();
                } else {
                    play();
                }
            } else if (GlobalApplication.CommandActions.REWIND.equals(action)) {
                rewind();
            } else if (GlobalApplication.CommandActions.FORWARD.equals(action)) {
                forward();
            } else if (GlobalApplication.CommandActions.CLOSE.equals(action)) {
                isPrepared = true;  //초기화
                stop();
            }
        }
        return super.onStartCommand(intent, flags, startId);

    }


    public boolean isPlaying() {
        return mMediaPlayer.isPlaying();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        mMediaPlayer.pause();
    }


    private void updateNotificationPlayer() {
        if (mNotificationPlayer != null) {
            mNotificationPlayer.updateNotificationPlayer();
        }
    }

    public void play(int position) {
        /*
        queryAudioItem(position);
        stop();
        prepare();
        */
    }

    public void play() {

        if(isPrepared){
            isPrepared = false;  //현재 플레이 되는 상태
            try {
                Log.d("appActivity","play()====url="+GlobalApplication.musicLink+"///playInf==="+GlobalApplication.playInf);

                if(GlobalApplication.playInf.equals("DIRECT")){
                    //처음 부터 다시 플레이 한다.
                    mMediaPlayer.setDataSource(GlobalApplication.musicLink);
                    mMediaPlayer.prepare();
                }

                mMediaPlayer.start();

                GlobalApplication.sendCordova("play");
                updateNotificationPlayer();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

    }

    public void pause() {
        //if (isPrepared) {
            mMediaPlayer.pause();
            isPrepared = true;
            updateNotificationPlayer();
            GlobalApplication.playInf = "pause";

            GlobalApplication.sendCordova("pause");
       // }
    }

    public void stop() {
        Log.d("appActivity", "====stop==="+isPrepared);

        if (isPrepared) {
            //isPrepared = false;
            mMediaPlayer.pause();
            //노티를 제거한다.
            mNotificationPlayer.removeNotificationPlayer();

            stopService(new Intent(mContext, musicBar.class));
            GlobalApplication.sendCordova("stop");
        }




    }

    public void forward() {
        /*
        if (mAudioIds.size() - 1 > mCurrentPosition) {
            mCurrentPosition++; // 다음 포지션으로 이동.
        } else {
            mCurrentPosition = 0; // 처음 포지션으로 이동.
        }
        play(mCurrentPosition);
        */
    }

    public void rewind() {
        /*
        if (mCurrentPosition > 0) {
            mCurrentPosition--; // 이전 포지션으로 이동.
        } else {
            mCurrentPosition = mAudioIds.size() - 1; // 마지막 포지션으로 이동.
        }
        play(mCurrentPosition);
        */
    }



}
