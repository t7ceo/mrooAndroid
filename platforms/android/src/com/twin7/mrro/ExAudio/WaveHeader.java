package com.twin7.mrro.ExAudio;

import android.util.Log;

import java.io.IOException;
import java.io.InputStream;

public class WaveHeader {
    public static final String TAG = "WaveHeader";

    public static final String RIFF_HEADER = "RIFF";
    public static final String WAVE_HEADER = "WAVE";
    public static final String FMT_HEADER = "fmt ";
    public static final String DATA_HEADER = "data";
    public static final int HEADER_BYTE_LENGTH = 44;

    private boolean valid;
    private String chunkId;
    private long chunkSize;
    private String format;
    private String subChunk1Id;
    private long subChunk1Size;
    private int audioFormat;
    private int channels;
    private long sampleRate;
    private long byteRate;
    private int blockAlign;
    private int bitsPerSample;
    private String subChunk2Id;
    private long subChunk2Size;

    public WaveHeader(){
        //필드를 미리 초기화 한다
        chunkSize = 36;
        subChunk1Size = 16;
        audioFormat = 1;
        channels = 1;
        sampleRate = 8000;
        byteRate = 16000;
        blockAlign = 2;
        bitsPerSample = 16;
        subChunk2Size = 0;
        valid = true;
    }

    //파일을 스트링으로 읽어 필요한 WAV 헤더로부터 정보를 추출한다
    public WaveHeader(InputStream inputStream){
        valid = loadHeader(inputStream);
    }

    private boolean loadHeader(InputStream inputStream){

        byte[] headerBuffer = new byte[HEADER_BYTE_LENGTH];
        try{

            inputStream.read(headerBuffer);

            int pointer = 0;
            //헤더의 아이디는 'RIFF'으로 시작되어야 한다.
            chunkId = new String(new byte[]{headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++]});

            //다음은 정크의 크기를 나타낸다. 리틀엔디언으로 다음과 같이 변환작업을 수행한다. 32비트를 long 타입으로 변환한다.
            chunkSize = (long)(headerBuffer[pointer++] & 0xff) | (long)(headerBuffer[pointer++] & 0xff) << 8 | (long)(headerBuffer[pointer++] & 0xff) << 16 | (long)(headerBuffer[pointer++] & 0xff) << 24;

            //파일 타입은 'WAVE' 이어야 한다.
            format = new String (new byte[]{headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++]});

