String.prototype.replaceAll = replaceAll;
function replaceAll(str1, str2){
	var strTemp = this;
	strTemp = strTemp.replace(new RegExp(str1, "g"), str2);
	return strTemp;
}


//====================================================
//제일 처음 페이지 관련 처리
//====================================================
	$(document).on("pagecreate", "div", function(e,u){
	    //alert("11114pagecreate00000");

		//처리순서 1
		appBasInfo.nowPage = this.id;
		appBasInfo.pageCreate();

	});
	//페이지 초기화=================================================
	$(document).bind("pageinit", function(){
		//alert("11114pageinit111111");

		//console.log("=====page init=====");


	});
    //페이지 보여주기 전=================================================
	$(document).on("pagebeforeshow", "div", function(e,u){
        //alert("11114pagebeforeshow22222");

		appBasInfo.nowPage = this.id;


		console.log("now page======="+this.id);



		//appBasInfo.init();

		//contentH();
		//회원가입 메뉴의 보이기와 숨기기
		//meminf.setSohoJoinMenu();
		//cms 에서 앱 종료를 요청하면 종료하기 위해 감시한다.
		//appBasPro.getAppBasInfo();


		//기본 높이를 설정한다.
		//topHeight = 0;
		//$(".loadingImg").css({"margin":" "+(topHeight+100)+"px 0 15px"});

		appBasInfo.beforShow();



	});
	//=================================================
	$(document).on("pageshow", "div", function(e,u){
        //여기 까지는 아직 페이지아가 보이지 않는다.
		appBasInfo.nowPage = this.id;

		appBasInfo.pageShow();

	});
	//=================================================
	$(document).on("pagehide", "div", function(e,u){
	    //페이지가 전환되면서 이전 페이지가 사라질 때 호출
		appBasInfo.pageHide();


	});
//================================================
//페이지 출력후 아래 순서로 진행
//페이지 관련 기능 -> ready -> load
//================================================
//ready
//================================================
	$(document).ready(function($){
        //여기서 페이지가 출력된다

		//FastClick.attach(document.body);
		
		$( document ).bind( 'mobileinit', function(){
		  	$.mobile.loader.prototype.options.text = "Loading...";
		  	$.mobile.loader.prototype.options.textonly = true;
		  	$.mobile.loader.prototype.options.textVisible = true;
		  	$.mobile.loader.prototype.options.theme = "none";
		  	//$.mobile.loader.prototype.options.html = "<div style='width:100%; text-align:center; z-index:999; background-color:white; border-radius:30px; padding:1px 0;'><img src='./images/loading.png' width='150px'></div>";
	
		  	$.mobile.selectmenu.prototype.options.nativeMenu = false;
		});


/*
        $(".vertical-center-4").slick({
         dots: true,
         vertical: true,
         centerMode: true,
         slidesToShow: 4,
         slidesToScroll: 2
       });

       $(".vertical-center-3").slick({
         dots: true,
         vertical: true,
         centerMode: true,
         slidesToShow: 3,
         slidesToScroll: 3
       });


       $(".vertical-center-2").slick({
         dots: true,
         vertical: true,
         centerMode: true,
         slidesToShow: 2,
         slidesToScroll: 2
       });

       $(".vertical-center").slick({
         dots: true,
         vertical: true,
         centerMode: true,
       });


       $(".vertical").slick({
         dots: true,
         vertical: true,
         slidesToShow: 3,
         slidesToScroll: 3
       });


       $(".regular").slick({
         dots: true,
         infinite: true,
         slidesToShow: 3,
         slidesToScroll: 3
       });
       $(".center").slick({
         dots: true,
         infinite: true,
         centerMode: true,
         slidesToShow: 5,
         slidesToScroll: 3
       });
       $(".variable").slick({
         dots: true,
         infinite: true,
         variableWidth: true
       });
*/


       $(".lazy").slick({
         lazyLoad: 'ondemand', // ondemand progressive anticipated
         infinite: false,
       });


        //앱시작시 한번 페이지 기본정보 초기화 한다.
        proPage.pageInit();
        //proPage.slickObj = new Slick();

		
	});
