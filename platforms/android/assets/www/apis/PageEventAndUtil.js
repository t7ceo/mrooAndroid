//page GET 이벤트=======================
var tabInfo = {

    mainTab:1,
    tabDispDomText:["", "#bodyContent1", "#bodyContent2", "#bodyContent3", "#bodyContent4", "#bodyContent5"],
    tabDispDomTextNotShap:["", "bodyContent1", "bodyContent2", "bodyContent3", "bodyContent4", "bodyContent5"],
    mainTabName:["","TOP", "NEW", "주문제작", "MY", "CLUB"],
    mainTabObj:["", "mainPage", "newPage", "Jumun", "myPage", "clubPage"],

    dispTabBtn:function(){
         $(".tabLi1, .tabLi2, .tabLi3, .tabLi4, .tabLi5").css({"color":"black", "font-weight":"normal"});
         $(".tabLi1 span, .tabLi2 span, .tabLi3 span, .tabLi4 span, .tabLi5 span").css({"color":"white", "font-weight":"normal"});
         $(".tabLi"+this.mainTab).css({"color":"#f50057", "font-weight":"bold"});
         $(".tabLi"+this.mainTab+" span").css({"color":"#f50057", "font-weight":"bold"});
    }

}

var proPage = {
	
	pageId:"mainPage",
    pageH:0,
    tabInf:1,   //1:탭에서 호출, 2:메뉴에서 호출
    nowListId:"0",
    //slickObj:{},
    allBgColor:"#f4f4f4",
    topBgColor:"#fff",
    topFontColor:"#f50057",
    topFontSize:"1.3em",
    topMainFontSize:"1.6em",
    normalLine:"#a9a9a9",
    bottomMusicBarBgColor:"#c51162",
	popW:300,
	contetnMarginTopTab:"98px",
	contetnMarginTopMenu:"50px",
	urlHistory:{},


    tabDispInf:function(inf){

        if(inf){
            $("#contentBody").css({"margin":this.contetnMarginTopTab+" 0 0"});

            $("#mainTabArea").show();
            $("#mainSliderArea").show();

            $("#mainContent").hide();
        }else{
            $("#contentBody").css({"margin":this.contetnMarginTopMenu+" 0 0"});

            $("#mainTabArea").hide();
            $("#mainSliderArea").hide();

            $("#mainContent").show();
        }

    },


    pageInit:function(){
        //앱이 실행될때 가장 먼저 한번 처리

        /*page css==============*/
        $("#Fpage").css({"background-color":this.allBgColor, "margin":"0", "padding":"0"});
        $("ul.mainMogCha").css({"background-color":this.topBgColor});
        $("ul.mainMogCha li.mogcha a, ul.mainMogCha li.sideLi a").css({"width":"100%"});
        $("ul.mainMogCha li.mogcha a span, ul.mainMogCha li.sideLi a span").css({"color":this.topFontColor, "font-size":this.topFontSize});
        $("#mainHeadTit").css({"color":this.topFontColor, "font-weight":"bold", "font-size":this.topMainFontSize});

        //$("#top100Page li").css({"border-bottom":"red"}); //this.normalLine);


        $(".musicPlayBarDiv").css({"background-color":this.bottomMusicBarBgColor, "text-align":"center"});
        $(".musicPlayBarDiv table").css({"width":"100%"});



        /*패널 css==============*/
        $(".ui-panel").css({
            "width": "100%",
            "background-color":this.allBgColor,
            "padding":"0"
        });
        $(".ui-panel-position-left").css({"left":"0"});

        $(".ui-panel-inner").css({
            "width": "100%",
            "padding":"0",
            "margin":"0",
            "border":"0"
        });

        $(".ui-panel ul").css({
            "width": "100%",
            "padding":"0",
            "margin":"0"
        });
        /*패널 css==============*/

    },

    getTabPage:function(){
        //슬라이드시 페이지를 호출 한다.
        eval("proPage.loadPage("+tabInfo.mainTabObj[tabInfo.mainTab]+")");
    },

	addUrl:function(){

		//alert("addUrl=="+this.pageId+"///"+this.getTabInf(this.pageId));
		if(this.getTabInf(this.pageId) == 1){  //탭메뉴인 경우
			this.urlHistory = [];
			this.urlHistory[0] = this.pageId;
		}else{   //탭메뉴가 아닌 경우
			this.urlHistory.push(this.pageId);
		}
		
	},
	

    getTabInf:function(objId){  //탭메뉴 여부 확인

        var rt = 2;
        for(var c = 1; c < tabInfo.mainTabObj.length; c++){
            if(objId == tabInfo.mainTabObj[c]){
                rt = 1;
                break;
            }
        }

        return rt;
    },

    //탭클릭시 처리
    tabClick:function(obj){ //탭을 강제로 클릭하는 경우

        obj.tabIndex = tabInfo.mainTab;
        tabInfo.dispTabBtn();

        //페이지로드한다.
        this.loadPage(obj);

        $(".lazy").slick('slickGoTo', (obj.tabIndex - 1), true);

    },

    defaultPageSet:function(){
            $("#Fpage").css({"background-color":"#fff", "margin":"0", "padding":"0"});
            $("#pageHeader").css({"background-color":"#fff"});
            $("ul.mainMogCha").css({"background-color":"#fff"});
            $("ul.mainMogCha li a").css({"display":"block"});
            $("#mainTabArea").css({"display":"block"});
            $("#contentBody").css({"background-color":"#fff"});
            $("#thinkFoot").css({"display":"none"});
            $("#addTopMenu, .musicPlayBarDiv").css({"display":"block"});
            $("#appHeaderImg").css({"width":"96%", "margin":"5px 2% 6px"}).hide();
    },

    setPageStyle:function(){

        if(thinkSys.intVg) clearInterval(thinkSys.intVg);
        if(thinkSys.dispIntV) clearInterval(thinkSys.dispIntV);

        switch(this.pageId){
        case "gasathinkPlay":

            $("#Fpage").css({"background-color":"#009688", "margin":"0", "padding":"0"});
            $("#pageHeader").css({"background-color":"#009688"});
            $("ul.mainMogCha").css({"background-color":"#009688"});
            $("ul.mainMogCha li a").css({"display":"none"});
            $("#mainTabArea").css({"display":"none"});
            $("#contentBody").css({"background-color":"#009688"});
            $("#thinkFoot").css({"display":"block"});
            $("#addTopMenu, #addMenuMain, .musicPlayBarDiv").css({"display":"none"});
            $("#appHeaderImg").css({"width":"96%", "margin":"5px 2% 6px"}).show();
            //$("#gasathinkPro").css({"width":"90%", "margin":"10px 6%", "background-color":"#00675b"})

        break;
        case "gasathinkPro":

            this.defaultPageSet();
            $("#mainTabArea").css({"display":"none"});
            $(".musicPlayBarDiv").css({"display":"none"});

        break;
        case "gasathink":

            this.defaultPageSet();
            $("#mainTabArea").css({"display":"none"});
            $(".musicPlayBarDiv").css({"display":"none"});

        break;
        default:

            this.defaultPageSet();

        break;
        }

    },

	loadPage:function(obj){   //obj를 이용하여 페이지 호출 inf:1(탭에서 로드), inf:2(메뉴에서 로드)

	    appUtil.closePannel();
        this.tabInf = this.getTabInf(obj.objId);
        //alert("loadPage==="+obj.objId+"///"+this.tabInf);

        $("#mainHeadTit").html(obj.tit);
        //$("#addMenuMain").hide();
        if(this.tabInf == 1){    //탭에서 로드
            this.tabDispInf(true);

            $(".musicBarR").show();
            //$(".contentLoading").show();
            $(tabInfo.tabDispDomText[tabInfo.mainTab]).html("");

            this.popW = appBasInfo.screenW;
            $("#gasaPop").css({"width":(this.popW * 0.9)+"px","margin":"10px 0 50px "+(this.popW * 0.01)+"px", "padding":"0", "height":"450px"});
            $("#dispGasaTxt").css({"height":"346px", "overflow-y":"scroll", "font-size":"1.2em"});



            $("#addMenu").hide();
            $("#addMenu ul, #addMenu div").hide();

            $("#addTopMenu").hide();
            $("#addTopMenu ul, #addTopMenu div").hide();

            $(tabInfo.tabDispDomText[tabInfo.mainTab]).load(obj.link);

            //초기설정하고 자료를 가져온다.
            obj.initgo();
        }else{   //메뉴에서 로드

            this.tabDispInf(false);
            $("#mainContent").load(obj.link);

            //초기설정하고 자료를 가져온다.
            obj.initgo();
        }

	},

	getPageMainTab:function(){

        this.mainTabJoinPage(tabInfo.mainTab);

	},

    mainTabJoinPage:function(inx){

        tabInfo.mainTab = inx;
        myPlug.scrollTop = 0;  //메인타이틀 영역을 보이게 한다.
        myPlug.mainTitle();

        eval("this.tabClick("+tabInfo.mainTabObj[inx]+")");

    },

	playBanner:function(obj){
		obj.playBanner();
	},

}



