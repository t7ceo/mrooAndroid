package com.twin7.mrro;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.Charset;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.PorterDuff.Mode;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

public class voiceRec extends Activity{

    String RECORDED_FILE = "/sdcard/mrro/voice/record.mp4";
    
    private MediaPlayer mediaPlayer = null;
    MediaRecorder recorder;
    
    public static final int TIMEDISP = 0; 

    public int recGo = 0;
    
    
    Button recStart;
    Button recStop;
    Button play;
    Button stop;
    
    
    String orgPath = "";
    String url = null;
    String urlGasa = null;
    
    TextView mTimeView;
    
    Handler mHandler;
    Handler dispText;
    
    Context context = null;

    
    TextView tv;
    String gasa;
    
    
    int mainTime = 0;
    int pos; // 재생 멈춘 시점
    
    private SeekBar seekBar;
    boolean isPlaying = true;
    private ProgressUpdate progressUpdate;
    private int position = 0;
    

    
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        context = this;
        //타이틀바 표시 하지 않는다.
        //requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.vrec);
        
        seekBar  = (SeekBar) findViewById(R.id.seekBar1);
        seekBar.getProgressDrawable().setColorFilter(Color.YELLOW, Mode.SRC_IN);
        
        orgPath = Environment.getExternalStorageDirectory().getAbsolutePath();
        RECORDED_FILE = orgPath+"/mrro/voice/record.mp4";
        
        Intent intent = getIntent();
        url = intent.getExtras().getString("murl");
        urlGasa = intent.getExtras().getString("gasaurl");
        gasa = intent.getExtras().getString("gasagab");
        
        
        
        
    	tv = (TextView) findViewById(R.id.gasa);
        tv.setMovementMethod(new ScrollingMovementMethod());
        tv.setText(gasa);
        
        //Toast.makeText(getApplicationContext(), "가사===."+gasa, Toast.LENGTH_LONG).show();
        
        
        mTimeView = (TextView)findViewById(R.id.timetxt);
        
        recStart = (Button)findViewById(R.id.recgo);
        recStop = (Button)findViewById(R.id.recstop);
        play = (Button)findViewById(R.id.play);
        stop = (Button)findViewById(R.id.stop);
        
        
        play.setVisibility(View.VISIBLE);
        stop.setVisibility(View.GONE);
        recStart.setVisibility(View.VISIBLE);
        recStop.setVisibility(View.GONE);
        
        
        
        
        sonplay();
        
        
        play.setOnClickListener(new View.OnClickListener() {
            
            @Override
            public void onClick(View v) {
                // TODO Auto-generated method stub
            	sonplay();

            }
        });
        
        stop.setOnClickListener(new View.OnClickListener() {
            
			//@SuppressWarnings("deprecation")
			@Override
            public void onClick(View v) {
                // TODO Auto-generated method stub
            	//new MyThread().stop(); // 씨크바 그려줄 쓰레드 시작
				if(mediaPlayer != null){
					mediaPlayer.stop();
					mediaPlayer.release();
					mediaPlayer = null;
					isPlaying = false;
					seekBar.setProgress(0);
					//progressUpdate.stop();
					
                    if(isPlaying){
                        play.setVisibility(View.GONE);
                        stop.setVisibility(View.VISIBLE);
                    }else{
                        play.setVisibility(View.VISIBLE);
                        stop.setVisibility(View.GONE);
                    }

	            	//Toast.makeText(getApplicationContext(), "네이티브 thread stop===."+url, Toast.LENGTH_LONG).show();

	                //finish();
	                
	                // 음악 종료
				}

            }
        });

        
        
