package com.twin7.mrro;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;

import com.twin7.mrro.ExAudio.RecordingActivity;
import com.twin7.mrro.GlobalApplication.GlobalApplication;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;



//노티피케이션=========================
//노티피케이션 종료====================================
//와이파이 설정을 한다.

@SuppressWarnings("deprecation")
public class webViewpage extends CordovaPlugin
{

	private static final String TAG = "webPageTAG";
	private static final String LOCATION_SERVICE = null;
	Integer isConnected = 0;

	
	@TargetApi(Build.VERSION_CODES.O)
	@RequiresApi(api = Build.VERSION_CODES.O)
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
	    PluginResult.Status status = PluginResult.Status.OK;
	    String result = "";
		Context context;
		Intent intent;

	    switch(action){
			case "recordVoice":

				context=cordova.getActivity().getApplicationContext();
				intent=new Intent(context, RecordingActivity.class);
				intent.putExtra("sid", args.getString(0));
				//intent=new Intent(context, MainActivity.class);
				this.cordova.getActivity().startActivity(intent);

				break;
			case "callExAudio":

				context=cordova.getActivity().getApplicationContext();
				intent=new Intent(context, RecordingActivity.class);
				//intent=new Intent(context, MainActivity.class);
				this.cordova.getActivity().startActivity(intent);

				break;
			case "SetWifi":
				String message = "uuuukkk--"+args.getString(0);

				this.setWifi(message, callbackContext);
				return true;

			case "notipicatMy":
				String tit = args.getString(0);
				String gasu = args.getString(1);
				String prefix = args.getString(2);
				String url = args.getString(3);
				String playInf = args.getString(4);  //play:음악재생중, pause:음악일시중지, stop:새로운 음악재생

				url = "http://mroo.co.kr/mrphp/"+url;
				GlobalApplication.musicLink = url;
				GlobalApplication.barText = tit+"\n"+gasu+" "+prefix;


				context=cordova.getActivity().getApplicationContext();
				intent =new Intent();
				if(playInf.equals("play")){
					//현재 재생중인 것을 정지시킨다.
					GlobalApplication.playInf = "TOGGLE_PLAY";
					intent.setAction("com.twin7.mrro.musicBar.resume");  //일시정지된것을 플레이 한다.
				}else if(playInf.equals("pause")){
					//일시 정지된것을 다시 플레이 한다.
					GlobalApplication.playInf = "TOGGLE_PLAY";
					intent.setAction("com.twin7.mrro.musicBar.resume");  //일시정지된것을 플레이 한다.
				}else{
					//현재 완전 정지 상태인것을 플레이 한다.
					GlobalApplication.playInf = "DIRECT";
					intent.setAction("com.twin7.mrro.musicBar.goplay");  //현재 재생중인것을 강제 중지시키고 플레이 한다.
				}
				Log.d("appActivity","webViewpage notipicatMy==="+tit+"//"+gasu+"////"+url+"//GlobalApplication.playInf="+GlobalApplication.playInf);

				context.sendBroadcast(intent);


				break;
			case "faceLogin":

				context=cordova.getActivity().getApplicationContext();
				intent=new Intent(context, faceLogin.class);
				//intent.putExtra("wurl", args.getString(0));
				//intent.putExtra("gasaurl", args.getString(1));
				//intent.putExtra("gasagab", args.getString(2));
				this.cordova.getActivity().startActivity(intent);

				break;
			case "kakaoAndroidLogin":
				context=cordova.getActivity().getApplicationContext();
				intent=new Intent(context, kakaoAndroidLogin.class);
				this.cordova.getActivity().startActivity(intent);

				break;
			case "webDisp":
				context=cordova.getActivity().getApplicationContext();
				intent=new Intent(context, kakaoLogin.class);
				intent.putExtra("wurl", args.getString(0));
				this.cordova.getActivity().startActivity(intent);

				break;
			case "ntwork":
				ntwork();

				break;
			case "recApp":
				setApp();

				break;
			case "voiceRec":
				context=cordova.getActivity().getApplicationContext();
				//Intent intent=new Intent(context,voiceRecAudio.class);
				intent=new Intent(context,voiceRec.class);
				intent.putExtra("murl", args.getString(0));
				intent.putExtra("gasaurl", args.getString(1));
				intent.putExtra("gasagab", args.getString(2));
				this.cordova.getActivity().startActivity(intent);

				break;
		}
		
		return true; //new PluginResult(PluginResult.Status.OK, "OkEnd");

	}




	public void voiceRec(){
	       Intent intent = new Intent().setAction("android.settings.SETTINGS");
	        this.cordova.getActivity().startActivity(intent);   
	}


	public void kakaoLogin(String mess, Context context, CallbackContext callbackContext) {

		Intent i = new Intent(context, webViewpage.class);
		context.startActivity(i);


		//결과리턴
		/*
		if (mess != null && mess.length() > 0) {
			callbackContext.success(mess);
		} else {
			callbackContext.error("Expected one non-empty string argument.");
		}
		*/
	}


	public void setWifi(String mess, CallbackContext callbackContext) {

		Intent intent = new Intent().setAction("android.settings.SETTINGS");
		this.cordova.getActivity().startActivity(intent);

		//결과리턴
		if (mess != null && mess.length() > 0) {
			callbackContext.success(mess);
		} else {
			callbackContext.error("Expected one non-empty string argument.");
		}
		
    }
	
	public void setApp() {

		String sinf = MrroActivity.samsunginf;
		if(sinf.equalsIgnoreCase("ok")){
			//삼성앱스가 설치된 경
			//Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://www.samsungapps.com/appquery/appDetail.as?appId=com.sec.android.app.voicenote"));
			Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("samsungapps://ProductDetail/com.sec.android.app.voicenote"));
			//Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("samsungapps://ProductDetail/com.shinshow.quickrec"));
			this.cordova.getActivity().startActivity(intent);
		}else{
			//삼성앱스가 설치 않된 경
			Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.shinshow.quickrec"));
			this.cordova.getActivity().startActivity(intent);
		}
		
    }


	public void ntwork2() {


		
		Log.d(TAG,"function call : startPhotoEditActivity() ");
		
	}

	

	public void ntwork() {

		Context context = null;
		isNetworkConnected(context);
		

		
		
		Log.d(TAG,"function call : startPhotoEditActivity() ");
		
	}

	public void isNetworkConnected(Context context){
	    ConnectivityManager manager = 
	        (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
	    NetworkInfo mobile = manager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
	    NetworkInfo wifi = manager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);

	    if (mobile.isConnected() || wifi.isConnected()){
	        isConnected = 1;
	    }else{
	        isConnected = 0;
	    }
	}



}