var myPage = {
		tit:"MROO", //"MY",
		link:"./jumun.html",
		objId:"myPage",
		tabIndex:0,
		listDataDom:".allJumunList",

		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();

			proPage.setPageStyle();


			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, ".allJumunList", "mode=getAllJumun");  //서버에서 post 모드로 가져온다.

		},

		getData:function(data){

            var ss = "";
            for(var c=0; c < data.length; c++){
                var inx = data[c].id;

                ss += "<li class='allMusic' id='"+inx+"' onclick='music1cha.allMusicPlay(this)'>1차-";


                ss += data[c].name;
                ss += "<span class='titMemo'> - "+data[c].email+"</span>";

                ss += "<img src='images/downC.png' id='downupImg"+inx+"' class='downC'>";

                ss += "</li>";
                ss += "<li id='"+inx+"li2' class='basGenLi'></li>";
            }

            $(this.listDataDom).html(ss);

		},

}

var clubPage = {
		tit:"MROO", //"CLUB",
		link:"./jumun.html",
        objId:"clubPage",
        tabIndex:0,

		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();
            proPage.setPageStyle();


			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, ".allJumunList", "mode=getAllJumun");  //서버에서 post 모드로 가져온다.

		},
}

var Jumun = {
		tit:"주문제작", //"주문제작 Info",
		link:"./jumun.html",
		objId:"Jumun",
		tabIndex:0,
		listDataDom:".allJumunList",


		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();
            proPage.setPageStyle();
			
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, ".allJumunList", "mode=getAllJumun");  //서버에서 post 모드로 가져온다.
			
		},

		getData:function(data){

            var ss = "";
            for(var c=0; c < data.length; c++){
                var inx = data[c].id;

                ss += "<li class='allMusic' id='"+inx+"' onclick='music1cha.allMusicPlay(this)'>1차-";


                ss += data[c].name;
                ss += "<span class='titMemo'> - "+data[c].email+"</span>";

                ss += "<img src='images/downC.png' id='downupImg"+inx+"' class='downC'>";

                ss += "</li>";
                ss += "<li id='"+inx+"li2' class='basGenLi'></li>";
            }

            $(this.listDataDom).html(ss);

		},
}



var myalbumPage = {
		tit:"내 앨범",
		link:"./myalbum.html",
		objId:"myalbumPage",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},
}

var jumunListPage = {
		tit:"주문내역", //"최신 MR",
		link:"./jumunList.html",
		objId:"jumunListPage",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},
}

var recListPage = {
		tit:"MROO", //"최신 MR",
		link:"./recList.html",
		objId:"recListPage",
		tabIndex:0,


		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();

			//녹음 리스트를 가져온다.
			getServ = new GetServer();
            getServ.fileList("mrro/voice", "allRecVoice");


		},
}

var cuponbuyPage = {

		tit:"이용권 구매", //"최신 MR",
		link:"./cuponbuy.html",
		objId:"cuponbuyPage",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},

}

var setupPage = {
		tit:"설정",
		link:"./setup.html",
		objId:"setupPage",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},

}

var gasathink = {
		tit:"가사싱크 생성",
		link:"./gasathink.html",
		objId:"gasathink",
		tabIndex:0,

		initgo:function(){

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


			music1cha.openInf = false;
			music1cha.oldId = null;

            var getServ = new GetServer();
			getServ.initParam("getMrAll.php", "mode=allMusic5", "gasathink");
			getServ.getPostMode();
			proPage.setPageStyle();

		},

}

var gasathinkPro = {
		tit:"가사싱크 제작",
		link:"./gasathinkPro.html",
		objId:"gasathinkPro",
		tabIndex:0,

		initgo:function(){

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


            thinkSys.thinkArray = [];
            thinkSys.thinkIndex = 0;
            thinkSys.playInf = false;
            thinkSys.crTime = 0;
            thinkSys.mSend = 0;
            localSys.thinkFileWrInf = false;
            thinkSys.gasaThinkGab = 56;   //싱크 올리는 수치값
            thinkSys.scrollPo = 0;



			music1cha.openInf = false;
			music1cha.oldId = null;


            //가사를 가져온다.
            var getServ = new GetServer();
			getServ.initParam("getMrAll.php", "mode=getGasa&basid="+mPlayer.basid, "getGasa");
			getServ.getPostMode();

		},

}

var gasathinkPlay = {
		tit:"<img src='./images/thinkTitLog.png' style='width:70%;'>",
		link:"./gasathinkPlay.html",
		objId:"gasathinkPlay",
		tabIndex:0,

		initgo:function(){




            $("#gasathinkPro0 ul li#titGab").html(mPlayer.songTit);
            $("#gasathinkPro0 ul li#gasuGab").html(mPlayer.gasu);




			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();

            thinkSys.thinkIndex = 0;
            thinkSys.playInf = false;
            thinkSys.crTime = 0;
            thinkSys.mSend = 0;
			thinkSys.gasaThinkGab = 56;   //싱크 올리는 수치값



			music1cha.openInf = false;
			music1cha.oldId = null;

            //alert(mPlayer.basid);

            //가사를 가져온다.
            var getServ = new GetServer();
			getServ.initParam("getMrAll.php", "mode=getGasa&basid="+mPlayer.basid, "getGasa");
			getServ.getPostMode();

		},

}


var downMp3Page = {
		tit:"다운로드 내역",
		link:"./downMp3.html",
		objId:"downMp3Page",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},

}

