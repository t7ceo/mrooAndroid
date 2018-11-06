package com.twin7.mrro;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.apache.cordova.CordovaActivity;

public class kakaoLogin extends CordovaActivity {

    WebView mWebView;

    public class WebCustomClient extends WebViewClient{

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url){





            return false;
        }

        @Override
        public void onPageFinished(WebView view, String url){
            //페이지 로딩이 완료 되었다.



            super.onPageFinished(view, url);
        }


    }

    public class WebChromeClient extends WebViewClient{

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url){





            return false;
        }

        @Override
        public void onPageFinished(WebView view, String url){
            //페이지 로딩이 완료 되었다.

            //view.loadUrl("http://naver.com");

            //view.reload();

            super.onPageFinished(view, url);
        }

    }


    @Override
    public void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.webview_main);

        Intent intent = getIntent();
        String url = intent.getExtras().getString("wurl");


        mWebView = (WebView) findViewById(R.id.webviewMain);
        mWebView.setWebViewClient(new WebChromeClient());
        //mWebView.setWebViewClient(new WebCustomClient());

        WebSettings set = mWebView.getSettings();

        set.setJavaScriptEnabled(true);
        set.setDomStorageEnabled(true);
        set.setBuiltInZoomControls(true);
        set.setJavaScriptCanOpenWindowsAutomatically(true);
        set.setMixedContentMode(set.MIXED_CONTENT_ALWAYS_ALLOW);
        set.setSupportZoom(true);
        set.setAppCacheEnabled(true);
        set.setSupportMultipleWindows(true);
        set.setDatabaseEnabled(true);
        set.setBlockNetworkImage(true);
        set.setLoadsImagesAutomatically(true);

        //if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN){
            set.setAllowUniversalAccessFromFileURLs(true);
            set.setAllowFileAccessFromFileURLs(true);
        //}



        mWebView.loadUrl(url);

    }

}