//================================================
//load 처리
//================================================
	$(window).load(function(){

		appBasInfo.wonsiInit();   //기본 화면의 높이를 가져온다.

		leftMenu.insertLeftMnu();

		//jquery 버튼의 반응속도를 빠르게 한다.
		//initFastButtons();


		//페이지 출력 처리를 한다- 처음 메이니 페이지 출력
        proPage.loadPage(mainPage);
        proPage.tabDispInf(true);

        //Slick.postSlide(3);


        //alert("first1====");

		document.addEventListener("deviceready", onDeviceReady, false);
		

		
		//back 버튼
		document.addEventListener("backbutton", onBackKeyDown, false);
		
		
		document.addEventListener('touchstart', function(event) {
			//if( navigator.userAgent.match(/Android/i) ) {
			
			    //event.preventDefault();
	
			    var touch = event.touches[0];
			    pageXpo = touch.pageX;
			    pageYpo = touch.pageY;
			    ////console.log("Touch x:" + touch.pageX + ", y:" + touch.pageY);
		    
		    //}
		}, false);


		//console.log("====load====");
		$(document).ajaxStart(function(){
			//lodinggo();
		});
		$(document).ajaxStop(function(){
			$.mobile.loading( "hide" );
		});


		
		document.addEventListener("pause",function (){
			

			
		},false);
		
		
		
		document.addEventListener("resume",function(){  //화면이 다시 전면에 나옴
			
			resumeInf = true;
			if(appBasInfo.recordInf && (appBasInfo.nowPage == "Miriplay" || appBasInfo.nowPage == "NewMr")){
				appBasInfo.recordInf = false;
				
				//로컬파일의 존재여부
				localSys.fileIsInf();
				
			}
			
			
		}, false);
		

		
		
		$(window).bind("load", function(){
			
			
			
		
		});
		
		$(window).bind("resize", function(){
			//ScaleSliderT();
			//ScaleSlider();
			
		});

		
		$(window).bind("orientationchange", function(){
			//ScaleSliderT();
			//ScaleSlider();
			
		});
		
		
		document.addEventListener("online",function(){  //online 상태 확인
			
		}, false);
		document.addEventListener("offline",function(){  //offline 상태 확인
			
		}, false);

		
		document.addEventListener("onPageFinished",function(){
			

		},false);
		



/*
        $(document).on("scroll", function (){

            topHeight = $(document).scrollTop();
            $(".loadingImg").css({"margin":" "+(topHeight+100)+"px 0 15px"});

        });
*/



        //************************************************************
        //전체영역  클릭
        //************************************************************


        $(".musicSangseSe").click(function(){

            $("#musicSangseSe").popup("open");

        });

		$("#idfind").click(function(){

			var el = frmPro.forminput("idfindFrm");
			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=idfind&"+el);  //서버에서 post 모드로 가져온다.
			}
			return false;
		});

		$("#passfind").click(function(){

			var el = frmPro.forminput("passfindForm");
			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=passfind&"+el);  //서버에서 post 모드로 가져온다.
			}
			return false;
		});

		$("#passChan").click(function(){
			appUtil.moveOkHistory("index.html#PassChange");
		});

		$("#chnagePassGo").click(function(){
			var el = frmPro.forminput("changePass");
			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=passchange&email="+meminf.email+"&"+el);  //서버에서 post 모드로 가져온다.
			}
			return false;

		});



        /*
        //길게 클릭한 경우 삭제 여부를 처리 한다.
        $("#voiceRecUl li table td").on("taphold", function(){
            var liid = $(this).attr("id");
            delMemRec(liid);
        });
        */


		//엔터키 처리를 한다.
		$("#panelCloseImg"+appBasInfo.nowPage).click(function(){
			appUtil.closePannel();

		});

		$("#songShowList").click(function(){
			appBasInfo.songShowSMN = 3;

			appUtil.moveOkHistory("songShow2.html");
		});

		$("#songRecGo").click(function(){

			appUtil.moveOkHistory("songRec.html");
		});

       $(document).on("click","#getTop100, #getNewMr", function(e){
            //alert("kkkkkkkkk22"+this.id);

            $("#addMenuMain").hide();
            $(".musicBarR").show();
            $(".contentLoading").show();
            $("#top100Page").html("");


            switch(this.id){
            case "getTop100":
                toggleCls("getTop100", "roundBtnNormalOn");
                toggleCls("getNewMr", "roundBtnNormalOn");


		getServ = new GetServer();
		getServ.initParam("getMrAll.php", "mode=allMusic5", "top100Page");
		getServ.getPostMode();

            break;
            case "getNewMr":
                toggleCls("getTop100", "roundBtnNormalOn");
                toggleCls("getNewMr", "roundBtnNormalOn");

		getServ = new GetServer();
		getServ.initParam("getMrAll.php", "mode=allMusic5", "top100Page");
		getServ.getPostMode();

            break;
            }


         });


        $(document).on("click",".roundBoxBlue, .footMenuCall", function(e){
            //alert("kkkkkkkkk22"+this.className);

            switch(this.className){
            case "footMenuCall ui-link":

                //alert("ggggg");
                $("#addMenuMain").show();
                $(".musicBarR").hide();

            break;
            case "roundBoxBlue":

                //proPage.loadPage(Jumun);

            break;
            }


         });


        //************************************************************
        //index.html 클릭
        //************************************************************
        $(".recordVoice").click(function(){
            callNative.recordVoice("0", "0", "0");
        })
        //************************************************************



        //****************************************************************
        //종료
        //****************************************************************

		
		
	});

	