var myJarangPage = {
		tit:"나의 노래자랑",
		link:"./myJarang.html",
        objId:"myJarangPage",
        tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},

}


var loginPage = {
		tit:"LOGIN", //"Login",
		link:"./Login.html",
		objId:"loginPage",
		tabIndex:0,

		initgo:function(){

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();





			frmPro.forminputInit("loginForm");


		},
}


var findMemPage = {
		tit:"비번찾기", //"Login",
		link:"./FindMem.html",
		objId:"findMemPage",
		tabIndex:0,

		initgo:function(){

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();




		},
}


var joinPage = {
		tit:"회원가입", //"Login",
		link:"./join.html",
		objId:"joinPage",
		tabIndex:0,

		initgo:function(){

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


		},
}


var gongjiPage = {
		tit:"공지사항",
		link:"./gongji.html",
		objId:"gongjiPage",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();
			
			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();

			
            getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "allGongjiList", "mode=getAllGongji");  //서버에서 post 모드로 가져온다.
			
		},
}

var newPage = {
		tit:"MROO", //"최신 MR",
		link:"./newMr.html",
        objId:"newPage",
        tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


			music1cha.openInf = false;
			music1cha.oldId = null;

            var getServ = new GetServer();
			getServ.initParam("getMrAll.php", "mode=allMusic5", "allMusic5");
			getServ.getPostMode();


		},
}



var mainPage = {
    //첫페이지
	tit:"MROO", //"<img src='./images/homeicon.png' style='width:10%;'>",
	link:"./pageF.html",
	objId:"mainPage",
	tabIndex:0,

	initgo:function(){
	    
		proPage.pageId = this.objId;
		proPage.addUrl();
		proPage.setPageStyle();
		
		//lngTxt = naraNew.chanenara(1);  //국가언어 선택


		appBasInfo.fnName = "case page:";
		
		this.deviceCo = window.sessionStorage.getItem("cosa");
		
		getServ = new GetServer();
		getServ.initParam("getMrAll.php", "mode=allMusic5", "top100Page");
		getServ.getPostMode();
		
		
	},
	
	playBanner:function(){
		
		var slimgww = (appBasInfo.screenW * 0.8);
		var sideWw = (appBasInfo.screenW * 0.1);
	
		if(proPage.pageId == "mainPage"){
			
			document.getElementById("sliderT_container").style.width = appBasInfo.screenW+"px";
			document.getElementById("sliderT_container").style.height = parseInt(appBasInfo.screenW * 0.28999)+"px";
			
			document.getElementById("sliderTt_container").style.width = appBasInfo.screenW+"px";
			document.getElementById("sliderTt_container").style.height = (appBasInfo.screenW * 0.28999)+"px";


	                       var options = {
	                           $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
	                           $AutoPlaySteps: 1,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
	                           $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
	                           $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

	                           $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
	                           $SlideDuration: 500,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
	                           $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
	                           //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
	                           //$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
	                           $SlideSpacing: 0, 					                //[Optional] Space between each slide in pixels, default value is 0
	                           $DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
	                           $ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
	                           $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
	                           $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
	                           $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)


	                           $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
	                               $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
	                               $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
	                               $AutoCenter: 0,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
	                               $Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
	                               $Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
	                               $SpacingX: 10,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
	                               $SpacingY: 10,                                   //[Optional] Vertical space between each item in pixel, default value is 0
	                               $Orientation: 1                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
	                           },

	                           $ArrowNavigatorOptions: {
	                               $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
	                               $ChanceToShow: 1,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
	                               $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
	                               $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
	                           }
	                       };
	                       var jssor_sliderT = new $JssorSlider$("sliderT_container", options);
	                       
	                       
	                       
	                       //responsive code begin
	                       //you can remove responsive code if you don't want the slider scales while window resizes
	                       function ScaleSliderT() {
	                           var parentWidth = jssor_sliderT.$Elmt.parentNode.clientWidth;
	                           if (parentWidth)
	                               jssor_sliderT.$ScaleWidth(Math.min(parentWidth, appBasInfo.screenW));
	                           else{
	                               //window.setTimeout(ScaleSlider, 30);
	                           }
	                       }
	                       
	                       
	                       ScaleSliderT();
	                       
	                       
					//상부 배너 영역 끝===========================================================================================		
	                       
						
	               		var options = {
	               	        $AutoPlay: false,
	               	
	               	        $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slideshow is auto playing, default value is false
	               	
	               	        $ArrowKeyNavigation: false,   			            //Allows arrow key to navigate or not
	               	        $SlideWidth: slimgww,                                   //[Optional] Width of every slide in pixels, the default is width of 'slides' container
	               	        //$SlideHeight: 300,                                  //[Optional] Height of every slide in pixels, the default is width of 'slides' container
	               	        $SlideSpacing: 5, 					                //Space between each slide in pixels
	               	        $DisplayPieces: 2,                                  //Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
	               	        $ParkingPosition: sideWw,                                //The offset position to park slide (this options applys only when slideshow disabled).
	               	
	               	        $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
	               	            $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
	               	            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
	               	            $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
	               	            $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
	               	        }
	               	    };
	               	
               	    	
		}
		
	},
	
}


var PassChange = {
		tit:"MROO", //"비밀번호 변경",
		link:"./PassChange.html",
		objId:"PassChange",
		tabIndex:0,

		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();
		},
}

var AlramSet = {
		tit:"MROO", //"시스템 설정",
		link:"./AlramSet.html",
		objId:"AlramSet",
		tabIndex:0,

		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();

			frmPro.forminputInit("changePass");



		},
}

var FindMem = {
		tit:"MROO", //"아이디 / 비번찾기",
		link:"./FindMem.html",
		objId:"FindMem",
		tabIndex:0,

		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();

		},
}



var Question = {
		tit:"MROO", //"간단문의",
		link:"./question.html",
		objId:"Question",
		tabIndex:0,

		initgo:function(){
			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();



			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, ".allJumunList", "mode=getAllJumun");  //서버에서 post 모드로 가져온다.

		},
}


var miriplay = {
		tit:"MROO", //"Top 100",
		link:"./miriplay.html",
		objId:"miriplay",
		tabIndex:0,

		initgo:function(){
			//$("#addMenu").show();
			//$("#addMenu ul.musicControl").show();

			proPage.pageId = this.objId;
			proPage.addUrl();
			proPage.setPageStyle();


			var hh = $(window).height();

			music1cha.openInf = false;
			music1cha.oldId = null;


			getServ = new GetServer();
			getServ.initParam("getMrAll.php", "mode=allMusic", "allMusic");
			getServ.getPostMode();

		},
}