            //아래는 포맷에 맞추어 'fmt '이어야 한다.
            subChunk1Id = new String (new byte[]{headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++]});

            //포맷 정크의 크기를 나타낸다.
            subChunk1Size = (long)(headerBuffer[pointer++] & 0xff) | (long)(headerBuffer[pointer++] & 0xff) << 8 | (long)(headerBuffer[pointer++] & 0xff) << 16 | (long)(headerBuffer[pointer++] & 0xff) << 24;

            //데이터 포맷을 가리킨다. 여기서는 무조건 PCM 포맷만을 허용한다.
            audioFormat = (int)((headerBuffer[pointer++] & 0xff) | (headerBuffer[pointer++] & 0xff) << 8);

            //채널수를 나타낸다.
            channels = (int)((headerBuffer[pointer++] & 0xff) | (headerBuffer[pointer++] & 0xff) << 8);

            //샘플-레이트를 추출한다.
            sampleRate = (long)(headerBuffer[pointer++] & 0xff) | (long)(headerBuffer[pointer++] & 0xff) << 8 | (long)(headerBuffer[pointer++] & 0xff) << 16 | (long)(headerBuffer[pointer++] & 0xff) << 24;

            //파이트 레이트를 나타낸다.
            byteRate = (long)(headerBuffer[pointer++] & 0xff) | (long)(headerBuffer[pointer++] & 0xff) << 8 | (long)(headerBuffer[pointer++] & 0xff) << 16 | (long)(headerBuffer[pointer++] & 0xff) << 24;

            //블록배열의 크기를 나타낸다.
            blockAlign = (int)((headerBuffer[pointer++] & 0xff) | (headerBuffer[pointer++] & 0xff) << 8);

            //샘플에서 사용하는 비트 수를 나타낸다.
            bitsPerSample = (int)((headerBuffer[pointer++] & 0xff) | (headerBuffer[pointer++] & 0xff) << 8);

            //데이터의 영역을 나타내는 식별나이다. 포맷이 오래전에 만들어지다. 보니 간혹 규칙을 지키지 않는 파일들도 존재한다.
            subChunk2Id = new String (new byte[]{headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++], headerBuffer[pointer++]});

            //데이터 정크의 크기를 나타낸다.
            subChunk2Size = (long)(headerBuffer[pointer++] & 0xff) | (long)(headerBuffer[pointer++] & 0xff) << 8 | (long)(headerBuffer[pointer++] & 0xff) << 16 | (long)(headerBuffer[pointer++] & 0xff) << 24;

            Log.d("mixW","**********first Get="+chunkId+"////"+chunkSize+"///"+format+"///"+subChunk1Id+"///"+subChunk1Size+"///"+audioFormat+"///"+channels+"///"+sampleRate+"///"+byteRate+"///"+blockAlign+"///"+bitsPerSample+"///"+subChunk2Id+"///"+subChunk2Size);

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        //여기서는 단순화를 위해 샘플의 비트수를 8비트와 16 비트만을 처리하고자 한다.
        if(bitsPerSample != 8 && bitsPerSample != 16){
            Log.d(TAG, "WaveHeader: only supperts bitsPerSample 8 or 16");
            return false;
        }

        //데이터의 크기를 보관하는 위치가 잘못된 파일이 많아 부득불 크기를 재계산
        if(! subChunk2Id.toUpperCase().equals(DATA_HEADER)){
            if(chunkSize != (20 + subChunk1Size + subChunk2Size)){
                long modChunk2Size = chunkSize - 20 - subChunk1Size;
                Log.d(TAG, "파일 SubChunk2Size는 " + subChunk2Size + "다시 수정크기는 " + modChunk2Size);

                subChunk2Size = modChunk2Size;
            }
        }



        //데이터가 PCM 포맷인 WAV 파일만을 선택한다.
        if(chunkId.toUpperCase().equals(RIFF_HEADER) && format.toUpperCase().equals(WAVE_HEADER) && audioFormat == 1){
            return true;
        }else{
            Log.d(TAG, "WaveHeader: Unsupported header format");
        }

        return false;
    }
    //0-3:RIFF
    public long getChunkSize(){
        //4-7
        return chunkSize;       //파일의 크기
    }
    //8-11:WAVE,   12-15:fmt ,
    public long getChunk1Size(){
        //16-19     16고정
        return subChunk1Size;
    }
    public int getAudioFormat(){
        //20-21  PCM
        return audioFormat;
    }
    public int getChannels(){
        //22-23
        return channels;
    }
    public long getSampleRate(){
        //24-27     임의로 설정 44100
        return sampleRate;
    }
    public long getByteRate(){
        //28-31      계산에 의하여 결정******************
        return byteRate; //((sampleRate * bitsPerSample * channels) / 8);
    }
    public int getBlockAlign(){
        //32-33 === 하나의 샘플이 차지하는 크기를 바이트 단위로 표시  계산으로 결정**********
        return ((bitsPerSample * channels) / 8);
    }
    public int getBitsPerSample(){
        //34-35   === 하나의 샘플당 비트수  ****** 임의로 설정
        return bitsPerSample;
    }
    //36-39: data
    public long getChunk2Size(){
        //40-43      chunkSize - 36
        return subChunk2Size;
    }
    public long getSubChunk2Size(){
        //40-43      chunkSize - 36
        return subChunk2Size;
    }



    public long countChunk2Size(){   //Chunk2Size 계산하여 반환
        return chunkSize - 36;
    }




    //아래는 세터 메소드이고 WAV 포맷 파일을 만들 때 사용한다.
    //그러나 예제에서 사용하지 않지만 참고로 보기 바란다.
    public void setSampleRate(long sampleRate){
        int newSubChunk2Size = (int)(this.subChunk2Size * sampleRate / this.sampleRate);
        if((this.bitsPerSample / 8) % 2 == 0){
            if(newSubChunk2Size % 2 != 0){
                newSubChunk2Size++;
            }
        }

        this.sampleRate = sampleRate;
        this.byteRate = (sampleRate * this.bitsPerSample * this.channels) / 8;
        this.chunkSize = newSubChunk2Size + 36;
        this.subChunk2Size = newSubChunk2Size;

        Log.d("Record", "******* setSampleRate*****in Samplerate="+sampleRate+"***sampleRate="+this.sampleRate+"///byteRate="+this.byteRate+"///chunkSize="+this.chunkSize+"///subChunk2Size="+this.subChunk2Size);
    }

    public String toString(String fileLink){
        StringBuffer sb = new StringBuffer();
        sb.append("fileLink: "+fileLink);
        sb.append("\n");
        sb.append("chunkId(0-3): " + chunkId);
        sb.append("\n");
        sb.append("chunkSize(4-7): " + chunkSize);
        sb.append("\n");
        sb.append("format(8-11): " + format);
        sb.append("\n");
        sb.append("subChunk1Id(12-15): " + subChunk1Id);
        sb.append("\n");
        sb.append("subChunk1Size(16-19)16고정: " + subChunk1Size);
        sb.append("\n");
        sb.append("audioFormat(20-21)PCM: " + audioFormat);
        sb.append("\n");
        sb.append("channels(22-23): " + channels);
        sb.append("\n");
        sb.append("sampleRate(24-27): " + sampleRate);
        sb.append("\n");
        sb.append("byteRate(28-31): " + byteRate);
        sb.append("\n");
        sb.append("blockAlign(32-33): " + blockAlign);
        sb.append("\n");
        sb.append("bitsPerSample(34-35): " + bitsPerSample);
        sb.append("\n");
        sb.append("subChunk2Id(36-39): " + subChunk2Id);
        sb.append("\n");
        sb.append("subChunk2Size(40-43): " + subChunk2Size);

        return sb.toString();
    }

}