//========================================================================

//==========================================
//로드관련 모든 함수들
//==========================================
//파일 시스템을 시작 한다.
/*
window.requestFileSystem(LocalFileSystem.PERSISTENT,0,gotFS,fail);
function gotFS(FileSystem){
	FileSystem.root.getDirectory("sohoring",{create:true,exclusive:false},gotDirectory, fail);
}
function fail(FileError){
	//console.log(FileError.code);
}
//디렉토리 엔터리를 얻는다.
function gotDirectory(directoryEntry){
	//console.log(directoryEntry.fullPath);
}
*/

//파일을 복사한다.==================================
function success(Entry) {
    //console.log("New Path: " + Entry.fullPath);
}

function fail(error) {
    //alert("erererer=="+error.code);
}



function moveFile(Entry) {
    //console.log("*******"+Entry+"/ path=="+fileDir);

    var parent = window.resolveLocalFileSystemURI(fileDir, onSuccess, onError);
    parentEntry = new DirectoryEntry({fullPath:parent});

    //파일 엔트리를 이용하여 fileDir 이라는 목적 디렉토리로 "newFile.txt" 라는 이름으로 복사한다.
    Entry.moveTo(parentEntry, "file.copy", success, fail);
}

function onSuccess(Entry) {
    //console.log("New Path: " + Entry.fullPath);
}

function successHandler(){

}

function onError(error) {
    //alert("erererer=="+error.code);
}

function errorHandler(){

}
//==========================================================