//click 이벤트 ======================
var evClick = {
    oldLi:"0",		
    mLink:"",
    MusicUrl:"",
    GasaUrl:"",
    mSid:"",
    vJumunList:"",
    sendGab:"",

	joinOk:function(){

        //var el = frmPro.forminput("joinOkForm");
        //alert(el);
        //return;

		//alert(meminf.reEmailInf+"//"+meminf.reEmail);
		if(!meminf.reEmailInf || meminf.reEmail != $("#emailJ").val()){
			appUtil.alertgo(lngTxt.alerttit, lngTxt.reEmailGoInf);
			return false;
		}else{

			var el = frmPro.forminput("joinOkForm");

			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=join&"+el);  //서버에서 post 모드로 가져온다.
			}

			return false;
		}

		return false;
	},

    jrPlay:function(){
    	
    	audiogo.play();

    },
    
    myRecPlay:function(mlink){
    	
    	document.getElementById("audioPly").src = UPVOICE+mlink;
    	document.getElementById("audioPly").play();
    	
    },
    
    LikeOn:function(){
    	//alert(meminf.email);
		var ll = new GetServer();
		//서버에서 선택한 사업의 대상자를 가져온다.
		ll.basServer(ll, "mu", "mode=likeOn&jid="+appBasInfo.seJarangRid+"&email="+window.localStorage.getItem("email"));  //서버에서 post 모드로 가져온다.
    	
    },
    
    findReEmail:function(){
	
	    var em = $("#emailJ").val();
	    if(!em){
		
		    appUtil.alertgo(lngTxt.alerttit, lngTxt.reEmailErr);
		    document.getElementById("emailJ").focus();
		
	    }else{
		    var gs1 = new GetServer();
		    //서버에서 선택한 사업의 대상자를 가져온다.
		    gs1.basServer(gs1, "mu", "mode=findReEmail&email="+em);  //서버에서 post 모드로 가져온다.	
	    }
	
    },
    
    albumPlay:function(mlink){
    	
    	this.mLink = MUSIC+mlink;
    	
    	document.getElementById("audioPly").src = this.mLink;
    	document.getElementById("audioPly").play();
    	
    },
        
    seAlbum:function(obj){
    	
    	//선택한 앨범에 노래를 등록한다.
		var gs1 = new GetServer();
		//서버에서 선택한 사업의 대상자를 가져온다.
		gs1.basServer(gs1, "mu", "mode=seAlbumSet&sid="+this.sendGab+"&alid="+obj.id+"&email="+meminf.email);  //서버에서 post 모드로 가져온다.				
    	
    },
    
    albumOnput:function(){
    	
		var el = frmPro.forminput("gumeMpForm");
		if(!el){
			alert("노래를 선택하세요.");
		}else{
			this.sendGab = el;
			$("#popupMenu").popup("open");
		}
		    	
    },
    
    playMpDown:function(link){
    	document.getElementById("audioPlyGume").src = MUSIC+link;
    	document.getElementById("audioPlyGume").play();
    	
    },
    
    albumEdit:function(aid, inx){
    	
		getServ = new GetServer();
		//서버에서 선택한 사업의 대상자를 가져온다.
		getServ.basServer(getServ, "albumAll", "mode=albumEdit&did="+aid+"&tit="+$("#albumTit"+inx).val());  //서버에서 post 모드로 가져온다.
    	
    },
    
    albumDel:function(aid){
    	
		getServ = new GetServer();
		//서버에서 선택한 사업의 대상자를 가져온다.
		getServ.basServer(getServ, "albumAll", "mode=albumDel&did="+aid);  //서버에서 post 모드로 가져온다.
    	
    },
    
    noUserMsg:function(md){
    	var tt = "";
    	switch(md){
    	case 1:  //사용전
    		tt = lngTxt.noUserSet;
    		break;
    	case 3:    //모두 사용
    		tt = lngTxt.userAll;
    		break;
    	case 4:   //유효기간 경과
    		tt = lngTxt.endDayUser;
    		break;
    	}
    	appUtil.alertgo(lngTxt.alerttit, tt);
    },
    
    cpUser:function(cid){
    	
		var gs1 = new GetServer();
		//서버에서 선택한 사업의 대상자를 가져온다.
		gs1.basServer(gs1, "mu", "mode=cuponUser&email="+meminf.email+"&cid="+cid);  //서버에서 post 모드로 가져온다.				
    },
    
    mp3Down:function(obj, cuponid){
    	//console.log("mp#Down=="+obj.id+"/ "+downMp.downSu);
    	if(downMp.downSu > 0){
    		downMp.cuponid = cuponid;
    		var el = frmPro.forminput("mp3downform");
    		if(frmPro.formInf){
    			//var aa = downMp.songid;
    		    //alert("====/"+downMp.songid[0]);
    		    music1cha.mp3Down();
    			//var gs1 = new GetServer();
    			//서버에서 선택한 사업의 대상자를 가져온다.
    			//gs1.basServer(gs1, "mu", "mode=munOnput&email="+window.localStorage.getItem("email")+"&"+el);  //서버에서 post 모드로 가져온다.				
    		}
    	}else{
    		appUtil.alertgo(lngTxt.alerttit, lngTxt.downSeHe);
    	}
    	
		return false;
    	
    },
    
    logout:function(){
    	
		meminf.email = "";
		meminf.memName = "";
		meminf.memNicName = "";
		meminf.loginStat = false;
		
		window.localStorage.setItem("login", "no");
		window.localStorage.setItem("email", "0");
		window.localStorage.setItem("pass", "0");

		leftMenu.insertLeftMnu();
		proPage.loadPage(mainPage);

    },
    
    login:function(data){

		meminf.memName = data.name;
		meminf.memNicName = data.nicname;

        //alert(data.nicname);

		//$("#memNicName").html(data.nicname);
		//$("#memEmail").html(data.email);


    	window.localStorage.setItem("email", data.email);
    	
		meminf.email = window.localStorage.getItem("email");
		meminf.loginStat = true;
		
		
		window.localStorage.setItem("login", "ok");
		window.localStorage.setItem("pass", data.passwd);

        leftMenu.insertLeftMnu();
		proPage.loadPage(mainPage);
    	
    },
    
    
    gumeListV:function(obj){
    	
    	$("ul.jumunListUl li table").css({"display":"none"});
    	$("ul.jumunListUl li div img").attr("src", "./images/downC.png");
    	
    	if(this.vJumunList != obj.id){
    		this.vJumunList = obj.id;
        	$("ul li#"+obj.id+" table").css("display", "block");
        	$("ul li#"+obj.id+" div img").attr("src", "./images/upC.png");
        	$("ul li#"+obj.id+" table").css("width", "100%");    		
    	}else{
    		this.vJumunList = "";
    	}
    	
    },
    
    jumunListV:function(obj){
    	
    	$("ul.jumunListUl li table").css({"display":"none"});
    	$("ul.jumunListUl li div img").attr("src", "./images/downC.png");
    	
    	if(this.vJumunList != obj.id){
    		this.vJumunList = obj.id;
        	$("ul li#"+obj.id+" table").css("display", "block");
        	$("ul li#"+obj.id+" div img").attr("src", "./images/upC.png");
        	$("ul li#"+obj.id+" table").css("width", "100%");    		
    	}else{
    		this.vJumunList = "";
    	}
    	
    },
    
	pageModePro:function(){   //등록수정구분처리
		
		switch(appBasInfo.nowPage){
		case "Question":
		
		    if(appBasInfo.pageMode == "on"){
		    	//등록모드 이다.
		    	$("#qutTit").html(lngTxt.munTit);
		    	
		    	$("#munBtn").html(lngTxt.munOnBtn);
		    	$("#idmd").val("on");
		    	$("#idgab").val("0");

		    	
		    }else{
		    	//수정모드이다.
		    	$("#qutTit").html(lngTxt.munEdit);
		    	
		    	$("#munBtn").html(lngTxt.munEditBtn);
		    	$("#idmd").val("edit");
		    	$("#idgab").val(1); //meminf.viewId);
		    	
		    	
		    	//문의 내용을 가져온다.
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", {mode:"joinedit", email:meminf.email});  //서버에서 post 모드로 가져온다.	
				
		    }
			
			break;
		case "Join":
			
		    if(appBasInfo.pageMode == "on"){
		    	$("#joinPageTit").html(lngTxt.memjoin);
		    	
		    	$("#joinOk").html(lngTxt.joinbtn);
		    	$("#idmdJ").val("on");
		    	$("#idgabJ").val("0");
		    	
		    	$("#passChanTr").hide();
		    	
		    }else{
		    	$("#joinPageTit").html(lngTxt.mypage);
		    	meminf.email = window.localStorage.getItem("email");
		    	
		    	$("#passTr1").hide();
		    	$("#passTr1 td input").hide();
		    	$("#passTr2").hide();
		    	$("#passTr2 td input").hide();
		    	$("#passTr3").hide();
		    	
		    	
		    	$("#joinOk").html(lngTxt.joineditbtn);
		    	$("#idmdJ").val("edit");
		    	$("#idgabJ").val(meminf.email);
		    	
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", {mode:"joinedit", email:meminf.email});  //서버에서 post 모드로 가져온다.	
				
		    }
			
			break;
		}
		
	},
    
    //음악플레이를 클릭했다.
    musicPlayGo:function(slink, sid){

    	
    	document.getElementById("audioPly").src = "";  //초기화
    	
    	
    	
    	this.mLink = slink;
    	this.mSid = sid;
    	
    	var slink0 = slink.replaceAll("../music/", "");
    	var bb = slink0.split("-");
    	this.GasaUrl = MUSIC+bb[0]+"_gasa.txt";
    	
    	this.MusicUrl = MUSIC+slink0;
    	
    	
    	evClick.voiceRec();
    	
    	
    },
    
	songOnePlay:function(sid, obj){
		
		
		if(this.oldLi != "0") document.getElementById(this.oldLi).style.backgroundColor = "#fff";
		
		document.getElementById(obj.id).style.backgroundColor = "#dedede";
		
		document.getElementById("audioPly").src = sid;
		
		document.getElementById("audioPly").play();
		
		this.oldLi = obj.id;
	
	},	
	
	
	basSongOnePlay:function(sid, tit, gasu, gasa, obj){
		
		$("#songTitSp").html(tit);
		$("#songGasuSp").html(gasu);
		$("#dispGasaTxt").html(disp_smstext(gasa,0));
		
		if(this.oldLi != "0") document.getElementById(this.oldLi).style.backgroundColor = "#fff";
		
		document.getElementById(obj.id).style.backgroundColor = "#dedede";


		document.getElementById("audioPly").src = sid;
		
		document.getElementById("audioPly").play();
		
		this.oldLi = obj.id;
	
	},	
	
	
		
	touchTopBn:function(obj, md){
		
		alert("배너 링크 작업 중입니다.");
		
		
	},

	myVoicePlay:function(pid){
		//녹음play
		var pp = document.getElementById("audioPlyR1");
		//"file:///storage/emulated/0/mrro/1se617-382ad10.mp3"; //localPo+pid;
		
		var file2 = localPo+pid;
		//"file:///sdcard0/mrro/voice/"+pid;  //     file:///storage/emulated/0/mrro/voice/"		
		pp.src = file2;
		
		setTimeout(function(){
			pp.play();
		},500);
		
	},		

	
	voicePlay:function(pid){
		//녹음play
		var pp = document.getElementById("audioPlyR1");
		//"file:///storage/emulated/0/mrro/1se617-382ad10.mp3"; //localPo+pid;
		
		var file2 = localPo+pid;
		//"file:///sdcard0/mrro/voice/"+pid;  //     file:///storage/emulated/0/mrro/voice/"		
		pp.src = file2;
		
		setTimeout(function(){
			pp.play();
		},500);
		
	},		
	

	voiceDel:function(did){
		//alert(did);
		navigator.notification.confirm('삭제하시겠습니까?', function(button){
	    	if(button == 2){   //삭제취소한다.
	    		getServ.voiceDel(did);
	    	}
		}, '알림', '취소,삭제');
	},
		
	voiceRec:function(){


		/*
		directoryReader.readEntries(function(entries){
			var i;
			for(i=0; i<entries.length; i++){
				alert(entries[i].name);
			}
			
		},function(error){
			alert("error");
		});
        //*/
		
		var tt = appUtil.mkTime();
		//alert(tt);
		
		
		    appBasInfo.recordInf = true;
			window.voiceRec("gogo", function(echoValue) {
				//alert("rs="+echoValue);
				console.log("*****&&&&&&&&"+JSON.stringify(echoValue)); 
			 });
			
	},
		
	
		
    mainM:function(m){
    	
    	//메인 메뉴의 번호를 설정 한다.
    		appBasInfo.nowMainMenu = m;
    		switch(m){
    		case 1:
    			appUtil.moveOkHistory("miriplay.html");
    			break;
    		case 2:
    			Bridge.doSomething();
    			
    			break;
    		}


    },
		
}