        recStart.setOnClickListener(new View.OnClickListener() {
            
            @SuppressLint("InlinedApi")
            @Override
            public void onClick(View v) {
                // TODO Auto-generated method stub
            	
            	
                if(recorder != null){
                	//이전에 녹음 중인것인 정지한다.
                    //recorder.stop();
                    //recorder.release();
                    //recorder = null;
                }
                
                recGo = 1;
                seekBar.getProgressDrawable().setColorFilter(Color.RED, Mode.SRC_IN);
                
                
                orgPath = Environment.getExternalStorageDirectory().getAbsolutePath();
                RECORDED_FILE = orgPath+"/mrro/voice/record.mp4";
                
                
                recorder = new MediaRecorder();
                recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                recorder.setAudioChannels(2);
                recorder.setAudioEncodingBitRate(96000);
                recorder.setAudioSamplingRate(96000);
                recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
                recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
                //recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_WB);
                
                
                recorder.setOutputFile(RECORDED_FILE);
                
                try{
                    Toast.makeText(getApplicationContext(), "녹음을 시작합니다.", Toast.LENGTH_LONG).show();
                    recorder.prepare();
                    recorder.start();
                    
                    mHandler.sendEmptyMessage(TIMEDISP);

                    recStart.setVisibility(View.GONE);
                    recStop.setVisibility(View.VISIBLE);
                    
                }catch(Exception ex){
                    
                }
                
            }
        });
        
        
        recStop.setOnClickListener(new View.OnClickListener() {
            
            @Override
            public void onClick(View v) {
                // TODO Auto-generated method stub
                
            	
            	//mediaPlayer.stop();
            	//mediaPlayer.release(); // 자원 해제
            	//mediaPlayer = null;
                // 음악 종료
                //isPlaying = false; // 쓰레드 종료

                
                
                if(recorder == null){
                    finish();
                    return;
                }
                
                recGo = 0;
                seekBar.getProgressDrawable().setColorFilter(Color.YELLOW, Mode.SRC_IN);
                
                recorder.stop();
                recorder.reset();
                recorder.release();
                //recorder = null;
                
                mHandler.removeCallbacksAndMessages(null);
                
                /*
                File file = new File(context.getFilesDir(), "kkkk.txt");
                String filename = "myfile";
                String string = "Hello world";
                FileOutputStream outputStream;
                
                try{
                    outputStream = openFileOutput( filename, Context.MODE_PRIVATE);
                    outputStream.write( string.getBytes());
                    outputStream.close();
                }catch( Exception e){
                    e.printStackTrace();
                }
                */
                finish();
                
                Toast.makeText(getApplicationContext(), "녹음이 중지되었습니다.", Toast.LENGTH_LONG).show();
            }
        });
        
        
        mHandler = new Handler(){
            public void handleMessage(Message msg){
                    super.handleMessage(msg);
               switch(msg.what){
               case TIMEDISP:
                   /** 초시간을 잰다 */
                   int div = msg.what;
                            
                   int min = mainTime / 60;
                   int sec = mainTime % 60;
                   String strTime = String.format("%02d : %02d", min, sec);
                            
         
                   this.sendEmptyMessageDelayed(0, 1000);
                   mTimeView.setText(strTime);
                   mTimeView.invalidate();
                   mainTime++;
            	   break;
               }
                    
                    

                   
            }
         };
        

         
         
         
         seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
             @Override
             public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
            	 
            	 if(recGo == 1) return;
            	 
                 Log.d("pppp", "Progress change");
                 if(mediaPlayer != null){
                	 //mediaPlayer.start();
                 }
                 //isPlaying = true;
                 //mediaPlayer.start();
             }
  
             @Override
             //플레이 중에 터치 
             public void onStartTrackingTouch(SeekBar seekBar) {
            	 if(recGo == 1) return;
            	 
            	 if(mediaPlayer != null){
            		 position = seekBar.getProgress();
                     mediaPlayer.pause();
            	 }
             }
  
             @Override
             //정지상태에서 터치 
             public void onStopTrackingTouch(SeekBar seekBar) {
            	 if(recGo == 1) return;
            	 
            	 if(mediaPlayer != null){
            		 position = seekBar.getProgress();
                     mediaPlayer.seekTo(position);
                     Log.d("stt","onStopTrackingTouch ====="+seekBar.getProgress());
                     
                     if(position>0 && play.getVisibility()==View.GONE){
                         mediaPlayer.start();
                     }
            	 }

             }
         });

         /*
         mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
             @Override
             public void onCompletion(MediaPlayer mp) {
            	 
            	 Toast.makeText(getApplicationContext(), "Play End", Toast.LENGTH_LONG).show();
                /*
            	 if(position+1<list.size()) {
                     position++;
                     playMusic(list.get(position));
                 }
                 
             }
         });
         */
         
    }

    
    public void sonplay(){
    	try{
            isPlaying = true; // 씨크바 쓰레드 반복 하도록
            
            progressUpdate = new ProgressUpdate();
            progressUpdate.start();
    		
        	seekBar.setProgress(position);
        	
            Uri uu = Uri.parse(url);
            
            mediaPlayer = MediaPlayer.create(getApplicationContext(), uu);
            mediaPlayer.setLooping(false);
            mediaPlayer.seekTo(mediaPlayer.getCurrentPosition());
            mediaPlayer.start();
            int a = mediaPlayer.getDuration(); // 노래의 재생시간(miliSecond)
            seekBar.setMax(a);// 씨크바의 최대 범위를 노래의 재생시간으로 설정

            
            if(isPlaying){
                play.setVisibility(View.GONE);
                stop.setVisibility(View.VISIBLE);
            }else{
                play.setVisibility(View.VISIBLE);
                stop.setVisibility(View.GONE);
            }

        	
    	}catch(Exception e){
    		Log.e("play======error", e.getMessage());
    		
    	}
    }
    