//====================================

	function onDeviceReady(){

		readOking = true;

        //alert("first2====");


		//navigator.splashscreen.show();
		//앱시작전 배경화면
		//navigator.splashscreen.hide();
		appBasInfo.deviceUiu = device.uuid;
		window.sessionStorage.setItem("deviceUiu",appBasInfo.deviceUiu);

		//alert("first3====");

		appBasInfo.deviceMD = device.model;
		//alert(device.model+"/"+device.name);

        //alert("first4====");

		//푸시관련 처리
		///*
		if(device.platform.toUpperCase() == 'ANDROID'){
			//안드로이드
	        window.plugins.pushNotification.register(successHandler,errorHandler, {
	          "senderID" : "895646824462", // Google GCM 서비스에서 생성한 Project Number를 입력한다.895646824462
	          "ecb" : "onNotificationGCM" // 디바이스로 푸시가 오면 onNotificationGCM 함수를 실행할 수 있도록 ecb(event callback)에 등록한다.
	        });
	      } else {
	    	//아이폰
	        // PushPlugin을 설치했다면 window.plugins.pushNotification.register를 이용해서 iOS 푸시 서비스를 등록한다.
	        window.plugins.pushNotification.register(tokenHandler, errorHandler, {
	          "badge":"true", // 뱃지 기능을 사용한다.
	          "sound":"true", // 사운드를 사용한다.
	          "alert":"true", // alert를 사용한다.
	          "ecb": "onNotificationAPN" // 디바이스로 푸시가 오면 onNotificationAPN 함수를 실행할 수 있도록 ecb(event callback)에 등록한다.
	        });
	      }
		//*/


		appUtil.autoLogin();  //자동로그인


		window.sessionStorage.setItem("wifiinf", "init");

		conType = navigator.network.connection.type;

        //alert("first5====");

		if(conType != "none"){   //네트워크 연결 되엇다.
			//첫번째 주문 여부를 확인 한다.
			//meminf.areYouFirst("new");

			//setTimeout("pageLoading()",5000);
			//meminf.areYouSohoring();



		}

        localSys.mkFold("mrro/");
		localSys.mkFold("mrro/.down/");
		localSys.mkFold("mrro/mixMusic/");
		localSys.mkFold("mrro/voice/");
		localSys.getDirEntry('mrro/imsi/');

        //alert("first7====");

	}



	function moveGoback(){
		history.go(-1);   //앞으로
	}


    function goPageBack(){
    	//배열에 저장된 페이지로 뒤로 가기 한다
    	var arrsu = proPage.urlHistory.length;

        proPage.urlHistory.pop();
        arrsu = (proPage.urlHistory.length - 1);
        if(arrsu < 0) arrsu = 0;
        var gopg = proPage.urlHistory[arrsu];
        proPage.urlHistory.pop();
        eval("proPage.loadPage("+gopg+")");
    }

	//뒤로가기
	function moveBack(){

		if(appBasInfo.nowPage == "Fpage"){

			//alert("moveBack==="+proPage.urlHistory.length);
			if(proPage.urlHistory.length == 1) navigator.notification.confirm(lngTxt.endOk, proMsg.onBackKeyDownMsg, lngTxt.endbtn, lngTxt.nookbtn);
			else{

			    if(proPage.pageId == "gasathinkPro"){
			        if(!localSys.thinkFileWrInf){
			            navigator.notification.confirm('파일을 저장하지 않으면 삭제 됩니다.', function(button){
                    	    	if(button == 1){   //그냥 함수를 빠져나간다.
                    	    		//alert("iiiiiiiii");
                    	    		goPageBack();
                    	    	}
                    		}, '알림', '삭제,저장');   //1:삭제,  2:저장
			        }else{
			                    goPageBack();
			        }
			    }else{
			                    goPageBack();
			    }

			}

		}else if(appBasInfo.nowPage == "AASangse" || appBasInfo.nowPage == "AASangseNew"){
			if(gobackPg != ""){
				moveOkHistory(gobackPg);
				gobackPg = "";
			}
		}else{
			history.go(-1);   //앞으로
		}

	}



	function exitApp(){
		//app exit
		navigator.app.exitApp();
	}




	function lodinggo(){
	    $.mobile.loading( "show", {
	        text: "Loading...",
	        textVisible: true,
	        theme: "none",
	        textonly: false,
	        html: "<div style='width:80%; margin:0 10%; text-align:center; border-radius:15px; padding:1px 0;'><img src='./images/loading2.gif' width='50px'></div>"
	    });

		//console.log("====lodinggo()++++");
	}






	function datepick(obj){
		obj.datepicker({
			         inline: true,
			              dateFormat: "yy-mm-dd",    /* 날짜 포맷 */
			              prevText: 'prev',
			              nextText: 'next',
			              showButtonPanel: true,    /* 버튼 패널 사용 */
			              changeMonth: true,        /* 월 선택박스 사용 */
			              changeYear: true,        /* 년 선택박스 사용 */
			             showOtherMonths: true,    /* 이전/다음 달 일수 보이기 */
			             selectOtherMonths: true,    /* 이전/다음 달 일 선택하기 */
			             showOn: "button",
			             buttonImage: "img/calendar03.gif",
			             buttonImageOnly: true,
			             minDate: '-30y',
			             closeText: '닫기',
			             currentText: '오늘',
			             showMonthAfterYear: true,        /* 년과 달의 위치 바꾸기 */
			             /* 한글화 */
			             monthNames : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			             monthNamesShort : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			             dayNames : ['일', '월', '화', '수', '목', '금', '토'],
			             dayNamesShort : ['일', '월', '화', '수', '목', '금', '토'],
			             dayNamesMin : ['일', '월', '화', '수', '목', '금', '토'],
			             showAnim: 'slideDown',
			             /* 날짜 유효성 체크 */
			             onClose: function( selectedDate ) {
			                 obj.datepicker("option","minDate", selectedDate);
			             }
			         });


	}


	//back button 클릭
	function onBackKeyDown() {
		//alert("bb");

		if(pushBack){   //푸쉬에서 넘어온 경우
			pushBack = false;
			goHome();
		}else{
			moveBack();
		}

	}