var audiogo = {
	audioid:"",
	baslink:"",
	playing:false,
	fnam:"",
	allTime:0,
	nowTime:0,
	obj:null,
	
	init:function(domid, blink, fn, md){
		//초기화 
		
		this.audioid = domid;
		this.baslink = blink;
		this.fnam = fn;
		this.playing = false;
		
		if(md == "pro"){
			$(".playerbar").show();
			$(".playerbarFront").show();
			$(".playerbarFront").css({"width":"0%"});
		}else{
			$(".playerbar").hide();
			$(".playerbarFront").hide();			
		}
		this.playBtnStat();
		
	},
	
	playBtnStat:function(){
		//플레이 또는 종료버튼을 표시 
		
		if(this.playing){
			$("#playerbarPlay").hide();
			$("#playerbarStop").show();
		}else{
			$("#playerbarPlay").show();
			$("#playerbarStop").hide();
		}
		
	},
	
	play:function(){
		
		this.obj = document.getElementById(this.audioid);
		this.obj.src = this.baslink+this.fnam;
		
		this.setPo();
		
		this.obj.play();
		
		this.playing = true;  //현재 플레이 중이 아니다.
		this.playBtnStat();
		
	},
	
	setPo:function(){
		//프로그래스 바의 위치를 표시 
		
		if(this.nowTime == 100 || this.nowTime == 0){
			this.nowTime = 0;
			$(".playerbarFront").css({"width":this.nowTime+"%"});
			var x = document.getElementById(this.audioid);
			x.currentTime = this.nowTime;
		}else{
			
		}
		
		
	},
		
	audioend:function(obj){
		//정상적으로 음악 종료시 실행
		
		this.nowTime = 100;
		$(".playerbarFront").css({"width":this.nowTime+"%"});
		
		this.playing = false;
		this.playBtnStat();
		
	},
	
	stoped:function(obj){
		//음악종료시 실행
		//alert("stoped");
		
		this.playing = false;  //현재 플레이 중이 아니다.
		this.playBtnStat();
		
	},
	
	loadA:function(obj){
		//음악 로딩 완료시 실행 
		
		console.log("llllll"+obj.duration);
		this.allTime = appUtil.rtNumber(obj.duration);
		//alert(this.allTime);
	},
	
	chnTime:function(obj){
		//시간의 변화를 주기적으로 가져옴
		console.log("======"+obj.currentTime);
		this.nowTime = appUtil.rtNumber(obj.currentTime);
		
		var pp = appUtil.rtPercent(this.nowTime, this.allTime);
		$(".playerbarFront").css({"width":pp+"%"});

	},
	
	progo:function(obj){
	    //?????로딩 중 표시 
		//alert("kkkkk");
		console.log("+++++"+obj.currentTime);
		
	},
	
	onplaying:function(obj){
		//재생시작시 처음 한번 실행
		console.log("-----"+obj.currentTime);
		
	},
	
	
	stop:function(){
		//플레이 종료
		var x = document.getElementById(this.audioid);
		
		x.pause();
		
		//x.src="";
		
		this.playing = false;  //현재 플레이 중이 아니다.
		this.playBtnStat();
	}
	
	
	
		
}