/*
    public static void setSeekberThumb(final SeekBar seekBar, final Resources res) {
        seekBar.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
     
                if (seekBar.getHeight() > 0) {
                    Drawable thumb = res.getDrawable(R.drawable.proball2);
                    int h = seekBar.getMeasuredHeight();
                    int w = h;
                    Bitmap bmpOrg = ((BitmapDrawable) thumb).getBitmap();
                    Bitmap bmpScaled = Bitmap.createScaledBitmap(bmpOrg, w, h, true);
                    Drawable newThumb = new BitmapDrawable(res, bmpScaled);
                    newThumb.setBounds(0, 0, newThumb.getIntrinsicWidth(), newThumb.getIntrinsicHeight());
                    seekBar.setThumb(newThumb);
                    seekBar.getViewTreeObserver().removeOnPreDrawListener(this);
                }
                return true;
            }
        });
    }
*/
    
    class ProgressUpdate extends Thread{
        @Override
        public void run() {

            while(isPlaying){
                try {
                    Thread.sleep(200);
                    Log.d("kkkk", "progress gogo1");
                    if(mediaPlayer!=null){
                    	position = mediaPlayer.getCurrentPosition();
                        seekBar.setProgress(position);
                    }
                } catch (Exception e) {
                    Log.e("ProgressUpdate",e.getMessage());
                }
 
            }
        }
    }

    @SuppressLint("NewApi")
	private String getHttpGet(String url0){
    	

    	String fileto = orgPath+"/mrro/gasa.txt";
		
    	
    	try {
			InputStream inputStream = new URL(url0).openStream();
			
			
	    	File file = new File(fileto);
	    	OutputStream out = new FileOutputStream(file);
	    	writeFile(inputStream, out);
	    	out.close();
	    	
	    	
	    	String sdPath = Environment.getExternalStorageDirectory().getAbsolutePath();
			FileInputStream fis = new FileInputStream(fileto);
	    	byte[] data = new byte[fis.available()];
	    	while(fis.read(data)!=-1){}
	    	fis.close();
	    	String tt = new String(data);
	    	Log.d("wrgasa", "가사 url===."+sdPath+"//////"+tt);
	    	//tv.setText(tt);


	    	/*
            // 파일에서 읽은 데이터를 저장하기 위해서 만든 변수
            StringBuffer data = new StringBuffer();
            FileInputStream fis = openFileInput(fileto);//파일명
            BufferedReader buffer = new BufferedReader
                    (new InputStreamReader(fis));
            String str = buffer.readLine(); // 파일에서 한줄을 읽어옴
            while (str != null) {
                data.append(str + "\n");
                str = buffer.readLine();
            }
            tv.setText(data);
            buffer.close();
	    	*/
	    	return tt;
	    	
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        

    	
    	
    	
    	
    	
    	
    	
    	
    	/*
    	
    	try {
			url = new URL(url0);
			
			Log.d("gasa", "가사 url===="+url0);
			
			//Toast.makeText(getApplicationContext(), "가사 url===."+url0, Toast.LENGTH_LONG).show();
			
	       	HttpURLConnection httpURLCon;
			try {
				httpURLCon = (HttpURLConnection)url.openConnection();
		        httpURLCon.setDefaultUseCaches(false);
		        //httpURLCon.setDoInput(true);
		        httpURLCon.setDoOutput(true);
		        httpURLCon.setRequestMethod("POST");
		        httpURLCon.setConnectTimeout(5000);
		        httpURLCon.setReadTimeout(5000);
		        //httpURLCon.setRequestProperty("content-type","applicaton/x-www-form-urlencoded");
		        
		        String fileName = Uri.parse(url0).getLastPathSegment();

                //String data = et.getText().toString();
                
                // 파일에서 읽은 데이터를 저장하기 위해서 만든 변수
                StringBuffer data = new StringBuffer();
                FileInputStream fis = openFileInput(fileName);//파일명
                BufferedReader buffer = new BufferedReader
                        (new InputStreamReader(fis));
                String str = buffer.readLine(); // 파일에서 한줄을 읽어옴
                while (str != null) {
                    data.append(str + "\n");
                    str = buffer.readLine();
                }
                tv.setText(data);
                buffer.close();


		        
		        /*
                try { 
                    FileOutputStream fos = openFileOutput
                            (fileName, // 파일명 지정
                                    Context.MODE_APPEND);// 저장모드
                    PrintWriter out = new PrintWriter(fos);
                    //out.println(data);
                    System.out.println(new String(out.toByteArray(), "UTF-8"));      
                    
                    out.close();
 
                    //tv.setText("파일 저장 완료");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                */

		        
		        
		        /*
		        try (OutputStream out = httpURLCon.getOutputStream()) {
		            out.write("id=javaking".getBytes());
		            out.write("&".getBytes());
		            out.write(("name=" + URLEncoder.encode("자바킹","UTF-8")).getBytes());
		        }
		        
		        // 응답 내용(BODY) 구하기        
		        try (InputStream in = httpURLCon.getInputStream();
		            ByteArrayOutputStream out = new ByteArrayOutputStream()) {
		            
		            byte[] buf = new byte[1024 * 8];
		            int length = 0;
		            while ((length = in.read(buf)) != -1) {
		                out.write(buf, 0, length);
		            }
		            System.out.println(new String(out.toByteArray(), "UTF-8"));            
		        }
                */


		        
		        
		        
		        
		        
		        
		        
		        /*
		        
		        StringBuffer sb = new StringBuffer();
		               
		        PrintWriter pw = new PrintWriter(new OutputStreamWriter(httpURLCon.getOutputStream(),"UTF-8"));
		        pw.write(URLEncoder.encode(sb.toString(),"UTF-8"));
		        pw.flush();
		         
		       BufferedReader bf = new BufferedReader(new InputStreamReader(httpURLCon.getInputStream(),"UTF-8"));
		       String line;
		       
		       while((line = bf.readLine()) != null){
		    	   if(line.indexOf("\">") > 0  && line.indexOf("</a>") > 0) {
		    	   }
		    	   
		       }
		       
		       
		       //return line;
						       */

			/*
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			*/
		    
/*
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
*/		
		return "err";

    } 
    
    
    public void writeFile(InputStream is, OutputStream os) throws IOException
    {
         int c = 0;
         while((c = is.read()) != -1)
             os.write(c);
         os.flush();
    }  
    
	
	public void onDestroy(){
		super.onDestroy();
		
		if(mediaPlayer != null){
			mediaPlayer.stop();
			mediaPlayer.release();
			mediaPlayer = null;
			isPlaying = false;
			seekBar.setProgress(0);
			//progressUpdate.stop();
			
            if(isPlaying){
                play.setVisibility(View.GONE);
                stop.setVisibility(View.VISIBLE);
            }else{
                play.setVisibility(View.VISIBLE);
                stop.setVisibility(View.GONE);
            }

        	//Toast.makeText(getApplicationContext(), "네이티브 thread stop===."+url, Toast.LENGTH_LONG).show();

            //finish();
            
            // 음악 종료
		}
		
	}

	
	@Override 
    public void onStop(){ 
		super.onStop(); 

		if(mediaPlayer != null){
			mediaPlayer.stop();
			mediaPlayer.release();
			mediaPlayer = null;
			isPlaying = false;
			seekBar.setProgress(0);
			//progressUpdate.stop();
			
            if(isPlaying){
                play.setVisibility(View.GONE);
                stop.setVisibility(View.VISIBLE);
            }else{
                play.setVisibility(View.VISIBLE);
                stop.setVisibility(View.GONE);
            }

        	//Toast.makeText(getApplicationContext(), "네이티브 thread stop===."+url, Toast.LENGTH_LONG).show();

            //finish();
            
            // 음악 종료
		}
		
		System.out.println("::::onStop():::rec===");
    } 

    
}