/**
 * onNotificationAPN
 *
 * @param event
 *
 * iOS 디바이스로 푸시 메세지를 받을 때 호출되는 콜백함수, window.plugins.pushNotification.register 옵션 설정에서 ecb의 이름에 매칭된다.
 *ios-------------------------/
function onNotificationAPN (event){
  // 푸시 메세지에 alert 값이 있을 경우
  if (event.alert){
    navigator.notification.alert(event.alert);
  }

  // 푸시 메세지에 sound 값이 있을 경우

  // 푸시 메세지에 bage 값이 있을 경우
  if (event.badge){
    window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }
}

----------------------------------/**
 * onNotificationGCM
 *
 * @param e
 *
 * 안드로이드 디바이스로 푸시 메세지를 받을 때 호출되는 함수, window.plugins.pushNotification.register 옵션에 설정에서 ecb의 이름에 매칭된다.
 */
//regId를 반환받아서 서버에 저장 한다.
function onNotificationGCM (e){

  switch (e.event) {
  case 'musicBar':

    switch(e.rtGab){
    case "play":
        mPlayer.musicPlayInf = "play";
    /*
            mPlayer.songTit = tit;
            mPlayer.gasu = gasu;
            mPlayer.preFix = prefix;
            mPlayer.songLink = imsi;
    */
        $("#"+mPlayer.songId).html("pause_circle_outline").css({"color":"green"});
        $("#musicTit").html(mPlayer.songTit+"<br/><span class='sotxt'>"+mPlayer.gasu+" "+mPlayer.preFix+"</span>");
        $("#playButtonSpan").html('<i class="material-icons">pause_circle_outline</i>');
    break;
    case "pause":
        mPlayer.musicPlayInf = "pause";

        $("#"+mPlayer.songId).html("play_circle_outline").css({"color":"#c51162"});
        $("#musicTit").html(mPlayer.songTit+"<br/><span class='sotxt'>"+mPlayer.gasu+" "+mPlayer.preFix+"</span>");
        $("#playButtonSpan").html('<i class="material-icons">play_circle_outline</i>');

    break;
    case "stop":
        mPlayer.musicPlayInf = "stop";

        $("#"+mPlayer.songId).html("play_circle_outline").css({"color":"#c51162"});
        $("#musicTit").html(mPlayer.songTit+"<br/><span class='sotxt'>"+mPlayer.gasu+" "+mPlayer.preFix+"</span>");
        $("#playButtonSpan").html('<i class="material-icons">play_circle_outline</i>');
    break;
    }

  break;
  case 'registered': // 안드로이드 디바이스의 registerID를 획득하는 event 중 registerd 일 경우 호출된다.
    //regId를 반환 받는다.
  	//register 를 gcimid 에 저장 한다.
  	//alert(e.regid);

	//setPushDB(e.regid);


    break;
  case 'message': // 안드로이드 디바이스에 푸시 메세지가 오면 호출된다.
    {
      	if (e.foreground){ // 푸시 메세지가 왔을 때 앱이 실행되고 있을 경우
        	navigator.notification.beep(2);

            //appUtil.moveOkHistory("index.html#BoxSet");
            var pushMode = e.payload.pushMode;
            pushMessage = e.payload.pushMessage;

            //alert(pushMessage);

            //alert("mode 변환=="+pushMode);
            switch(pushMode){
            case "chnType":
                pageType = pushMessage;
                appBasInfo.pageChangeType();
            break;
            case "getSchedule":
                appBasInfo.getSchedule();
            break;
            case "scheduleSend":
                //alert("kkkkkk"+pushMessage);
                pageType = pushMessage;

                appBasInfo.pageChangeType();
                //pageV1();


            break;
            }

      	} else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 실행되거나 실행되지 않을 경우

      	    //alert("000000");
      	    alert("push susin off=="+e.payload.defaults);

      		//푸시가 오는 당시에 앱이 종료 상태 이면 앱이 실행 되는 순간 아래 부분이 실행 된다.
        	if (e.coldstart) { // 푸시 메세지가 왔을 때 푸시를 선택하여 앱이 열렸을 경우
          		console.log("알림 왔을 때 앱이 열리고 난 다음에 실행 될때");

                //alert("11111");

          		//pushViewGo();

        	} else { // 푸시 메세지가 왔을 때 앱이 백그라운드로 사용되고 있을 경우
          		console.log("앱이 백그라운드로 실행될 때");

                //alert("2222");

          		//pushViewGo();

        	}
      	}

    }
    break;
  case 'error': // 푸시 메세지 처리에 에러가 발생하면 호출한다.
    alert('error:' + e.payload.message);
    break;
  case 'default':
    alert('알수 없는 이벤트');
    break;
  }
}




//앱을 푸시 DB에 등록 한다
function setPushDB(regid){

    //alert(PROJE);
    //runAjax("mu", "mode=gcmidinput&regid="+regid+"&proje="+PROJE+"&phonenum=device&udid="+appBasInfo.deviceUiu+"&memid=device");  //서버에서 post 모드로 가져온다.

}


//푸시 확인전 딜레이 타임
function pushDlayTime(md, jdid, tit, evid, comid){

	pushBack = true;
	pushCall = false;
	if(window.sessionStorage.getItem("pushGet") == "get"){
		//푸시에서
		pushCall = true;
	}else{
		window.sessionStorage.setItem("pushRecid", "0");
	}


	console.log("pushDlayTime md="+md);


	if(md == "jd"){   //전단을 열어서 보여준다.
		//jdView(jdid, disp_smstext(tit,0), 3);
	}else if(md == "ev"){

		//이벤트한개를 보여 준다.
		//goSangse(evid, 0, comid, "0", 2, 2);

	}else{
		Vgongji = window.sessionStorage.getItem("pushRecid");
		moveOkHistory("AAGongList.html");
	}

	window.sessionStorage.setItem("pushGet", null);

}




//푸시창에서 보기 클릭한 경우
function pushViewGo(){
	//pushMd = e.payload.plink;  //ev:event, jd:전단 , ps:일반 푸시
	//pushRecid = e.payload.notId;   //공지사항의 레코드 아이디
	//pushImg = e.payload.img;  //푸시 이미지
	/*
	switch(pushMd){
	case "jd":   //전단


		break;
	case "ev":   //이벤트

		break;
	case "ps":   //기타 푸시


		break;
	}

	window.sessionStorage.setItem("recnum", pushRecid);

	var qr = LK+"gcmSend.php";
	var param = "toid=getjdId&gjid="+pushRecid;
	//alert(param);
	$.ajax({type:"GET", data:input_smstext(param,0), url:qr, timeout:7000, dataType:"json",success:function(data){
		if(data.rs == "err"){
			return false;
		}else{

			pushDlayTime(data.md, data.jdid, data.tit, data.evid, data.comid);


		}
	},error:function(xhr,status,error){
		alert(error);
	}});
	*/


	moveOkHistory("PushAll.html");




}