var leftMenu = {

    loginInf:"no",
    bgColor:"kkkk",

    //왼쪽메뉴를 출력한다.
    insertLeftMnu:function(){

        //alert("kkkk");

        this.loginInf = window.localStorage.getItem("login");

        var pimgurl = "";
        var psize = "cover";


        var ss2 = "";


        ss2 = "<li class='menuTit'>"; //<div style='position:absolute; top:47px; left:82px; color:white;'></div>";
            ss2 += "<i class='material-icons' style='position:absolute; font-size:1.7em; top:12px; left:80%; color:white;' onclick='proPage.loadPage(setupPage)'>settings</i>";
            ss2 += "<i class='material-icons' style='position:absolute; font-size:1.7em; top:12px; left:90%; color:white;' onclick='appUtil.closePannel()'>close</i>";
        if(this.loginInf == "ok"){
            ss2 += "<img src='./images/leftTop.png' style='width:100px'>";
            ss2 += "<p id='memNicName' class='nicname'>미상</p><p id='memEmail' class='memEmail'>...@.......</p>";
        }else{
            ss2 += "<img src='./images/leftTop.png' style='width:100px'>";
            ss2 += "<p id='memNicName' class='nicname'>미상</p><p id='memEmail' class='memEmail'>....@......</p>";
        }
        ss2 += "</li>";


        if(this.loginInf == "ok") ss2 += "<li class='menuGrayTop'><table class='col2table'><tr><td>사용중인 이용권 이름</td><td onclick='proPage.loadPage(cuponbuyPage)'>이용권 구매 <i class='material-icons'>keyboard_arrow_right</i></td></tr></table></li>";
        else ss2 += "<li class='menuGrayTop'><table class='col2table'><tr><td>로그인 하세요</td><td onclick='proPage.loadPage(loginPage)'>로그인&회원가입 <i class='material-icons'>keyboard_arrow_right</i></td></tr></table></li>";

        ss2 += "<li class='menuLi'><a href='#' onclick='proPage.getPageMainTab()'><span><i class='material-icons'>home</i> HOME</span></a></li>";
        ss2 += "<li class='menuLi'><a href='#' onclick='proPage.loadPage(gongjiPage)'><span><i class='material-icons'>notifications</i> 공지사항 & FAQ</span></a></li>";
        ss2 += "<li class='menuLi'><a href='#' onclick='proPage.loadPage(jumunListPage)'><span><i class='material-icons'>speaker_notes</i> 주문제작</span></a></li>";
        ss2 += "<li class='menuLi'><a href='#' onclick='proPage.loadPage(myJarangPage)'><span><i class='material-icons'>share</i> CLUB</span></a></li>";


        ss2 += "<li class='menuRedMid'>MY 메뉴</li>";

        if(this.loginInf == "ok"){
            ss2 += "<li class='menuLi'><a href='#' onclick='proPage.loadPage(myalbumPage)'><span><i class='material-icons'>album</i> MY앨범</span></a></li>";
            ss2 += "<li class='menuLi'><a href='#' onclick='proPage.loadPage(downMp3Page)'><span><i class='material-icons'>inbox</i> 다운로드 내역</span></a></li>";
            ss2 += "<li class='menuLi'><a href='#' onclick='evClick.logout()'><span><i class='material-icons'>cancel</i> 로그아웃</span></a></li>";
        }else{
            ss2 += "<li class='menuLi'><a href='#' onclick='navigator.notification.confirm(\"로그인이 필요한 서비스입니다.\", proMsg.goLogin, \"로그인 안내\", \"취소,로그인\")'><span><i class='material-icons'>album</i> MY앨범</span></a></li>";
            ss2 += "<li class='menuLi'><a href='#' onclick='navigator.notification.confirm(\"로그인이 필요한 서비스입니다.\", proMsg.goLogin, \"로그인 안내\", \"취소,로그인\")'><span><i class='material-icons'>inbox</i> 다운로드 내역</span></a></li>";
        }

        ss2 += "<li class='menuLi'><a href='#' onclick='proPage.loadPage(gasathink)'><span><i class='material-icons'>inbox</i> 가사싱크</span></a></li>";

        $("#leftsidemenuFpage").html(ss2);

    },

    //왼쪽메뉴를 출력한다.
    insertLeftMnuOld:function(){

        this.loginInf = window.localStorage.getItem("login");

        var pimgurl = "";
        var psize = "cover";


        var ss2 = "";


        ss2 = "<li class='menuTit'><div style='position:absolute; top:47px; left:82px; color:white;'></div>";
        ss2 += "<img src='./images/leftTop.png' style='width:100px'>";
        ss2 += "<i class='fas fa-times' style='position:absolute; font-size:1.3em; margin:2px 0 0 76px; color:white;' onclick='appUtil.closePannel()'></i></li>";
        //ss2 += "<img id='panelCloseImg"+appBasInfo.nowPage+"' src='./images/xx.png' style='position:absolute; margin:1px 0 0 80px;'></li>";
        ss2 += "<li class='menuLi'><a href='#' id='getHomePage'><span><i class='fas fa-home'>&nbsp;</i> "+lngTxt.Home+"</span></a></li>";
        ss2 += "<li class='menuLi'><a href='#' id='getJumun'><span><i class='fas fa-edit'>&nbsp;</i> "+lngTxt.jumun+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='jumunList.html'><span><i class='fas fa-vcard'>&nbsp;</i> "+lngTxt.jumunList+"</span></a></li>";
        ss2 += "<li class='menuLi'><a href='songShow.html'><span><i class='fas fa-microphone '>&nbsp;</i> "+lngTxt.jarang+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='myJarang.html'><span><i class='fas fa-user'>&nbsp;</i> "+lngTxt.myJarang+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='myVoice.html'><span><i class='fas fa-list-alt'>&nbsp;</i> "+lngTxt.myVoice+"</span></a></li>";


        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='myalbum.html'><span><i class='fas fa-music'>&nbsp;</i> "+lngTxt.myAlbum+"</span></a></li>";
        ss2 += "<li class='menuLi'><a href='cuponbuy.html'><span><i class='fab fa-cc-visa'>&nbsp;</i> "+lngTxt.buycupon+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='downMp3.html'><span><i class='fas fa-download'>&nbsp;</i> "+lngTxt.downmp+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='gume.html'><span><i class='fas fa-list'>&nbsp;</i> "+lngTxt.buyList+"</span></a></li>";



        ss2 += "<li class='menuLi'><a href='FAQ.html'><span><i class='fas fa-pen-square'>&nbsp;</i> "+lngTxt.faq+"</span></a></li>";
        ss2 += "<li class='menuLi'><a href='gongji.html'><span><i class='fas fa-bullhorn'>&nbsp;</i> "+lngTxt.gongji+"</span></a></li>";


        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='setup.html'><span><i class='fas fa-cog'>&nbsp;</i> "+lngTxt.setup+"</span></a></li>";



        if(this.loginInf != "ok") ss2 += "<li class='menuLi' id='joinOn'><a href='join.html'><span><i class='fas fa-user-plus'>&nbsp;</i> "+lngTxt.memjoin+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi' id='joinEdit'><a href='join.html'><span><i class='fas fa-address-book'>&nbsp;</i> "+lngTxt.mypage+"</span></a></li>";
        if(this.loginInf == "ok") ss2 += "<li class='menuLi'><a href='#' onclick='evClick.logout()'><span><i class='fas fa-lock'>&nbsp;</i> "+lngTxt.logout+"</span></a></li>";
        if(this.loginInf != "ok") ss2 += "<li class='menuLi'><a href='#' id='getLoginPage'><span><i class='fas fa-lock-open'>&nbsp;</i> "+lngTxt.loginMnu+"</span></a></li>";

        $("#leftsidemenuFpage").html(ss2);

    },
}




