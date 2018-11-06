package com.twin7.mrro;



import com.twin7.mrro.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;



@SuppressLint("SetJavaScriptEnabled") public class pushActivity extends Activity {

    //private static final int NOTIFY_ME_ID=1337;
    //private NotificationManager mgr;
	
	
	PopupWindow popupw;
	View popupview;
	LinearLayout linear;
	
	TextView pmess1;
	TextView frommess;
	
	Button cButton;
	Button vButton;
	
	String rnum;
	String plink;
	
	Bitmap adImg;
	
	
	
	WebView pshimgV;
	WebSettings set = null;

	
	
	String Jsong;
	
	String nowApp;
	
	String title;
	String gourl = "";
	
	int wp = 0;
	int ws = 0;
	int h1 = 0;
	int h2 = 0;
	int h3 = 0;
	int h22 = 0;
	
	
	Context context = null;
	
    //프로그래스바---------------
    public ProgressBar mProgress2; // = (ProgressBar)findViewById(R.id.progressBar1);
    public int mProgressStatus = 0;
    //-------------------------

	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
	
		float screenWidth = getBaseContext().getResources().getDisplayMetrics().widthPixels;
		float screenH = getBaseContext().getResources().getDisplayMetrics().heightPixels;
		wp = (int)(screenWidth * 0.1);
		ws = (int)(screenWidth * 0.8);
		h1 = (int)(screenH * 0);
		h2 = (int)((ws * 0.9));
		h3 = (int)(screenH - (h1 + h2));
		h22 = (int)((ws * 0.75));
		

		
		//타이틀바 표시 하지 않는다.
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.popup);
		
    	System.out.println("::::*******pushActivity Start******** : ::::");
		
    	
    	context = this;
    	
		//넘어온 펜딩 인텐트를 가져 온다.
		Bundle bundle = getIntent().getExtras();
		rnum = bundle.getString("recnum");
		//plink = bundle.getString("plink");	
    	
    	
    	
        //프로그래스바-------------------
		mProgress2 = (ProgressBar)findViewById(R.id.progressBar3);
		mProgress2.setMax(100);
        //----------------------------

		
		//이미지 뷰의 인스턴스 생성
		pshimgV = (WebView)findViewById(R.id.vpushimg);
        set= pshimgV.getSettings();
        set.setJavaScriptEnabled(true);
    	set.setSupportMultipleWindows(true);        
    	set.setAllowFileAccess(false);
    	set.setJavaScriptCanOpenWindowsAutomatically(true);
    	set.setDomStorageEnabled(false);
    	set.setBlockNetworkLoads(false);
    	set.setAppCacheEnabled(true);
		//System.out.println("::::SharedPreferences exit():::goinf="+goinf);
		pshimgV.setWebViewClient(new MyWebClient());
		pshimgV.setWebChromeClient(new MyWebChromeClient());
		

		
		ViewGroup.LayoutParams vc = pshimgV.getLayoutParams();
        vc.height= h22;
        pshimgV.setLayoutParams(vc);
		//webview.setVisibility(View.VISIBLE);

        
		//푸시 내용을 가져와서 웹뷰에 보여 준다.
	    String uuu = "http://mroo.co.kr/sohoring/push/pushView.php?recnum="+rnum;
		pshimgV.loadUrl(uuu);
        		
		
		
    		//쓰레드 실행-푸시창 보임
    		new getPimg().execute();
		
        
	}

	
	
	
	//처음 푸시가 왔을 때 백으로 실행
	private class getPimg extends AsyncTask<Void,Void,Void>{

		@Override
		protected Void doInBackground(Void... params) {
			// TODO Auto-generated method stub
			
			gofun();
			
			
			return null;
		}
		
	}

	
	

	
	//새로운 푸쉬 발생시 실행
	private void gofun(){  //푸쉬 내용을 출력한다.===================================


        
		//레코드 번호를 저장 한다.
		SharedPreferences.Editor edit = getSharedPreferences("mrroActivity",0).edit();
		edit.putString("recnum", "0");
		edit.commit();		
		
        
		
		
		cButton = (Button)findViewById(R.id.closebtn);
		vButton = (Button)findViewById(R.id.viewbtn);
    	System.out.println("::::*******pushActivity Start******** : button="+cButton+"/"+vButton+"/rnum="+rnum);

    	
    	
    	//닫기 버튼을 클릭했다.=============================
    	//그냐애블 종료한다. 
		cButton.setOnClickListener(new View.OnClickListener() {  
			public void onClick(View v) {
				// TODO Auto-generated method stub
				
				finish();
			}

		}); //=======================================

		//보기 버튼을 클릭했다.==============================
		vButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				// TODO Auto-generated method stub

					
				//레코드 번호를 저장 한다.
				SharedPreferences.Editor edit = getSharedPreferences("mrroActivity",0).edit();
				edit.putString("recnum", rnum);
				edit.commit();
				
				
				//forceMainActivityReload()
				PackageManager pm = getPackageManager();
				Intent launchIntent = pm.getLaunchIntentForPackage(getApplicationContext().getPackageName());    		
				startActivity(launchIntent);				
				
				
				finish();
				
			}

		}); //======================================
		
	} //=============================================
	


	

	class MyWebClient extends WebViewClient {
		public boolean shouldOverrideUrlLoading(WebView view, String url){

		
		return true;
		}
	}

	class MyWebChromeClient extends WebChromeClient {
		//프로그래스바-------------------------------------
		@Override
		public void onProgressChanged(WebView view, int newProgress) {		
			if(newProgress == 100){
				mProgress2.setVisibility(View.INVISIBLE);
			}else{
				mProgress2.setVisibility(View.VISIBLE);
				mProgress2.setProgress(newProgress);
			}
		}
		//-----------------------------------------------
	}

    
    
	protected void onResume() {
		super.onResume();
	 
		System.out.println("::::pushActivity resume():::");
	}
	
    public boolean onKeyDown(int keyCode, KeyEvent event) {
    	if ((keyCode == KeyEvent.KEYCODE_BACK)) {
        	finish();
    		
        	//Toast.makeText(this, "keyCode", Toast.LENGTH_LONG).show();	
            return true;
        }else{
        	

        }
        return super.onKeyDown(keyCode, event);
    }
	
}
