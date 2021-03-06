package com.twin7.mrro;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class voiceRecAudio extends Activity{

    //String RECORDED_FILE = "/sdcard/mrro/voice/record.mp4";
    
    MediaPlayer player;
    
    Button recStart;
    Button recStop;
    
    String orgPath = "";
    
    TextView mTimeView;
    
    Handler mHandler;
    
    int mainTime = 0;
    
    
    private static final int RECORDER_SAMPLERATE = 8000;
    //private static final int RECORDER_CHANNELS = AudioFormat.CHANNEL_IN_MONO;
    private static final int RECORDER_CHANNELS = AudioFormat.CHANNEL_IN_STEREO;
    @SuppressLint("InlinedApi")
    private static final int RECORDER_AUDIO_ENCODING = AudioFormat.ENCODING_PCM_16BIT;
    private AudioRecord recorder = null;
    private Thread recordingThread = null;
    private boolean isRecording = false;
    
    private int BufferElements2Rec = 1024; // want to play 2048 (2K) since 2 bytes we use only 1024
    private int BytesPerElement = 2; // 2 bytes in 16bit format
    
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        //타이틀바 표시 하지 않는다.
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.vrec);
        
        
        setButtonHandlers();
        enableButtons(false);
        int bufferSize = AudioRecord.getMinBufferSize(RECORDER_SAMPLERATE,RECORDER_CHANNELS, RECORDER_AUDIO_ENCODING);
        
        
    }
    
    
    private void setButtonHandlers() {
        ((Button) findViewById(R.id.recgo)).setOnClickListener(btnClick);
        ((Button) findViewById(R.id.recstop)).setOnClickListener(btnClick);
    }
    
    private void enableButton(int id, boolean isEnable) {
        ((Button) findViewById(id)).setEnabled(isEnable);
    }
    private void enableButtons(boolean isRecording) {
        enableButton(R.id.recgo, !isRecording);
        enableButton(R.id.recstop, isRecording);
    }
    

    
    private void startRecording() {
        recorder = new AudioRecord(MediaRecorder.AudioSource.MIC, RECORDER_SAMPLERATE, RECORDER_CHANNELS,RECORDER_AUDIO_ENCODING, BufferElements2Rec * BytesPerElement);
        recorder.startRecording();
        isRecording = true;
        recordingThread = new Thread(new Runnable() {
            public void run() {
                writeAudioDataToFile();
                }
        }, "AudioRecorder Thread");
        recordingThread.start();
    }
    
    
    //convert short to byte     
    private byte[] short2byte(short[] sData) {
        int shortArrsize = sData.length;
        byte[] bytes = new byte[shortArrsize * 2];
        for (int i = 0; i < shortArrsize; i++) {
            bytes[i * 2] = (byte) (sData[i] & 0x00FF);
            bytes[(i * 2) + 1] = (byte) (sData[i] >> 8);
            sData[i] = 0;
            }
        return bytes;
    }
    
    private void writeAudioDataToFile() {         // Write the output audio in byte
        orgPath = Environment.getExternalStorageDirectory().getAbsolutePath();
        //String filePath = "/sdcard/voice8K16bitmono.pcm";
        String filePath = orgPath+"/mrro/voice/record.mp4";
        short sData[] = new short[BufferElements2Rec];
        FileOutputStream os = null;
        try {
            os = new FileOutputStream(filePath);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
        }
        
        while (isRecording) {             // gets the voice output from microphone to byte format
            recorder.read(sData, 0, BufferElements2Rec);
            System.out.println("Short wirting to file" + sData.toString());
            try {                 // // writes the data to file from buffer
                // // stores the voice buffer
                byte bData[] = short2byte(sData);
                os.write(bData, 0, BufferElements2Rec * BytesPerElement);
            } catch (IOException e) {
                    e.printStackTrace();
            }
        }
        
        try {
            os.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
    }
    
    
    private void stopRecording() {         // stops the recording activity
        if (null != recorder) {
            isRecording = false;
            recorder.stop();
            recorder.release();
            recorder = null;
            recordingThread = null;
            
            finish();
            
            Toast.makeText(getApplicationContext(), "녹음이 중지되었습니다2.", Toast.LENGTH_LONG).show();
            }
    }
    
    private View.OnClickListener btnClick = new View.OnClickListener() {
        public void onClick(View v) {
            switch (v.getId()) {
            case R.id.recgo: {
                enableButtons(true);
                startRecording();
                break;
                }
            case R.id.recstop: {
                enableButtons(false);
                stopRecording();
                break;
                }
            }
        }
    };
        
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                finish();
            }
            return super.onKeyDown(keyCode, event);
    }
    
    

    
}
