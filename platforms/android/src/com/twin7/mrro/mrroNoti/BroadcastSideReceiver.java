package com.twin7.mrro.mrroNoti;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BroadcastSideReceiver extends BroadcastReceiver{

    Context mContext;
    private String iAction;

    @SuppressLint("NewApi")
    public void onReceive(Context context, Intent intent){

        mContext = context;
        iAction = intent.getAction();
        Intent intent2;


        Log.d("appActivity", "BroadcasetReceiver Action=="+iAction);

        switch(iAction){
            case "com.twin7.mrro.musicBar.goplay":
                //기존 플레이를 삭제하고 바로 플레이 한다.
                intent2 = new Intent(mContext, musicBar.class);
                mContext.stopService(intent2);

                //바로 플레이한다.
                intent2 = new Intent(context, musicBar.class);
                intent2.setAction("TOGGLE_PLAY");
                mContext.startService(intent2);

                break;
            case "com.twin7.mrro.musicBar.resume":
                //정지된것을 다시 플레이 한다.

                intent2 = new Intent(context, musicBar.class);
                intent2.setAction("TOGGLE_PLAY");
                mContext.startService(intent2);

                break;
            case "com.twin7.mrro.musicBar.pause":

                intent2 = new Intent(context, musicBar.class);
                intent2.setAction("PAUSE");
                mContext.startService(intent2);

                break;
            case "com.twin7.mrro.musicBar.hide":

                break;
        }


    }


}
