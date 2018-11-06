package com.twin7.mrro;


import android.content.Context;

import android.content.pm.PackageInfo;

import android.content.pm.PackageManager;

import android.content.pm.Signature;

import android.support.annotation.Nullable;

import android.support.v7.app.AppCompatActivity;

import android.os.Bundle;

import android.util.Base64;

import android.util.Log;

import android.view.View;

import android.widget.Button;


import com.kakao.auth.AuthType;
import com.kakao.auth.Session;


import java.security.MessageDigest;

import com.twin7.mrro.Kakao.SessionCallback;


public class kakaoAndroidLogin extends AppCompatActivity {

    private Context mContext;


    private Button btn_custom_login;

    Session session;

    @Override

    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_login);

        mContext = getApplicationContext();


        session = Session.getCurrentSession();

        session.addCallback(new SessionCallback());

        session.open(AuthType.KAKAO_LOGIN_ALL, kakaoAndroidLogin.this);

        /*

        btn_custom_login = (Button) findViewById(R.id.btn_custom_login);

        btn_custom_login.setOnClickListener(new View.OnClickListener() {

            @Override

            public void onClick(View view) {

                session = Session.getCurrentSession();

                session.addCallback(new SessionCallback());

                session.open(AuthType.KAKAO_LOGIN_ALL, kakaoAndroidLogin.this);

            }

        });
        */



    }

}