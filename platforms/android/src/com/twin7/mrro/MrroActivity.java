package com.twin7.mrro;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.Signature;
import android.content.res.Configuration;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.telephony.TelephonyManager;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import org.apache.cordova.CordovaActivity;

import java.io.InputStream;
import java.security.MessageDigest;
import java.util.Locale;

import cafe.adriel.androidaudioconverter.AndroidAudioConverter;
import cafe.adriel.androidaudioconverter.callback.ILoadCallback;

import static com.twin7.mrro.GlobalApplication.GlobalApplication.requestPermission;



/*kakao관련 시작=======*/
/*kakao관련 끝=======*/


@SuppressLint("JavascriptInterface")
public class MrroActivity extends CordovaActivity {



	public Context mContext = null;
	//public String uidgab = "0";
	public String phoneNum = null;
	//String regId = "";
	//public static  String PROJECT_ID = "796396514954";
	//AIzaSyAkBJ_uqGT2Hm1GAl-uBuYDaZOb-U2t_fQ

	//나라 코드를 구해서 저장 한다.
	//String addressString = null;
	//메인 페이지 호출 url 
	String launchUrl3 = null;


	public static String samsunginf = "no";

	public static ApplicationInfo appPkNam;


	InputStream in = null;

	public String newPg = "";

	public boolean mPreviewRunning;
	public Object mPreview;


	Location location = null;
	double latitude = 0; // 위도
	double longitude = 0; // 경도


	WebView webview = null;


	@SuppressWarnings("deprecation")
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		AndroidAudioConverter.load(this, new ILoadCallback() {
			@Override
			public void onSuccess() {
				// Great!
				Log.d("mainActivity", "::::FFmpeg Load Ok:::");
			}
			@Override
			public void onFailure(Exception error) {
				// FFmpeg is not supported by device
				error.printStackTrace();
			}
		});


		//getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);


		//statusbarVisibility(true);
		//mContext = this;
		mContext = getApplicationContext();

		requestPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE);
		requestPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
		requestPermission(this, Manifest.permission.READ_PHONE_STATE);
		requestPermission(this, Manifest.permission.ACCESS_NETWORK_STATE);
		requestPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION);
		requestPermission(this, Manifest.permission.ACCESS_FINE_LOCATION);
		requestPermission(this, Manifest.permission.RECORD_AUDIO);
		requestPermission(this, Manifest.permission.RECEIVE_SMS);
		requestPermission(this, Manifest.permission.GET_ACCOUNTS);
		requestPermission(this, Manifest.permission.WAKE_LOCK);



		Log.d("mainActivity", "::::SharedPreferences push gogo:::");


		getHashKey(mContext);  //kakao 관련


		appPkNam = getApplicationInfo();


		String pakname = appPkNam.packageName;
		System.out.println("::::pakname====:::" + pakname);


		String pkg = "com.sec.android.app.samsungapps";
		//팩키지의 설치 여부를 확인 한다.
		PackageManager pm = getPackageManager();
		try {

			pm.getApplicationInfo(pkg, PackageManager.GET_META_DATA);
			//패키지가 있을경우 실행할 내용
			samsunginf = "ok";

		} catch (NameNotFoundException e) {
			//패키지가 없을경우 실행할 내용
			samsunginf = "no";
		}

		Log.d("mainActivity", "::::SharedPreferences push gogo2:::"+pakname);

		//전화번호 가져 오기=======================================
		phoneNum = "01012341234";
		String cosa = "[SK]";
		/*
		TelephonyManager mgr = (TelephonyManager) this.getSystemService(Context.TELEPHONY_SERVICE);
		if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.READ_PHONE_NUMBERS) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
			// TODO: Consider calling
			//    ActivityCompat#requestPermissions
			// here to request the missing permissions, and then overriding
			//   public void onRequestPermissionsResult(int requestCode, String[] permissions,
			//                                          int[] grantResults)
			// to handle the case where the user grants the permission. See the documentation
			// for ActivityCompat#requestPermissions for more details.
			return;
		}
		phoneNum = mgr.getLine1Number();
		if (phoneNum == null) {
			phoneNum = "01090815738";
		} else {
			phoneNum = phoneNum.replace("+82", "0");
		}
		String networkoper = mgr.getNetworkOperatorName();

		if (networkoper == null) {
			cosa = null;
		} else if (networkoper.equals("SKTelecom")) {
			cosa = "[SK]";
		} else if (networkoper.equals("KT") || networkoper.equals("olleh")) {
			cosa = "[KT]";
		} else if (networkoper.matches(".*LG.*")) {
			cosa = "[LG]";
		}
		System.out.println("*******phonenum=" + phoneNum + "***********");
		*/
		//=====================================================

		phoneNum = "01090815738";
		cosa = "[KT]";

		Log.d("mainActivity", "::::SharedPreferences push gogo3:::"+phoneNum);

		//==레코드 번호를 넣어 앱을 실행하고 레코드번호는 다시 초기화 한다.================================================================================
		//xml 파일에 저장한 환경변수를 가져와서 처리 한다.
		SharedPreferences sdcenter = getSharedPreferences("mrroActivity", 0);
		String recnum = sdcenter.getString("recnum", "0");


		Locale locale = this.getResources().getConfiguration().locale;
		//locale.getLanguage( );
		Log.d("mainActivity", "*******nara======" + locale.getLanguage() + "***********");



		launchUrl3 = "file:///android_asset/www/main2.html?cot=" + locale.getLanguage() + "&phn=" + phoneNum + "&rnum=" + recnum + "&cosa=" + cosa;
		loadUrl(launchUrl3);

		//레코드 번호를 넘기고 다시 초기화 한다.
		SharedPreferences.Editor edit = getSharedPreferences("mrroActivity", 0).edit();
		edit.putString("recnum", "0");
		edit.commit();
		//=================================================================================================================


	}


	class JAHandler {
		@JavascriptInterface
		public void doSomething() {
			webview.loadUrl("http://naver.com");

			Toast.makeText(MrroActivity.this, "DO SOMETHING", Toast.LENGTH_LONG).show();
		}
	}


	public void registerGcm() {

	}


	public void setlogout() {

	}


	public void onDestroy() {
		super.onDestroy();

	}


	@Override
	public void onStop() {
		super.onStop();


		System.out.println("::::onStop():::rec===");
	}


	protected void onPause() {
		super.onPause();

		System.out.println("::::onPause releaseMediaRecorder():::");

	}

	protected void onResume() {
		super.onResume();
	}


	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		try {
			//Toast.makeText(this, "onConfigurationChanged()", Toast.LENGTH_LONG).show();

			super.onConfigurationChanged(newConfig);

		} catch (Exception e) {
			//Toast.makeText(this, "onConfigurationChanged() err", Toast.LENGTH_LONG).show();

		}

	}



	public void getCountryNam() {

		LocationManager lm = (LocationManager) getSystemService(LOCATION_SERVICE);
		if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
			// TODO: Consider calling
			//    ActivityCompat#requestPermissions
			// here to request the missing permissions, and then overriding
			//   public void onRequestPermissionsResult(int requestCode, String[] permissions,
			//                                          int[] grantResults)
			// to handle the case where the user grants the permission. See the documentation
			// for ActivityCompat#requestPermissions for more details.
			return;
		}
		Location location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);

		Double latitude = location.getLatitude()*1E6;
	    Double longitude = location.getLongitude()*1E6;

	    Log.d("Main", "longtitude=" + latitude + ", latitude=" + longitude);

	}

	public void statusbarVisibility(boolean setVisibility){
		if(setVisibility){
			if (Build.VERSION.SDK_INT < 16) {
				getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
			}
			else {
				View decorView = getWindow().getDecorView();
				int uiOptions = View.SYSTEM_UI_FLAG_VISIBLE;
				decorView.setSystemUiVisibility(uiOptions);
			}
		}else{
			if (Build.VERSION.SDK_INT < 16) {
				getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
						WindowManager.LayoutParams.FLAG_FULLSCREEN);
			}
			else {
				View decorView = getWindow().getDecorView();
				int uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN;
				decorView.setSystemUiVisibility(uiOptions);
			}
		}
	}


    //레지스트 실행을 쓰레드로 처리 한다.
    class treadRegist implements Runnable{
    	public void run(){
    		registerGcm();
    	}
    }

    class logoutprocess implements Runnable{
    	public void run(){
    		setlogout();
    	}
    }


    class getCountry implements Runnable{
    	public void run(){
    		getCountryNam();
    	}
    }

	// 프로젝트의 해시키를 반환
	@Nullable
	public static String getHashKey(Context context) {

		final String TAG = "KeyHash";

		String keyHash = null;

		try {

			PackageInfo info =

					context.getPackageManager().getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNATURES);



			for (Signature signature : info.signatures) {

				MessageDigest md;

				md = MessageDigest.getInstance("SHA");

				md.update(signature.toByteArray());

				keyHash = new String(Base64.encode(md.digest(), 0));

				Log.d(TAG, keyHash);

			}

		} catch (Exception e) {

			Log.e("name not found", e.toString());

		}



		if (keyHash != null) {

			return keyHash;

		} else {

			return null;

		}

	}
	
}