//=============================================
//appUtil시작=========
var appUtil = {

	autoLogin:function(){
		
		if(window.localStorage.getItem("login") == "ok"){
			
			//자동로그인 처리 한다.
			var gs1 = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			gs1.basServer(gs1, "mu", "mode=autoLogin&email="+window.localStorage.getItem("email")+"&password="+window.localStorage.getItem("pass"));  //서버에서 post 모드로 가져온다.				
			
		}
		
	},
	
	rtNumber:function(bb){
		//소수점 반올림 정수형 반환
		var bbg = bb * 10000;
		bbg = Math.round(bbg);
		
		return bbg;
	},
	
	rtPercent:function(lsu, rsu){
		
		var p = (lsu / rsu) * 100;
		
		return Math.round(p);
	},


	//모드 페이지이동은 여기서 처리한다.
	pagemovePro:function(goinf, gook, mode, opt1, opt2, opt3){
		
		switch(appBasInfo.nowPage){
		case "Join":
			
			if(goinf){
				appUtil.alertgo("nn",lngTxt.prologin);
		        appUtil.moveOkHistory("index.html#Login");
			}else{
				appUtil.alertgo("nn",lngTxt.joinErr);
			}
			
			break;
		case "Login":
			
			if(goinf){
				appUtil.moveOkHistory("index.html");
			}else{
		        appUtil.alertgo("nn",lngTxt.loginErr);
			}
			
			break;
		}
		 
		
	},
		
	//특정 domid 에 내용을 출력
	setDomDisp:function(domid, txt){
		//alert(domid+"///"+txt);
		//$("#"+domid).html(txt);
		////console.log(domid+"/"+txt);
		document.getElementById(domid).innerHTML = txt;
	},
	
	
	mkTime:function(){
		
	    var mkt = ""; ///new Date(y, m-1, d, h, i, s);
	    mkt = new Date();
	    return Math.floor(mkt.getTime()/1000);

    },

	
	setDomFocus:function(po){
		
		var aa = document.getElementById(po);
		aa.focus();
		
	},
	
	fileDownUtil:function(fnam){
		
		fileObj.fileDown(fnam);
		
      //서버상의 sample.jpg 파일을 test.jpg 라는 이름으로 로컬시스템에 저장
		/*
		$('#downloadLink').prop('href', fnam); 
		$('#downloadLink').prop('download', 'test.jpg');
		$('#downloadLink')[0].click();
		*/
		
	},
	
	//첨부파일 다운로드
	addUpfileDown:function(dfile){
		appBasInfo.nowViewImgLink = dfile;
		
		this.fileDownUtil2();
		
	},
	
	//파일다운로드처리
	fileDownUtil2:function(){
		
		appUtil.dispPgLoading();
		
		fileObj.fileDown(appBasInfo.nowViewImgLink);
		
	},
	
	setPageH:function(){
		
		appBasInfo.pageH = $("#"+appBasInfo.nowPage).height();
		
		//alert(appBasInfo.pageH);
		$("#"+appBasInfo.nowPage+" div.allPage").css("height", (appBasInfo.pageH + 200)+"px");
		$("#"+appBasInfo.nowPage+" div.allPage div.pageBodyDiv").css("height", appBasInfo.pageH+"px");
		
		
	
	},
	
	callTel:function(ctel){

		//전화걸기 공통
		location.href="tel:"+ctel;
		
	}, 
	
	callTelMj:function(md){
		var ctel = "";
		if(md == 0) ctel = parCo.cotel;
		else ctel = parCo.hptel;
		
		//전화걸기 공통
		location.href="tel:"+ctel;
		
	}, 
	
	goHome:function(){
		appUtil.moveOkHistory("index.html#page");
	},
		
	
	//뒤로가기
	moveBack:function(){
		
		if(appBasInfo.nowPage == "page" || appBasInfo.nowPage == "page2"){
			
			navigator.notification.confirm(lngTxt.endOk, proMsg.onBackKeyDownMsg, lngTxt.endbtn, lngTxt.nookbtn);
			
		}else{
			history.go(-1);   //앞으로			
		}

	},
	
	dispPgLoading:function(){
		
		document.querySelector("#"+appBasInfo.nowPage+" .loadingDiv").style.display = "block";
		//기본 높이를 설정한다.
		var tt = 100;
		if(appBasInfo.nowPage == "ContentOnPut"){
			$("#"+appBasInfo.nowPage+" .loadingImg").css({"margin":(appBasInfo.topHeight+150)+"px 0 0"});
		}
		
	},
	
	hidePgLoading:function(){
		
		document.querySelector("#"+appBasInfo.nowPage+" .loadingDiv").style.display = "none";
		
	},
	
	moveGoback:function(){
		history.go(-1);   //앞으로		
	},
	
	exitApp:function(){
		//app exit
		navigator.app.exitApp();
	},
	
	allTogglePro:function(tgid){
		$aa = $("#"+tgid);
		
		if($aa.css("display") == "none"){
			$aa.css("display", "block");
		}else{
			$aa.css("display", "none");
		}
		
	},


	//이미지컨트롤 - 이미지를 직접 클릭하는 경우 
	controlImg:function(obj){
		
		appBasInfo.nowViewImgLink = obj.src;
		
		appUtil.moveOkHistory("imageView.html");
		
	},
	
	//이미지 크게 보기 - 이미지 주변을 클릭하는 경우 
	movImg:function(flink){
		
		appBasInfo.nowViewImgLink = flink;
		
		appUtil.moveOkHistory("imageView.html");
		
	},
	
	//알림 출력
	alertgo:function(tit,msg){
		tit = lngTxt.alerttit;
		
			navigator.notification.alert(
					msg,  // message
					function(){
						
					},              // callback to invoke with index of button pressed
			      tit,            // title
			      lngTxt.okbtn          // buttonLabels
				);
		
	},
	
	//에러 출력
	alertgoErr:function(xhr,status,error,fnn){
		
		var outMess;
		var outTit;
		
		if(AWtrans.mobileInf){
			if(status == "timeout"){
				outMess = "서버 응답이 없어 앱을 종료 합니다. Wifi에 장애가 있을 경우 다른 연결 방법을 선택해 주시기 바랍니다.";
				outTit = "네트워크 장애(Wifi 장애)";
				
				navigator.notification.confirm(outMess, alertDismissedWifi, "질문", '확인');

			}else{

			}
		}else{
			outTit = "에러";
			outMess = "서버 응답이 없어 앱을 종료 합니다. Wifi에 장애가 있을 경우 다른 연결 방법을 선택해 주시기 바랍니다.";
			alert(autTit+"-"+outMess);
		}

	},
	
	//메세지 전송 관련 글자 입력
	input_smstext:function(str,tsu){
		var ss = encodeURI(str);
		var rst = encodeURI(ss);
		return rst;
	},

	//줄바꿈하여 보여 준다.
	disp_rttext:function(str,tsu){
		
		var aa = unescape(str);
		aa = aa.replaceAll("\r", "");
		aa = aa.replaceAll("\n", "<br />");
		
		//aa = aa.replaceAll("%uB300", "");
		
		
		return aa;
	},
	
	//모든 내용 출력
	disp_smstext:function(str,tsu){
		
		var aa = str.replaceAll("%0A", "<br />");
		aa = aa.replaceAll("%3F", "?");
		
		return decodeURI(aa);
	},

	//히스토리 않남기는 페이지 전환
	moveOkHistory:function(url){
		////console.log("appUtil.moveOkHistory go="+url);
		$.mobile.changePage(url, {transition: "none", changeHash: true, showLoadMsg:true});
	},
	//히스토리 않남기는 페이지 전환
	moveNoHistory:function(url){
		$.mobile.changePage(url, {transition: "none", changeHash: false, showLoadMsg:true});
	},


	
	vimgUp:function(indx){
		var oldIndx = indx;
		if(indx > 0){
			indx--;
			
			this.chnDom(indx, oldIndx);
			
		}
		
	},
	vimgDown:function(indx){
		var oldIndx = indx;
		if(indx < 9){
			indx++;
			
			this.chnDom(indx, oldIndx);

		}
		
	},
	
	chnDom:function(indx, oldIndx){
		//이동할 돔
		var ss = document.getElementById("onImgDiv"+oldIndx);
		//원래 있는 돔
		var org = document.getElementById("onImgDiv"+indx);
		org.setAttribute("id", "imsi");
		
		
		//이동할 돔을 이동시킨다.
		var tg = document.getElementById("onImg"+indx);
		tg.appendChild(ss);
		//아이디를 새로운 아이디로 변경한다.
		ss.setAttribute("id", "onImgDiv"+indx);
		
		
		var tg = document.getElementById("onImg"+oldIndx);
		tg.appendChild(org);
		//이동된 것의 아이디를 변경한다.
		org.setAttribute("id", "onImgDiv"+oldIndx);
	},
	
	openPannel:function(){
		$("#"+appBasInfo.nowPage+" #left-panel").panel("open");
		
		
	},
	
	
	closePannel:function(){
		$("#"+appBasInfo.nowPage+" #left-panel"+appBasInfo.nowPage).panel("close");
	},
	
	
	
	
	keyOnput:function(ev, md){
		
		var keyCode = ev.keyCode;
		if(keyCode == 13){
			
			document.getElementById("findGot"+md).focus();
			
			switch(md){
			case 1:
				//메인페이지에서 검색
				appBasInfo.pageContentGet();
				
				break;
			case 2:
				//주문게시판에서 검색
				appBasInfo.jumunBdFindGet();
				
				break;
			}
			
		}

	},
	

	hanstrcut:function(str,len) {
		  var str2 = str;
	       var s = 0;
	       var tlen = str.length;
	       var rs = "";
	       
	       //alert(str2);
	       
	       for (var i=0; i < len; i++){
	    	   if(i > tlen) break;
	    	   
	      		s += (str.charCodeAt(i) > 128) ? 2 : 1;
	       }
	       
	       if (s >= len){
	            rs = str.substring(0,s)+'...';
	       }else{
	    	   rs = str2;
	       }
	       
	        return rs;
	},

	//자른 글자뒤에 ...를 달지 않는다.
	hanstrcut2:function(str,len) {
		  var str2 = str;
	     var s = 0;
	     var tlen = str.length;
	     var rs = "";
	     
	     //alert(tlen+"/"+len);
	     
	     for (var i=0; i < len; i++){
	  	   if(i > tlen) break;
	  	   
	    		s += (str.charCodeAt(i) > 128) ? 1 : 1;
	     }
	     
	     if (s >= len){
	          rs = str.substring(0,s);
	     }else{
	  	   rs = str2;
	     }
	     
	      return rs;
	},


	
	
}


