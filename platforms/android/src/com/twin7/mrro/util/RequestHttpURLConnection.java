package com.twin7.mrro.util;


import android.content.ContentValues;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

public class RequestHttpURLConnection{

    public String request(String _url, ContentValues _params){

        HttpURLConnection urlConn = null;

        StringBuffer sbPrams = new StringBuffer();

        if(_params == null){
            //보낼 데이터가 없으면 파라미터를 비운다.
            sbPrams.append("");
        }else{
            //파라미터가 2개 이상이면 파라미터 연결에 &가 필요하므로 스위칭할 변수 생성.
            boolean isAnd = false;
            //파라미터 키와 값.
            String key;
            String value;

            for(Map.Entry<String, Object> parameter : _params.valueSet()){
                key = parameter.getKey();
                value = parameter.getValue().toString();

                //파라미터가 두개 이상일때 파라미터 사이에 &를 붙인다.
                if(isAnd) sbPrams.append("&");

                sbPrams.append(key).append("=").append(value);

                //파라미터가 2개 이상이면 isAnd를 true로 바꾸고 다음 루프 부터 &를 붙인다.
                if(!isAnd){
                    if(_params.size() >= 2) isAnd = true;
                }

            }
        }


        try{
            URL url = new URL(_url);
            urlConn = (HttpURLConnection) url.openConnection();

            urlConn.setRequestMethod("POST");
            urlConn.setRequestProperty("Accept-Charset", "UTF-8");
            urlConn.setRequestProperty("Context_Type", "application/x-www-form-urlencoded;cahrset=UTF-8");

            String strPrams = sbPrams.toString();  //sbPrams에 정의한 파라미터를 스트링으로 저장  ex)  id=id1&pw=123
            OutputStream os = urlConn.getOutputStream();
            os.write(strPrams.getBytes("UTF-8"));  //출력 스트림에 출력.
            os.flush();
            os.close();


            if(urlConn.getResponseCode() != HttpURLConnection.HTTP_OK) return null;

            BufferedReader reader = new BufferedReader(new InputStreamReader(urlConn.getInputStream(), "UTF-8"));

            //출력물의 라인과 그 합에 대한 변수,
            String line;
            String page = "";

            while((line = reader.readLine()) != null){
                page += line;
            }

            return page;


        } catch (MalformedURLException e) {
            e.printStackTrace();
        }catch (IOException e){   //for openConnection();
            e.printStackTrace();
        }finally {
            if (urlConn != null) urlConn.disconnect();
        }

        return null;
    }





}