//cordova plugin 네이티브와 연결=====================
var callNative = {

    recordVoice:function(aa, bb, cc){
        console.log("recordVoice====="+aa);
    	this.cordovaCall("recordVoice", aa, bb, cc, 0, 0, 0);

    },


    notipicatMy:function(tit, gasu, prefix, url){

    	    this.cordovaCall("notipicatMy", tit, gasu, prefix, url, mPlayer.musicPlayInf, 0);

    	},


    kakaoAndroidLogin:function(url, gasaurl, gasa){

	    this.cordovaCall("kakaoAndroidLogin", url, gasaurl, gasa, 0, 0, 0); //evClick.MusicUrl, evClick.GasaUrl, rgasa, 0, 0);

	},

    faceLogin:function(url, gasaurl, gasa){

	    this.cordovaCall("faceLogin", url, gasaurl, gasa, 0, 0, 0); //evClick.MusicUrl, evClick.GasaUrl, rgasa, 0, 0);

	},

	webDisp:function(url, gasaurl, gasa){

	    this.cordovaCall("webDisp", url, gasaurl, gasa, 0, 0, 0); //evClick.MusicUrl, evClick.GasaUrl, rgasa, 0, 0);

	},

	//와이파이 연결 설정 
	SetWifi:function(){

		this.cordovaCall("SetWifi", "uuuuyyy", 1, "ok", 0, 0, 0);
			
	},

	voiceRec:function(url, gasaurl, gasa){

	    this.cordovaCall("voiceRec", url, gasaurl, gasa, 0, 0, 0); //evClick.MusicUrl, evClick.GasaUrl, rgasa, 0, 0);

	},


//------------------------------------------------------------------------------
    cordovaCallResult:function(msg, gubun, stat){

        if(stat == "success"){

		    switch(gubun){
			case "SetWifi":

				console.log('success plugin callback!'+msg);

			break;
			case "voiceRec":


			break;
			}

        }else{      //error

			switch(gubun){
			case "SetWifi":

				console.log('error:' + msg);

			break;
			case "voiceRec":


			break;
			}

        }

    },

	cordovaCall:function(gubun, a1, a2, a3, a4, a5, a6){

			cordova.exec(
					function(message) {//success

                        callNative.cordovaCallResult(message, gubun, "success");

					}, function(err) {

                        callNative.cordovaCallResult(err, gubun, "err");
						
			}, "webViewpage", gubun, [a1, a2, a3, a4, a5, a6]);


	},	


}





/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */

