//=====================================================
//기본변수
//=====================================================
const LK = "http://mroo.co.kr/mrphp/allphpfile/";  //기본 링크
const MRPHP = "http://mroo.co.kr/mrphp/";
const MUSIC = "http://mroo.co.kr/mrphp/music/";    //뮤직의 링크
const LKCODE = "http://mroo.co.kr/home/";     //코드이그나이터 기본 링크
const LKAJAXC = "http://mroo.co.kr/common/ajaxc/";     //아작스 링크
const LKAJAXCFILE = "http://mroo.co.kr/common/ajaxc/filecont/";     //아작스 파일 업로드
const LKIMG = "http://mroo.co.kr/images/";
const UPVOICE = "http://mroo.co.kr/upload/";
//===============================================================================
const APPINF = "s";
const FEELINGGO = "Y";   //필링 가입 여부를 확인 한다.-"N"로 고정 해야 한다.
//================================================================
const TESTGO = false; //false; //true;   //테스트하기 위해 삽입한 코드의 실행 여부를 설정

const PROJE = "mrapp";
//=====================================================
// 256bit 암호화를 사용하기 위해서는 32Byte를 충족해야 하기 때문에
// Key는 32글짜를 입력하셔야 합니다.
const AMKEY = "EC655C39874E357EB759AA159FEB5AC5";
const KEYMK = "LGU";
//const SEVERURL = "http://mroo.co.kr/sohoring/allphpfile/setLGsohoring.php";
//=========================================================
//=================================================
////uws64-181.cafe24.com/WebMysql      id:pigg1234,    pass:soho7273
//기본변수=============
//=================================================
//기본변수=============
//var fnName = "kkss";
var qr = "";
var param = "";


var pushBack = false;

//복제된 클래스의 이름
var getServ, getServ2, allPlay;
var devAudio;

var newDirEntry, localPo, localDownPo;

var recFilePath = "";

var readOking = false;

//=====================================================
//플레이어 관련 구조체
//============================================
var mPlayer = {

    basid:0,
    songId:"0",
    songTit:"0",
    thinkFileName:"",
    gasu:"",
    gasa:[],
    preFix:"",
    songLink:"",
    songFold:"",
    musicPlayInf:"stop",

    setInit:function(data){

        this.songTit = data.tit;
        this.gasu = data.gasu;

    },

    setSongLink:function(data){
        var imsi = data.dir;

        this.songLink = imsi.replace("../mrphp/", "");
        this.songLink += "/"+data.songid+data.endfix;

    }

}
//=====================================================
//플러그인 설정
//============================================
var myPlug = {

    ptDomId:"",
    nowListId:"0",
    sangseDispDom:"",
    nowRecId:0,
    barInf:"open",
    scrollTop:0,

    acodian:function(dom){
        this.ptDomId = dom;

      var allPanels = $('#'+dom+' > dd').hide();

      $('a.acodion').click(function() {
            $(this).blur();  //포커스 표시를 삭제한다.
            $('a.acodion').removeClass("acodionCss");
            $('a.acodion i').html("keyboard_arrow_down");


            myPlug.menuBar("#addMenuMain", 300, "linear", "close");

            var seNowId = this.id.replaceAll("Button", "");


            myPlug.nowRecId = Number(seNowId);
            mPlayer.basid = myPlug.nowRecId;


            myPlug.sangseDispDom = "#dd"+dom+seNowId;
            $('#'+dom+' dt').css({"border-bottom":"#a9a9a9 1px solid"});


            if(myPlug.nowListId == dom+seNowId){
                allPanels.slideUp(300, "easeOutCirc");
                myPlug.nowListId = "0";

                $(myPlug.sangseDispDom).css({"border-bottom":"#dedede 1px solid"});
            }else{

                $(this).addClass("acodionCss");
                $('div#bodyContent'+tabInfo.mainTab+' #'+seNowId+'Button i').html("keyboard_arrow_up");
                $(myPlug.sangseDispDom).css({"border-bottom":"#777 2px solid"});
                $("#"+dom+seNowId).css({"border-bottom":"#a9a9a9 2px solid"});


                allPanels.slideUp(300, "easeOutCirc");

                //아코디언연다.
                switch(proPage.pageId){
                case "gasathink":
                    myPlug.acodianDDThink();
                break;
                default:
                    myPlug.acodianDD();
                break;
                }


                $("#dd"+dom+seNowId).slideDown(700, "easeOutBounce");
                myPlug.nowListId = dom+seNowId;

                //$("#addMenuMain").slideDown(700, "easeOutBounce");

            }

        return false;
      });

    },

    acodianDD:function(){
        //아코디언을 열때 실행하는 함수
        //서버에서 자료를 가져오기 전까지 임시로 리스트에를 출력한다.
        //alert("proPage.pageId=="+proPage.pageId);
        console.log("아코디언 임시 출력 ==== acodianDD======");

		getServ2 = new GetServer();
		getServ2.initParam("getMrAll.php", "mode=allMusicS&mid="+this.nowRecId, "allMusicS");
		getServ2.getPostMode();  //서버에서 post 모드로 가져온다.

        //가짜 자료를 출력한다.--------------------------------
        var tt = "<ul>";
        for(var c=1; c < 9; c++){
           tt += "<li><input type='checkbox'>";
           tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='material-icons' style='vertical-align:middle;'>play_circle_outline</i></li>";
        }
        tt += "</ul>";

        $(this.sangseDispDom).html(tt);
        //가짜 자료 끝------------------------------------------------

    },

    dispAcodianDD:function(data){
        //위에서 서버에서 자료를 다 가져오면 실제 자료를 출력한다.
        //allMusicS에서 호출 한다.
        console.log("아코디언 실제 자료 출력 ==== dispAcodianDD======");

            var tt = "<ul>";
            for(var c=1; c < data.rs.length; c++){
                var fdir = data.rs[c].dir+"/"+data.rs[c].sid+data.rs[c].endfix;
                tt += "<li><input type='checkbox'> "+data.rs[c].pfix;
                tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i id='"+data.rs[c].sid+"' class='material-icons' style='vertical-align:middle;' onclick='notipicatMyOne(this, \""+data.tit+"\", \""+data.gasu+"\", \""+data.rs[c].pfix+"\", \""+fdir+"\")'>play_circle_outline</i>";
                tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i id='"+data.rs[c].sid+"' class='material-icons' style='vertical-align:middle;' onclick='callNative.recordVoice(\""+data.rs[c].sid+"\", \"0\", \"0\")'>mic</i></li>";
            }
            tt += "</ul>";

            $(this.sangseDispDom).html(tt);
    },


    acodianDDThink:function(){
        //아코디언을 열때 실행하는 함수
        //서버에서 자료를 가져오기 전까지 임시로 리스트에를 출력한다.
        //alert("proPage.pageId=="+proPage.pageId);

		getServ2 = new GetServer();
		getServ2.initParam("getMrAll.php", "mode=allMusicS&mid="+this.nowRecId, "allMusicSThink");
		getServ2.getPostMode();  //서버에서 post 모드로 가져온다.

        //가짜 자료를 출력한다.--------------------------------
        var tt = "<ul>";
        for(var c=1; c < 9; c++){
           tt += "<li>";
           tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='material-icons' style='vertical-align:middle;'>chrome_reader_mode</i></li>";
        }
        tt += "</ul>";

        $(this.sangseDispDom).html(tt);
        //------------------------------------------------

    },

    dispAcodianDDThink:function(data){
        //위에서 서버에서 자료를 다 가져오면 실제 자료를 출력한다.
        //allMusicS에서 호출 한다.
            var tt = "<ul>";
            for(var c=1; c < data.rs.length; c++){
                var fdir = data.rs[c].dir+"/"+data.rs[c].sid+data.rs[c].endfix;
                tt += "<li style=''> "+data.rs[c].pfix;
                tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                tt += "<i id='"+data.rs[c].sid+"' class='material-icons' style='vertical-align:middle;' onclick='notipicatMyOneThink(this, \""+data.tit+"\", \""+data.gasu+"\", \""+data.rs[c].pfix+"\", \""+fdir+"\", \"set\")'>chrome_reader_mode</i>";
                tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i id='"+data.rs[c].sid+"' class='material-icons' style='vertical-align:middle;' onclick='notipicatMyOneThink(this, \""+data.tit+"\", \""+data.gasu+"\", \""+data.rs[c].pfix+"\", \""+fdir+"\", \"play\")'>subscriptions</i>";
                tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i id='"+data.rs[c].sid+"' class='material-icons' style='vertical-align:middle;' onclick='notipicatMyOneThink(this, \""+data.tit+"\", \""+data.gasu+"\", \""+data.rs[c].pfix+"\", \""+fdir+"\", \"down\")'>assignment_returned</i>";
                tt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i id='"+data.rs[c].sid+"' class='material-icons' style='vertical-align:middle;' onclick='notipicatMyOneThink(this, \""+data.tit+"\", \""+data.gasu+"\", \""+data.rs[c].pfix+"\", \""+fdir+"\", \"upload\")'>backup</i></li>";
            }
            tt += "</ul>";

            $(this.sangseDispDom).html(tt);
    },


    menuBar:function(domid, delay, easing, mode){

        this.barInf = mode;

        if(this.barInf == "open"){
            $(domid).slideDown(delay, easing);
        }else{
            $(domid).slideUp(delay, easing);
        }

    },

    getScrollTop:function(domid){

            $(domid).bind("scroll", function (e){

                myPlug.scrollTop = $(domid).scrollTop();

                myPlug.mainTitle();

            });

    },
    mainTitle:function(){

                if(this.scrollTop < 2){
                    $(".mainMogCha").slideDown(120, "easeInCubic");
                    $("#contentBody").css({"margin":"98px 0 0"});
                }else{
                    $(".mainMogCha").slideUp(120, "easeInCubic");
                    $("#contentBody").css({"margin":"45px 0 0"});
                }

    },

}
//=====================================================
//form 처리
//============================================
var frmPro = {

    formInf:false,
	rtelem:"",
	rtelemNam:"",

	//수정을 위해 값을 가져와서 뿌린다.
	formEditGab:function(formnam, mode, data){

		switch(mode){
		case "join":

			$("#"+formnam).find("input,select,radio,checkbox,textarea,hidden").each(function(index, elem){
				console.log("frmProEditGab === name="+elem.name+"/ val="+$(elem).val()+"/ id="+elem.id+"/index="+index);

				switch(elem.name){
				case "privacy":   //체크 처리해야 하는 항목들
				case "terms":

					if(data[elem.name] == 1){
						//약관 동의 선택된 경우
						$(elem).prop("checked", true).checkboxradio("refresh");
					}else{
						//약관 동의 하지 않은 경우
						$(elem).prop("checked", false).checkboxradio("refresh");
					}

					break;
				default:
					$(elem).val(data[elem.name]);
					break;
				}

			});

			break;
		}


	},

	forminputInit:function(formnam){
		//초기화 하면서 필수입력 분홍색 배경으로 변경

		$("#"+formnam).find("input,select,radio,checkbox,textarea,hidden").each(function(index, elem){
			console.log("name="+elem.name+"/ val="+$(elem).val()+"/ id="+elem.id+"/index="+index);

			var ty = elem.type;
			switch(ty){
			case "email":
			case "password":
			case "textarea":
			case "text":
				$(elem).val("");
				break;
			case "tel":
				$(elem).val("0");
				break;
			case "hidden":
				//$(elem).val("0");
				break;
			case "date":
				$(elem).val("");
				break;
			}

			if($(elem).prop("required")){
				$(elem).css({"background-color":"#f0fef0", "border":"#fc8686 1px solid"});
			}

		});

	},

	forminput:function(formnam){

		this.formInf = true;
		var ii = 0;
		var rtarr = "";
		$("#"+formnam).find("input,select,radio,checkbox,textarea,hidden").each(function(index, elem){
			//console.log("name="+elem.name+"/ val="+$(elem).val()+"/ id="+elem.id+"/index="+index+"/disp attr="+$(elem).css("display"));

			var val = $(elem).val();
			var att = $(elem).css("display");

			if($(elem).prop("required") && (att == "block" || att == "inline-block")){
				//필수입력칸은 입력 여부를 확인하여 입력을 필수로 받는다.
				if(!val){
					frmPro.formInf = false;
					frmPro.rtelem = elem.id;
					frmPro.rtelemNam = elem.name;
					return false;  //루프를 종료한다.
				}else{
					//form 에서 값입력 외에 특별히 처리할 작업 처리 후 값을 반환
		            val = frmPro.formSSPro(index, elem, val);
		            //특별한 값정이 않된경우 설정하도록 중지 시킨다.
		            if(!frmPro.formInf) return false;

					var tt = elem.name + "=" +val + "&";
					rtarr += tt;
				}
			}else{

				//특별한 처리하여 값을 반환
				val = frmPro.formSSPro(index, elem, val);
				//필수입력이 아니면 그냥 있는 값을 가져온다.
				var tt = elem.name + "=" +val + "&";
				rtarr += tt;
			}

			//페이지별 특별 처리는 여기============================
			switch(appBasInfo.nowPage){
			case "Jumungo":
				jumunInfo[elem.name] = val;   //주문내역을 저장한다.
				break;
			case "Gume":
				if(val != 0){
					downMp.songid[ii] = val;
					ii++;
				}
				break;
			case "DownMp3":
				if(val != 0){
					downMp.songid[ii] = val;
					downMp.songLink[ii] = music1cha.sound[index];
					ii++;
				}
				break;
			}
			//===============================================

		});

		if(this.formInf){
			console.log("form all input value first====="+rtarr);

			//최종 결과값에 대한 페이지별 특별 처리는 여기============================
			switch(appBasInfo.nowPage){
			case "Gume":
				rtarr = "";
				for(var c = 0; c < ii; c++){
					rtarr += downMp.songid[c] + "/";
				}

				downMp.downSu = ii;

				break;
			case "DownMp3":
				rtarr = downMp.songid;

				break;
			}
			console.log("form all input value last====="+rtarr);
			//===============================================

			return rtarr;
		}else{
			this.formAlertText();  //처리중지시 메시지 표시

			return false;
		}

	},


	formSSPro:function(indexg, elemg, valg){  //form에서 특별히 처리해야하는 작업 처리

		frmPro.formInf = true;

		var finf = true;
		switch(appBasInfo.nowPage){
		case "PassChange":
			switch(elemg.name){
			case "repasswd":
			    if($("#newPass").val() != $("#renewPass").val()){
			    	finf = false;
			    }
				break;
			}

			break;
		case "Gume":
		case "DownMp3":

			if($(elemg).is(":checked")){
				valg = elemg.id;
			}else{
				valg = 0;
			}

			break;
		case "Join":

			switch(elemg.name){
			case "repassword":
			    if($("#passwordJ").val() != $("#repasswordJ").val()){
			    	finf = false;
			    }

				break;
			case "terms":
				if($(elemg).is(":checked")) valg = 1;
				else{
					valg = 0;
					finf = false;  //넘어가지 않고 종료한다.
				}

				break;
			case "privacy":
				if($(elemg).is(":checked")) valg = 1;
				else{
					valg = 0;
					finf = false;
				}

				break;
			}

			break;
		}

		if(!finf){
			frmPro.formInf = false;
			frmPro.rtelem = elemg.id;
			frmPro.rtelemNam = elemg.name;
		}

		return valg;
	},


	formAlertText:function(){

		var hmNam = "미상";

		switch(frmPro.rtelemNam){
		case "nameF":
		case "name":
			hmNam = "이름을 입력하세요.";
			break;
		case "tit":
			hmNam = "제목을 입력하세요";
			break;
		case "qtit":
			hmNam = "문의 제목을 입력하세요";
			break;
		case "content":
			hmNam = "내용을 입력하세요.";
			break;
		case "qtext":
			hmNam = "문의 내용을 입력하세요.";
			break;
		case "telF":
		case "tel":
			hmNam = "전화번호를 입력하세요.";
			break;
		case "birthday":
			hmNam = "생년월일을 입력하세요.";
			break;
		case "emailF":
		case "Email":
		case "email":
			hmNam = "이메일 주소를 입력하세요.";
			break;
		case "passwd":
			hmNam = "새 비밀번호를 입력하세요.";
			break;
		case "repasswd":
			hmNam = "새 비밀번호와 비밀번호확인은 같은 값을 입력하세요.";
			break;
		case "Password":
		case "password":
			hmNam = "비밀번호를 입력하세요.";
			break;
		case "oldpasswd":
			hmNam = "기존 비밀번호를 입력하세요.";
			break;
		case "repassword":
			hmNam = "비밀번호와 비밀번호 확인은 서로 같은 값이 입력되어야 합니다.";
			break;
		case "nicname":
			hmNam = "닉네임을 입력하세요.";
			break;
		case "birthday":
			hmNam = "생년월일을 입력하세요.";
			break;
		case "terms":
			hmNam = "이용약관에 동의 하셔야 모든 서비스 이용이가능 합니다.";
			break;
		case "privacy":
			hmNam = "개인정보 수집에 동의 하셔야 모든 서비스 이용이 가능 합니다.";
			break;
		}

		switch(appBasInfo.nowPage){
		case "Join":
			switch(frmPro.rtelemNam){
			case "terms":

				break;
			case "privacy":

				break;
			}

			break;
		}

		appUtil.alertgo("nn", hmNam);
		document.getElementById(frmPro.rtelem).focus();

	},



}
//=====================================================
//나라 설정
//============================================
function seNara(){
	this.nara = 1;   //1:한국,  2:영어
}
seNara.prototype.chanenara = function(md){
	this.nara = md;

	switch(this.nara){
	case 1:
		return korSheet;
		break;
	case 2:
		return engSheet;
		break;
	}
}

//=====================================================
//회원정보
//=====================================================
function parMem(){
	this.memid = "0";    //회원아이디
	this.memName = "";
	this.memNicName = "";  //닉네임
	this.memPass = "";
	this.tel = null;
	this.email = null;
	this.memPo = null;   //회원의 자격

	this.latPo = null;    //위도
	this.longPo = null;   //경도

	this.loginStat = false;  //로그인 여부를 저장
	this.idGoOkInf = false;     //아이디 중복확인 여부
	this.idGoOkId = "";         //중복확인에 승인된 아이디 저장
	this.reEmail = "";
	this.reEmailInf = false;

	this.emGoOkInf = false;
	this.emGoOk = "";

}

//회원삭제
parMem.prototype.delMem = function(){

}
//회원수정
parMem.prototype.edtMem = function(){

}


////=====================================================
//업체정보
////=====================================================
function parCo(){
	this.coid = null;
	this.latPo = null;
	this.longPo = null;
	this.cotel = null;
	this.hptel = null;
	this.coMemid = null;  //업체 등록자의 아이디
	this.info = null;   //업체 정보
	this.sangho = null;
	this.addr = null;
}
//초기화
parCo.prototype._init = function(){

}
//업체등록
parCo.prototype.onputCom = function(){

}
//업체삭제
parCo.prototype.delCom = function(){

}
//업체수정
parCo.prototype.edtCom = function(){

}
//업체정보 상세보기
parCo.prototype.viewCom = function(){

}


//=====================================================
//주문관련 구조체
//=====================================================
var jumunInfo = {
	jlgubun:"가요",
	don:90000,
	jenre:{"가요":90000, "클래식":100000, "동요":50000},   //장르별 가격,
	song:"",
	gasu:"",
	keymemo:"",
	jumunmemo:"",
	email:"",
	name:"",
	tel:"",
	stime:1,
	etime:2,
	timeAnz:function(){   //상담시간 유효성 검사
		
		
	},
	
	dispDon:function(dom,seid){
		var vv = $("#"+seid).val();
		var don = this.jenre[vv];
		//alert(vv+"/"+don);
		$("#"+dom).html(don);
		$("#donH").val(don);
		
	},
	idmd:"on",
	
	
}

//=====================================================
//쿠폰관련
//=====================================================
var cuponInfo = {
	
	cuponArry:{1:"24시간 스트리밍", 2:"MP3 10곡 다운로드", 3:"MP3 30곡 다운로드", 4:"MP3 50곡 다운로드"},
	cuponDon:{1:1100, 2:3300, 3:6600, 4:9900},
	cuponClass:{1:"couponTb24", 2:"couponTb10", 3:"couponTb30", 4:"couponTb50"},
	
	allSu:20,
	gubun:1,
	don:1,
	email:"",
	tit:"",
	daysu:30,
	sday:"",
	eday:"",
	
	cuponSu:function(){
		this.allSu = 20;
	},
	
}

//=====================================================
//다운로드관련 구조체
//=====================================================
var downMp = {
	songid:{},
	songfix:{},
	songLink:{},
	downSu:0,
	cuponid:0,
	tit:"",
	gasu:"",
	
	init:function(){
		this.songid = [];
		this.songfix = [];
		this.downSu = 0;
		this.tit = "";
		this.gasu = "";
	},
	
	checkSu:function(formid){
		this.downSu = $("#"+formid+" input[name=dwchek]:checkbox:checked").length;
		$("#dwAllSu").html(this.downSu);
		$("#cuponCount").html(this.downSu+" (선택) / "+cuponInfo.allSu+" (잔여수)");
	},
	
}



//=====================================================
//음악 플레이
//=====================================================
function MrMusic(){
	this.nowMusicId = null;
	this.nowPlayId = null;
	this.oldPlayId = null;
	this.playLink = null;
}
MrMusic.prototype._init = function(){
	//초기화

}
MrMusic.prototype.play = function(){

}
MrMusic.prototype.stop = function(){

}
MrMusic.prototype.mediaCreate = function(){

}

//=====================================================
//음악싱크파일 컨트롤.
//=====================================================
var thinkSys = {

    mSend:0,
    crTime:0,
    playInf:false,
    continuInf:false,   //싱크 파일의 존재 여부에 따라 진행여부 물어본 여부 저장.
    intVg:null,
    dispIntV:null,
    intPlay:null,
    thinkArray:{},
    thinkArraySu:0,
    thinkIndexArray:{},
    thinkGasaArray:{},
    thinkGasaEngArray:{},
    thinkIndex:0,
    thinkText:"",
    thinkTextArray:{},
    allIndex:0,
    scrollPo:0,
    gasaThinkGab:40,       //가사스크롤 값
    gasaThinkTime:700,     //가사스크롤 시간

    thinkPlay:function(){
        if(thinkSys.intPlay) clearInterval(thinkSys.intPlay);

        //싱크파일을 읽어 온다.
        thinkSys.rdThink();

    },

    thinkScrollTest:function(gab, stime){
        thinkSys.scrollPo += gab;
        console.log("scroll===="+thinkSys.scrollPo);

        thinkSys.thinkScrollUp("#gasathinkPro", thinkSys.scrollPo, stime);

    },

    thinkScrollUp:function(dom, upgab, stime){
        //dom을 스크롤 시킨다.
                $(dom).animate({
                    scrollTop: upgab
                }, stime, "linear", function(){

                    //$("#gasa"+thinkSys.thinkIndex).removeClass('gasaNormal');
                    //$("#gasa"+thinkSys.thinkIndex).addClass('seGasa');

                });
    },

    songPlayFun:function(domid){

                			$("ul.gasaDisp li").removeClass('seGasa');
                			$("ul.gasaDisp li").addClass('gasaNormal');

                            document.getElementById(domid).currentTime = thinkSys.crTime;
                			document.getElementById(domid).play();

                			thinkSys.mSend = thinkSys.crTime;
                			thinkSys.intVg = setInterval(thinkSys.thinkCount, 100);

    },

	songPlay:function(domid){  //처음부터 곡을 시작한다.

        if(thinkSys.intVg) clearInterval(thinkSys.intVg);
        if(thinkSys.dispIntV) clearInterval(thinkSys.dispIntV);

        if(thinkSys.playInf){  //======================================
            //현재 음악 플레이 중이다.
            //음악을 일시 중지 시킨다.
            thinkSys.playInf = false;
            thinkSys.mSend = thinkSys.crTime;
            document.getElementById(domid).pause();

        }else{     ////======================================
            //현재 음악 플레이 중이 아니다.
            //음악을 계속 플레이 한다.
            thinkSys.mSend = thinkSys.crTime;
            document.getElementById(domid).src="http://mroo.co.kr/mrphp/"+mPlayer.songLink;
	        if(thinkSys.thinkGasaEngArray.length > 0 && !thinkSys.continuInf){
	            thinkSys.continuInf = true;
	            navigator.notification.confirm('기존 싱크파일이 있습니다. 파일저장을 클릭하면 기존 파일은 삭제 됩니다.', function(button){
                        if(button == 1){   //그냥 함수를 빠져나간다.
                            document.getElementById(domid).pause();

                            return;
                        }else{
                            thinkSys.playInf = true;
                            thinkSys.songPlayFun(domid);
                        }
                }, '알림', '취소,계속');   //1:삭제,  2:저장

	        }else{
	            thinkSys.playInf = true;
	        	thinkSys.songPlayFun(domid);
	        }

        }

	},

	songThinkPlay:function(domid){  //처음부터 곡을 시작한다.
			thinkSys.thinkIndex = 0;
			thinkSys.scrollPo = 0;

			if(thinkSys.intVg) clearInterval(thinkSys.intVg);
			if(thinkSys.dispIntV) clearInterval(thinkSys.dispIntV);

			$("ul.gasaDisp li").removeClass('seGasa');
			$("ul.gasaDisp li").addClass('gasaNormal');


			document.getElementById(domid).src="http://mroo.co.kr/mrphp/"+mPlayer.songLink;
			document.getElementById(domid).play();

            thinkSys.songGassPlay();

		},


	thinkCount:function(){
	        thinkSys.crTime = (parseInt(document.getElementById("thinkPlayMusic").currentTime * 10));
	        $("#currentTime").html("싱크타임 : "+thinkSys.crTime);
			thinkSys.mSend = thinkSys.crTime;
          		},

	lineEnd:function(){   //라인 넘기기

            //alert("index="+thinkSys.thinkIndex+"///gab="+thinkSys.mSend);
			thinkSys.thinkArray[thinkSys.thinkIndex] = thinkSys.mSend;

			thinkSys.thinkScrollTest(thinkSys.gasaThinkGab, thinkSys.gasaThinkTime);   //scrollgab, time

			$("#gasa"+thinkSys.thinkIndex).removeClass('gasaNormal');
			$("#gasa"+thinkSys.thinkIndex).addClass('endGasa');

			thinkSys.thinkIndex++;

		},

	thinkEnd:function(){  //결과 보기

			if(thinkSys.intVg) clearInterval(thinkSys.intVg);
			if(thinkSys.dispIntV) clearInterval(thinkSys.dispIntV);

			thinkSys.thinkScrollTest(40, thinkSys.gasaThinkTime);   //scrollgab, time


			$("ul.gasaDisp li").removeClass('endGasa');
			$("ul.gasaDisp li").removeClass('seGasa');
			$("ul.gasaDisp li").addClass('gasaNormal');

			thinkSys.songGassDisp('thinkPlayMusic');

		},


	songGassDisp:function(domid){   //결과 출력
			thinkSys.thinkIndex = 0;
			thinkSys.thinkArraySu = thinkSys.thinkArray.length;
            thinkSys.scrollPo = 0;


			document.getElementById(domid).src="http://mroo.co.kr/mrphp/"+mPlayer.songLink;

			//document.getElementById(domid).currentTime = 20;

			document.getElementById(domid).play();


			$("ul.gasaDisp li").addClass('gasaNormal');
			$("#gasa"+thinkSys.thinkIndex).removeClass('gasaNormal');
			$("#gasa"+thinkSys.thinkIndex).addClass('seGasa');

			thinkSys.mSend = 0;
			thinkSys.dispIntV = setInterval(thinkSys.thinkDisp, 100);

		},

	songGassPlay:function(){   //결과 출력
			thinkSys.thinkIndex = 0;

			$("ul.gasaDisp li").addClass('gasaNormal');
			$("#gasa"+thinkSys.thinkIndex).removeClass('gasaNormal');
			$("#gasa"+thinkSys.thinkIndex).addClass('seGasa');

			thinkSys.mSend = 0;
			thinkSys.dispIntV = setInterval(thinkSys.thinkDisp, 100);

		},


	thinkDisp:function(){  //0.1초마다 불러서 검사한다.

			if(thinkSys.thinkIndex > (thinkSys.thinkArraySu - 1)){
			    clearInterval(thinkSys.dispIntV);
			}else if(thinkSys.thinkArray){

			    console.log("No In mSend=="+thinkSys.mSend+"//// index="+thinkSys.thinkIndex+" thinkArray="+thinkSys.thinkArray[thinkSys.thinkIndex]);
                if(thinkSys.mSend >= thinkSys.thinkArray[thinkSys.thinkIndex]){
                    //현재 플레이 중인 음악에서 커런트 위치를 구해서 위치가 줄바꿈 위치를 통과 하는 경우 줄을 올린다.

                    console.log("*******On In mSend=="+thinkSys.mSend+"//// think="+thinkSys.thinkArray[thinkSys.thinkIndex]);

                    $("#gasa"+thinkSys.thinkIndex).addClass('gasaNormal');
                    $("#gasa"+thinkSys.thinkIndex++).removeClass('seGasa');

                    $("#gasa"+thinkSys.thinkIndex).removeClass('gasaNormal');
                    $("#gasa"+thinkSys.thinkIndex).addClass('seGasa');

                    thinkSys.thinkScrollTest(thinkSys.gasaThinkGab, thinkSys.gasaThinkTime);   //scrollgab, time
                }

                thinkSys.crTime = (parseInt(document.getElementById("thinkPlayMusic").currentTime * 10));
                thinkSys.mSend = thinkSys.crTime ;
			}

		},

	wrThink:function(domid){

        document.getElementById(domid).pause();

        if(thinkSys.thinkGasaEngArray.length > 0){
	            navigator.notification.confirm('기존 싱크파일이 있습니다. 파일저장을 클릭하면 기존 파일은 삭제 됩니다.', function(button){
                        if(button == 1){   //그냥 함수를 빠져나간다.

                            return;
                        }else{


                                			var ss = "";
                                			for(var c = 0; c < thinkSys.thinkGasaArray.length; c++){
                                			    if((thinkSys.thinkIndex - 1) >= c){
                                			        ss += "Line"+c+"#"+thinkSys.thinkGasaArray[c]+"#"+thinkSys.thinkArray[c]+"--";
                                			    }else{
                                			        ss += "Line"+c+"#"+thinkSys.thinkGasaArray[c]+"#0--";
                                			    }
                                			}

                                            localSys.thinkFileWrInf = true;
                                            //alert("ss==="+ss+"//indx="+thinkSys.thinkIndex+"//gasaArray="+thinkSys.thinkGasaArray.length);
                                			//localSys.wrFile("mrro/imsi/"+appBasInfo.chnSongid(mPlayer.songId)+".txt", ss);
                                			localSys.wrFile("mrro/imsi/imsigasa.txt", ss);
                        }
                }, '알림', '취소,저장');   //1:삭제,  2:저장

	    }else{

	        var ss = "";
                                            			for(var c = 0; c < thinkSys.thinkGasaArray.length; c++){
                                            			    if((thinkSys.thinkIndex - 1) >= c){
                                            			        ss += "Line"+c+"#"+thinkSys.thinkGasaArray[c]+"#"+thinkSys.thinkArray[c]+"--";
                                            			    }else{
                                            			        ss += "Line"+c+"#"+thinkSys.thinkGasaArray[c]+"#0--";
                                            			    }
                                            			}

                                                        localSys.thinkFileWrInf = true;
                                                        //alert("ss==="+ss+"//indx="+thinkSys.thinkIndex+"//gasaArray="+thinkSys.thinkGasaArray.length);
                                            			//localSys.wrFile("mrro/imsi/"+appBasInfo.chnSongid(mPlayer.songId)+".txt", ss);
                                            			localSys.wrFile("mrro/imsi/imsigasa.txt", ss);
	    }

	},

    rdThink:function(){
        //localSys.rdFile("mrro/imsi/"+appBasInfo.chnSongid(mPlayer.songId)+".txt");
        localSys.rdFile("mrro/imsi/imsigasa.txt");
    },


}
//=====================================================
//로컬시스템
//=====================================================
var localSys = {

	dsu:0,
	fileDownInf:false,
	fileEntry:null,
	fileTrans:null,
	fileDownUrl:"",
	seFileLink:"",
	jarangFile:"",
	dirEntry:null,
	localPath:null,
	thinkFileWrInf:false,
	musicBasLink:"http://mroo.co.kr/mrphp/music/",


    rdFile:function(fileName){

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){

                        fs.root.getFile(fileName, null, function(fileEntry){

                            fileEntry.file(function(file){

                                //localSys.readDataUrl(file);
                                if(fileName == "mrro/imsi/imsigasa.txt"){
                                    localSys.readAsTextThink(file);

                                }else{
                                    localSys.readAsText(file);
                                }

                            }, function(err){

                                alert("file reader err");

                            });

                        }, function(err){

                            alert("fileendtry error")

                        });


        		},function(FileError){

        			console.log(FileError.code);
        		});

    },

    songGasaDisplay:function(data){

		    var imsi = disp_smstext(data.gasa);
		    //imsi = imsi.replaceAll("<br />", "<br33 />");
            mPlayer.gasa = imsi.split("<br />");
            thinkSys.thinkGasaArray = [];


            document.getElementById("titGab").innerHTML = mPlayer.songTit;
            document.getElementById("gasuGab").innerHTML = mPlayer.gasu;

            var ss = "<ul id='gasaDispUl' class='gasaDisp'>"
            for(var c =0; c < mPlayer.gasa.length; c++){

                thinkSys.thinkGasaArray[c] = mPlayer.gasa[c];
                ss += "<li id='gasa"+c+"' class='gasaNormal'>"+thinkSys.thinkGasaArray[c];
                ss += "<span class='thinkGasa'></span>";
                ss += "</li>";

            }

            for(var u = 0; u < 18; u++) ss += "<li class='gasaNormal'></li>";

            ss += "<ul>";

            $("#gasathinkPro").html(ss);

            document.getElementById("thinkPlayMusic").src = MRPHP + mPlayer.songLink;

     },


    readThinkFile:function(dom, fileName){

       window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
                        fs.root.getFile(fileName, null, function(fileEntry){

                            fileEntry.file(function(file){

          var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("Read Think as text");
                console.log(evt.target.result);
                //alert("rrr==="+evt.target.result);
                thinkSys.thinkText = evt.target.result;

                thinkSys.thinkIndexArray = [];
                thinkSys.thinkGasaEngArray = [];
                thinkSys.thinkArray = [];

                thinkSys.thinkTextArray = thinkSys.thinkText.split("--");

                for(var c = 0; c < (thinkSys.thinkTextArray.length - 1); c++){
                    var imsi = thinkSys.thinkTextArray[c].split("#");

                    thinkSys.thinkIndexArray[c] = parseInt(imsi[0].replaceAll("Line", ""));
                    thinkSys.thinkGasaEngArray[c] = imsi[1];
                    thinkSys.thinkArray[c] = parseInt(imsi[2]);

                    $(dom+c+" span.thinkGasa").html(imsi[1]);    //싱크 가사를 출력한다.

                }
                thinkSys.thinkArraySu = thinkSys.thinkArray.length;

            };
            reader.readAsText(file);

                                //localSys.setThinkArray(file);
                            }, function(err){
                                alert("readThinkFile1 file reader err");
                            });

                        }, function(err){
                            alert("readThinkFile2--- fileendtry error")
                        });

        		},function(FileError){
        			console.log(FileError.code);
        		});

    },


    readDataUrl:function (file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as data URL");
            console.log(evt.target.result);
            alert(evt.target.result);
        };
        reader.readAsDataURL(file);
    },

    readAsText:function (file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as text");
            console.log(evt.target.result);
            //alert("rrr==="+evt.target.result);

        };
        reader.readAsText(file);
    },



    setThinkArrayNormal:function(file){

           var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("Read Think as text");
                console.log(evt.target.result);
                //alert("rrr==="+evt.target.result);
                thinkSys.thinkText = evt.target.result;

                thinkSys.thinkIndexArray = [];
                thinkSys.thinkGasaEngArray = [];
                thinkSys.thinkArray = [];

                thinkSys.thinkTextArray = thinkSys.thinkText.split("--");

                for(var c = 0; c < (thinkSys.thinkTextArray.length - 1); c++){
                    var imsi = thinkSys.thinkTextArray[c].split("#");

                    thinkSys.thinkIndexArray[c] = parseInt(imsi[0].replaceAll("Line", ""));
                    thinkSys.thinkGasaEngArray[c] = imsi[1];
                    thinkSys.thinkArray[c] = parseInt(imsi[2]);
                }

                thinkSys.thinkArraySu = thinkSys.thinkArray.length;


            };
            reader.readAsText(file);

    },


    readAsTextThink: function (file) {

            localSys.setThinkArrayNormal(file);
            thinkSys.songThinkPlay("thinkPlayMusic");

    },


    wrFile:function(fileName, txt){

        //서버로 파일을 전송한다.
        localSys.getDirEntry('mrro/imsi/');

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){

                        fs.root.getFile(fileName, {create: true, exclusive: false}, function(fileEntry){

                            fileEntry.createWriter(function(writer){

                                writer.write(txt);


                                localSys.fileUpBas('imsigasa.txt');  //서버에 파일을 전송한다.


                            }, function(err){

                                alert("file writer err");

                            });

                        }, function(err){

                            alert("fileendtry error")

                        });


        		},function(FileError){

        			console.log(FileError.code);
        		});

    },

    getDirEntry:function(dom){

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
    			localSys.localPath = fs.root.toURL()+dom;   ///dom : 'mrro/voice/'
    			fs.root.getDirectory(dom,{create:true,exclusive:false}, function (directoryEntry){
    				//alert("gogodr="+directoryEntry+"////dom=="+dom);
    				//디렉토리 엔터리를 구한다.
    				localSys.dirEntry = directoryEntry;
    				newDirEntry = directoryEntry;

                    //alert(localSys.dirEntry.toURL());
                    //alert(localSys.localPath+"///"+localSys.dirEntry);

    			}, function(FileError){
                    //alert("errot==="+FileError.code);
    				console.log("window.requestFileSystem====="+FileError.code);
    			});
    		},function(FileError){

    			console.log(FileError.code);
    		});

    },

	mkFold:function(dom){
		//로컬에 앱폴더의 존재 여부를 확인하고 없으면 생성한다.
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			recFilePath = fs.root.toURL()+dom;   ///dom : 'mrro/voice/'
			//console.log("org Path===="+recFilePath+"////====dom="+dom);
			//alert("mkFold=="+recFilePath);

			fs.root.getDirectory(dom ,{create:true,exclusive:false}, function (directoryEntry){
				//console.log("direndt mk go="+directoryEntry+"////dom=="+dom);

				//alert("mkFold Ok");

				//디렉토리 엔터리를 구한다.
				newDirEntry = directoryEntry;

				if(dom == "mrro/voice/"){
					//디렉토리의 전체경로를 구한다.
					localPo = directoryEntry.toURL();
				}else{
					//디렉토리의 전체경로를 구한다.
					localDownPo = directoryEntry.toURL();
				}
			}, function(FileError){
                //alert("window.requestFileSystem====="+FileError.code);
				console.log("window.requestFileSystem000====="+FileError.code);
			});
		},function(FileError){

			console.log(FileError.code);
		});
	},


	fileDown:function(mlink, indx){
		this.dsu++;
		//파일을 다운로드 한다.
		this.fileTrans = new FileTransfer();
		this.fileDownUrl = encodeURI(this.musicBasLink+mlink); //"1se/01c0c4606d/1se557-6e6a410.mp3");
		//다운로드한 파일의 절대경로를 구한다.
		var urlObj = $.mobile.path.parseUrl(this.fileDownUrl);
		this.fileTrans.download(this.fileDownUrl, localDownPo+urlObj.filename, function(entry){

			//alert(downMp.cuponid+"/"+downMp.songid[indx]);

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "mu", "mode=setDown&cpid="+downMp.cuponid+"&sid="+downMp.songid[indx]);  //서버에서 post 모드로 가져온다.


			if(localSys.dsu == downMp.downSu){
				alert("선택한 모든 음원의 다운로드 완료"); //endtry="+entry.toURL());
				localSys.dsu = 0;
			}

		}, function(error){

			alert("error="+error.code);

		}, false, {
			//headers:{"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="}
			}
		);

	},

	//로컬파일 삭제
	fileDel:function(fold){
		//fold ==== "mrro/voice/"

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		    fileSystem.root.getFile(fold+did, {create:false}, function(fileEntry){
		        fileEntry.remove(function(file){
		        	//appUtil.alertgo("알림","삭제완료 하였습니다.");
		        	getServ.fileList(fold, "allRecVoice");

		            console.log("File removed!");
		        },function(){
		            console.log("error deleting the file " + error.code);
		            });
		        },function(){
		            console.log("file does not exist");
		        });
		    },function(evt){
		        console.log(evt.target.error.code);
		});

	},

	fileDownBas:function(mlink, target){
        //this.musicBasLink ====  http://mroo.co.kr/mrphp/music/

        this.fileDownInf = false;
		this.fileTrans = new FileTransfer();
		this.fileDownUrl = encodeURI(mlink);
		//다운로드한 파일의 절대경로를 구한다.
		var urlObj = $.mobile.path.parseUrl(this.fileDownUrl);
		//this.fileTrans.download(this.fileDownUrl, localDownPo+urlObj.filename, function(entry){
		this.fileTrans.download(this.fileDownUrl, target, function(entry){

			//alert("downOk");
            localSys.fileDownInf = true;

		}, function(error){
			alert("error="+error.code);
		}, false, {
			//headers:{"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="}
			}
		);

	},

	thinkFileDownBas:function(mlink, target){
        //this.musicBasLink ====  http://mroo.co.kr/mrphp/music/

        this.fileDownInf = false;
		this.fileTrans = new FileTransfer();
		this.fileDownUrl = encodeURI(mlink);


		//다운로드한 파일의 절대경로를 구한다.
		var urlObj = $.mobile.path.parseUrl(this.fileDownUrl);
		this.fileTrans.download(this.fileDownUrl, target, function(entry){

            localSys.fileDownInf = true;
            //싱크파일을 읽고 출력한다.
            localSys.readThinkFile("#gasaDispUl li#gasa", "mrro/imsi/imsigasa.txt");

		}, function(error){
		    alert("싱크파일이 없습니다.");
			//alert("error="+error.code);
		}, false, {
			//headers:{"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="}
			}
		);

	},


	fileUpBas:function(fileName){  //서버로 로컬파일을 올린다.

		var flink = this.localPath+fileName;
		//===========================
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = fileName;
		var imsi = fileName.split(".");
		options.mimeType = imsi[1];


		var params = {};
		params.tgName = appBasInfo.chnSongid(mPlayer.songId)+"-Think."+imsi[1];
		params.tgPo = mPlayer.songFold;   //   music/1se/aaaaaa;
		options.params = params;

		var ft = new FileTransfer();
		ft.upload(flink, appUtil.input_smstext(LKAJAXCFILE+"uploadBasMb"), function(r){
			//성공-echo 문자를 r.response 로 텍스트값으로 리턴 한다.
			//alert(r.response);  //이미지 파일 이름리턴
			$(".loadingDiv").hide();
			if(r.response == "1"){

				appUtil.alertgo("알림","파일을 등록하였습니다.");

			}else{

				appUtil.alertgo("알림","파일등록에 실패하였습니다. 다시 시도하세요.");
			}


		}, function(e){
			$(".loadingDiv").hide();
			//실패
			//alert("error file="+e.code+"/"+e.source+"/"+e.target);

		}, options);

		//==============================

	},


	fileUp:function(md){

		var flink = this.seFileLink;
		//===========================
		var options = new FileUploadOptions();
		options.fileKey = "file";

		options.fileName = this.jarangFile;
		options.mimeType = "mp4";

		var params = {};
		params.email = meminf.email;
		params.tit = $("#tit").val();
		params.content = $("#content").val();

		options.params = params;


		//alert(options.fileName+"....."+params.memo);
		var ft = new FileTransfer();
		ft.upload(flink, appUtil.input_smstext(LKAJAXCFILE+"uploadMb"), function(r){
			//성공-echo 문자를 r.response 로 텍스트값으로 리턴 한다.
			//alert(r.response);  //이미지 파일 이름리턴
			$(".loadingDiv").hide();
			if(r.response == "1"){

				appUtil.alertgo("알림","노래자랑에 등록하였습니다.");

			}else{

				appUtil.alertgo("알림","노래자랑에 등록 실패하였습니다. 다시 시도하세요.");
			}


		}, function(e){
			$(".loadingDiv").hide();
			//실패
			//alert("error file="+e.code+"/"+e.source+"/"+e.target);

		}, options);
		//==============================



	},

	voiceDel:function(did){
		navigator.notification.confirm('삭제하시겠습니까?', function(button){
	    	if(button == 2){   //삭제취소한다.
	    		getServ.voiceDel(did);
	    	}
		}, '알림', '취소,삭제');
	},

	voicePlay:function(pid, adom){

		//녹음play
		var pp = document.getElementById(adom);
		//"file:///storage/emulated/0/mrro/1se617-382ad10.mp3"; //localPo+pid;

		var file2 = localPo+pid;
		//"file:///sdcard0/mrro/voice/"+pid;  //     file:///storage/emulated/0/mrro/voice/"
		pp.src = file2;

		//alert(localPo+"----"+file2+"//"+adom);

		setTimeout(function(){
			pp.play();
		},500);

	},

	voiceUp:function(uid){
		this.jarangFile = uid;
		this.seFileLink = localPo+uid;

		appUtil.moveOkHistory("myVoiceUp.html");

	},

	//로컬파일 리스트
	fileList:function(dir, domid){

		//로컬의 파일 리스트를 가져온다.
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fs.root.getDirectory(dir,{create:true,exclusive:false},function(dirEnt){

				//디렉토리 엔터리를 구한다.
				newDirEntry = dirEnt;
				//디렉토리의 전체경로를 구한다.
				localPo = dirEnt.toURL();
				console.log("*****path mylocal2="+localPo+"///////domid=="+domid);

			     var lists = "";
			     var entf = [];
			     var rootRead = dirEnt.createReader();
			     rootRead.readEntries(function(file){
			    	 var su = file.length;
			    	 for(var i=0; i < su; i++){
			    		 if(file[i].isFile){
			    			 entf[i] = file[i].name;
			    		 }
			    	 }

			    	 entf.sort();

			    	 for(var c=(su -1); c >= 0; c--){
			    		 lists += "<li>";
			    		 lists += "<table><tr><td><input type='checkbox' name='myLfile' id='"+entf[c]+"'></td>";
			    		 lists += "<td>"+entf[c]+"</td>";
			    		 lists += "<td onclick='localSys.voiceDel(\""+entf[c]+"\")'><i class='fa fa-trash-o'></i></td><td onclick='localSys.voicePlay(\""+entf[c]+"\", \"audioPly\")'><i class='fa fa-play'></i></td>";
			    		 lists += "<td onclick='localSys.voiceUp(\""+entf[c]+"\")'><i class='fa fa-upload'></i></td></tr></table></li>";

			    	 }

			    	 document.getElementById(domid).innerHTML = lists;

			    	 console.log("fileList end=========");

			     }, function(){

			     });

			},function(err){});

		}, function(){

		});


	},

	//로컬파일의 존재여부
	fileIsInf:function(){

		resolveLocalFileSystemURL(localPo+"record.mp4", function(entry) {
			localSys.fileEntry = entry;
			//파일이 존재한다.
		    //var nativePath = entry.toURL();
		    //console.log('Native URI: ' + nativePath);

			//파일 이름을 변경한다.
			var tt = appUtil.mkTime();

		    //alert("newdir="+newDirEntry+"/////"+localPo+"/////"+tt);

			entry.moveTo(newDirEntry, tt+".mp4", function(entry){
				appUtil.moveOkHistory("myVoice.html");
			}, function(err){

			});


		}, function(){
			//파일이 존재하지 않는다.
			//alert("not");

		});

	},


}

//=====================================================
//앱의기본정보
//=====================================================
var appBasInfo = {
	ver:"1.0",
	fnName:"kkss",
	screenH:null, //window.innerHeight;
	screenW:null,
	windowH:null, //$(window).height();
	wonsiH:null,
	wonsiW:null,
	pageTopH:null,
    deviceMD:"",
    deviceUiu:"",
	deviceCo:"",

	seJarangId:"",
	seJarangRid:0,
	seJarangImg:"",
	seJarangFnam:"",

	nowViewCo:null,   //현재 선택된 업체의 아이디
	nowPage:null,     //현재 보고 있는 페이지
	nowMainMenu:null,  //현재선택한 메인 메뉴 번호

	pageMode:"on",    //각 페이지의 등록 또는 수정 설정
	faqGab:1,

	recordInf:false,   //녹음 시작 여부

	songShowSMN:1,   //노래자랑의서버메뉴  1:best  2:new  3:list


	appBasColor:{"appBg":"#ffffff", "head":"#03d190", "gray":"#ebebeb", "grayLine":"#ebeaea"},


	wonsiInit:function(){  //load 에서 한번만 실행하여 폰의 기본 화면크기 가져온다.
		this.wonsiW = window.innerWidth;
		this.wonsiH = window.innerHeight;
		this.pageTopH = (this.wonsiH / 100) * 9;
	},

	init:function(){
		//this.beforShow() 에서 호출 한다.
		//매번 화면의 크기를 가져오고 각 페이지별 화면 디자인을 출력한다.
		this.screenW = window.innerWidth;
		this.screenH = window.innerHeight;
		this.windowH = $(window).height();



		//각 페이지별 호면의 디자인을 출력한다.
		this.design();

		$("#top100").click(function(){

			evClick.mainM(1);

		});


	},

    chnSongid:function(songid){
        var imsi = songid.split("-");

        return imsi[0];
    },


	getMainTableH:function(){   //각페이지 메인 테이블의 높이를 설정한다.
		//페이지에 있는 메인 테이블의 높이를 구한다.
		switch(this.nowPage){
		case "Fpage":


            break;
		}

	},

	design:function(){
		//각페이지별 호면의 디자인을 출력한다.
		this.getMainTableH();  //메인 테이블의 높이를 구한다.



	},


	dispTopHead:function(){
		//각 페이지의 헤드타이틀 내부의 버튼 출력
		var ull = document.querySelector(".topNBtn");
		var nodeli = ull.getElementsByTagName("li");

		nodeli[0].style.backgroundImage = "url('./images/mogcha.png')";
		nodeli[0].style.width = "13%";

		nodeli[1].style.width = "61%";
		nodeli[1].style.background = "none";

		nodeli[2].style.background - "none"; //Image = "url('./images/dotbogi.png')";  //backCrow.png
		nodeli[2].style.width = "13%";

		nodeli[3].style.backgroundImage = "url('./images/dotbogi.png')";
		nodeli[3].style.width = "13%";
	},

	//pagebeforShow함수시작
	beforShow:function(){
		//각 페이지에 따른 처리 루틴
		this.init();  //페이지 초기화


		switch(this.nowPage){
		case "Fpage":




			break;
		case "SongShow":

			//Best를 가져와서 출력한다.
			var ssv = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			ssv.basServer(ssv, "mu", "mode=songBest&email="+meminf.email);  //서버에서 post 모드로 가져온다.


			//new를 가져와서 출력한다.
			var ssvn = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			ssvn.basServer(ssvn, "mu", "mode=songNew&email="+meminf.email);  //서버에서 post 모드로 가져온다.



			break;
		case "JarangSS":

			$(".jarangSS").css({"background-image":'url('+appBasInfo.seJarangImg+')'});


			var ll = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			ll.basServer(ll, "mu", "mode=likeSu&jid="+appBasInfo.seJarangRid);  //서버에서 post 모드로 가져온다.

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "mu", "mode=getAllJrDet&jid="+appBasInfo.seJarangRid);  //서버에서 post 모드로 가져온다.


			audiogo.init("audioPly", UPVOICE, appBasInfo.seJarangFnam, "pro");



			break;
		case "Join":
			meminf.reEmail = "";
			meminf.reEmailInf = false;

			break;
		case "Setup":

			$("#myEmail").html(meminf.email);
			$("#appVer").html("v"+appBasInfo.ver);

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "myDeviceTbSetup", "mode=myDevice&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			//구매요금제를 출력한다.
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "setupTBCP", "mode=gumeyg&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;
		case "SetupDevice":
			$("#nowDevice").html(this.deviceCo+appBasInfo.deviceMD);

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "myDeviceTb", "mode=myDevice&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;
		case "DownMp3":
			music1cha.oldId = null;
			music1cha.openInf = false;
			//구매요금제를 출력한다.
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "gumeCPListD", "mode=downmp&email="+meminf.email);  //서버에서 post 모드로 가져온다.


			getServ = new GetServer();
			getServ.initParam("getMrAll.php", "mode=allMusic&find=", "allMusicDW");
			getServ.getPostMode();


			break;
		case "Myalbum":

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "myalbumListUL", "mode=getMyAlbumAllUl&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;
		case "AlbumAnz":

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "albumAll", "mode=getMyAlbumAll&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;

		case "BestJarang":

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "bestJarangAll", "mode=getJarangBest&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;

		case "NewJarang":

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "newJarangAll", "mode=getJarangNew&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;

		case "MyJarang":

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "myJarangAll", "mode=getMyJarangAll&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;
		case "MyVoice":   //나의 녹음리스트

			localSys.fileList("mrro/voice", "allRecVoice")

			break;
		case "Gume":

			//구매요금제를 출력한다.
			getServ = new GetServer();
			getServ.basServer(getServ, "gumeCPList", "mode=gumeyg&email="+meminf.email);  //서버에서 post 모드로 가져온다.


			//구매내역 출력
			getServ = new GetServer();
			getServ.basServer(getServ, "gumeMpList", "mode=gumeMpList&email="+meminf.email);  //서버에서 post 모드로 가져온다.


			//내가 등록한 모든 앨범명을 가져온다.
			var gg = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			gg.basServer(gg, "popupMenu", "mode=getMyAlbumAll&email="+meminf.email);  //서버에서 post 모드로 가져온다.

			break;
		case "FAQ":

			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "Faq", "mode=getFaq&gubun="+appBasInfo.faqGab);  //서버에서 post 모드로 가져온다.

			break;
		case "JumunList":   //나의 주문내역 출력
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "jumunListId", "mode=myJumunList&email="+window.localStorage.getItem("email"));  //서버에서 post 모드로 가져온다.

			break;
		case "Jumungo":
			//alert("jjj=="+jumunInfo.jenre["동요"]);
			jumunInfo.dispDon("jlDon", "jlgubun");

			break;
		case "Myquestion":
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "myJumunAll", "mode=getMyJumun&email="+window.localStorage.getItem("email"));  //서버에서 post 모드로 가져온다.

			break;
		case "MPlay":

			$("#playBGScroll").html(music1cha.gasa);


			break;
		}





		//페이지를끌어 온다.
		$("#getLoginPage, #getHomePage, #getJumun, #goQuestion").click(function(){

			appUtil.closePannel();

			switch(this.id){
			case "getLoginPage":
				proPage.loadPage(loginPage);
				break;
			case "getHomePage":
				proPage.loadPage(mainPage);
				break;
			case "getJumun":
				proPage.loadPage(Jumun);
				break;
			case "goQuestion":   //간단문의
				appBasInfo.pageMode = "on";

				proPage.loadPage(Question);

				break;
			}

		});





		$("#deviceOn").click(function(){
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "mu", "mode=deviceOnPro&email="+meminf.email+"&cosa="+appBasInfo.deviceCo+"&phmd="+appBasInfo.deviceMD+"&uiu="+appBasInfo.deviceUiu);  //서버에서 post 모드로 가져온다.
		});


		$("#couponBuyGo").click(function(){
			appUtil.moveOkHistory("cuponbuy.html");
		});

		$("#faqSe, #jlgubun").change(function(){

			switch(this.id){
			case "faqSe":
				appBasInfo.faqGab = $("#"+this.id).val();
				getServ = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				getServ.basServer(getServ, "Faq", "mode=getFaq&gubun="+appBasInfo.faqGab);  //서버에서 post 모드로 가져온다.
				break;
			case "jlgubun":

				jumunInfo.dispDon("jlDon", this.id);

				break;
			}

		});


		//등록 또는 수정모드 설정
		$("#joinOn, #joinEdit, #mypageGo, #onNchange, #mp3Down, #dwfindbt, #albumAdd, #albumAddPro, #voiceUpGo, #termsJ, #privacyJ").click(function(){

			switch(this.id){
			case "joinOn":
				appBasInfo.pageMode = "on";
				break;
			case "privacyJ":
				document.getElementById("joinOkGo").focus();

				break;
			case "termsJ":

				document.getElementById("privacyJ").focus();

				break;
			case "voiceUpGo":

				var el = frmPro.forminput("myVoiceUpForm");
				if(frmPro.formInf){

					localSys.fileUp("on");

				}
				return false;

				break;
			case "albumAdd":
				appUtil.moveOkHistory("albumAnz.html");

				break;
			case "joinEdit":
				appBasInfo.pageMode = "edit";
				break;
			case "mypageGo":
				appBasInfo.pageMode = "edit";
				appUtil.moveOkHistory("join.html");
				break;
			case "onNchange":
				appUtil.moveOkHistory("setupDevice.html");
				break;
			case "mp3Down":
				appUtil.moveOkHistory("downMp3.html");
				break;
			case "albumAddPro":

				var el = frmPro.forminput("albumOnF");
				if(frmPro.formInf){
					var gs1 = new GetServer();
					//서버에서 선택한 사업의 대상자를 가져온다.
					gs1.basServer(gs1, "mu", "mode=albumAddPro&email="+meminf.email+"&"+el);  //서버에서 post 모드로 가져온다.
				}
				return false;

				break;
			case "dwfindbt":
				music1cha.openInf = false;
				music1cha.oldId = null;
				document.getElementById("audioPly").src = "";   //초기화


				//다운로드 음원 검색
				getServ = new GetServer();
				//alert("kkk"+$("#dwfind").val())
				getServ.initParam("getMrAll.php", "mode=allMusic&find="+encodeURIComponent($("#dwfind").val()), "allMusicDW");
				getServ.getPostMode();

				break;
			}

		});




		$("#jarangDetBtn").click(function(){

			$("#idgab").val(appBasInfo.seJarangRid);


			var el = frmPro.forminput("jrDet");
			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=jrDet&email="+meminf.email+"&"+el);  //서버에서 post 모드로 가져온다.
			}
			return false;

		});

		$("#munBtn").click(function(){

			var el = frmPro.forminput("gdMun");
			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=munOnput&email="+window.localStorage.getItem("email")+"&"+el);  //서버에서 post 모드로 가져온다.
			}
			return false;

		});


		$("#songShowBest").click(function(){

			appBasInfo.songShowSMN = 1;
			//alert("kkkkksss");
			appUtil.moveOkHistory("bestJarang.html");
		});

		$("#songShowNew").click(function(){
			appBasInfo.songShowSMN = 2;

			appUtil.moveOkHistory("newJarang.html");
		});


		$("#jumunSendNext").click(function(){

			appUtil.moveOkHistory("jumungo.html");
		});

		$("#jumunComOn").click(function(){

			var el = frmPro.forminput("jumungoF");
			if(frmPro.formInf){
				var gs1 = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				gs1.basServer(gs1, "mu", "mode=jumunComOn&"+el);  //서버에서 post 모드로 가져온다.
			}
			return false;

		});


		$("#gume24, #gume10, #gume30, #gume50").click(function(){
			//alert(this.id);

			var tt = "";
			var indx = 1;
			switch(this.id){
			case "gume24":
				indx = 1;
				tt = cuponInfo.cuponArry[1];
				break;
			case "gume10":
				indx = 2;
				tt = cuponInfo.cuponArry[2];
				break;
			case "gume30":
				indx = 3;
				tt = cuponInfo.cuponArry[3];
				break;
			case "gume50":
				indx = 4;
				tt = cuponInfo.cuponArry[4];
				break;
			}


			navigator.notification.confirm(tt+" 쿠폰 구매하시겠습니까 ?", function(button){
		    	if(button == 2){   //구매한다.
                    cuponInfo.gubun = indx;
                    cuponInfo.don = cuponInfo.cuponDon[indx];
                    cuponInfo.email = meminf.email;
                    cuponInfo.tit = tt;

    				var gs1 = new GetServer();
    				//서버에서 선택한 사업의 대상자를 가져온다.
    				gs1.basServer(gs1, "mu", "mode=cuponGume&gubun="+indx+"&don="+cuponInfo.don+"&email="+meminf.email+"&tit="+tt+"&daysu="+cuponInfo.daysu);  //서버에서 post 모드로 가져온다.
		    	}
			}, '알림', '취소,확인');

		});


	},

	//pageShow함수시작==========
	pageShow:function(){



	},
	pageHide:function(){

		switch(this.nowPage){
		case "page":



			break;
		}

	},
	pageCreate:function(){



		switch(this.nowPage){
		case "Terms":          //약관보기
			var incom = document.getElementById("wrapper1");
			incom.innerHTML = meminfCont1.replace(/\n/gi,"<br>");

			var incom2 = document.getElementById("wrapper2");
			incom2.innerHTML = meminfoCont2.replace(/\n/gi,"<br>");

			var incom3 = document.getElementById("wrapper3");
			incom3.innerHTML = meminfoCont3.replace(/\n/gi,"<br>");

			var incom4 = document.getElementById("wrapper4");
			incom4.innerHTML = meminfoCont4.replace(/\n/gi,"<br>");

			$(function(){
			    $('#wrapper1').slimScroll({
			        height: '200px'
			    });

			    $('#wrapper2').slimScroll({
			        height: '200px'
			    });

			    $('#wrapper3').slimScroll({
			        height: '200px'
			    });

			    $('#wrapper4').slimScroll({
			        height: '200px'
			    });

			});

			break;
		}


	}

}


//===================================================================================



	//++++++++++++++++++++++++++++++++++++++++++++
    //기타 함수들
    //++++++++++++++++++++++++++++++++++++++++++++
	//메세지 전송 관련 글자 입력
	function input_smstext(str,tsu){
		var ss = encodeURI(str);
		var rst = encodeURI(ss);
		return rst;
	}


	//모든 내용 출력
	function disp_smstext(str,tsu){

		//alert("str="+str);
		var aa = str.replaceAll("%0A", "<br />");

		//alert(aa);

		return decodeURI(aa);
	}


	function toggleCls(domid, classNam){
	    $("#"+domid).toggleClass(classNam);

	}


	//html 소스 가져오기+++++++++++++++++++++++++++++++++++++
	function httpGet(szURL){

		sHttp.open("get",szURL,false);
		sHttp.setRequestHeader("Content-type:","application/s-www-form-urlencoded");
		sHttp.setRequestHeader("Content-Encoding:","utf-8");
		sHttp.onreadystatechange = onRetriveComplete;

		try{
			sHttp.send("code=tnt2");

		}catch(e){
			return("Not Exist");
		}

		if(sHttp.status > 200){
			return("Not Exist<br>");
		}else{




			return(sHttp.responseText);
		}

		function onRetriveComplete(){

			sHttp.onreadystatechange = noop;
			if(sHttp.readyState == 4){

			}
		}
	}

	function networkInf(){
		//conType = navigator.network.connection.type;
		if(resumeInf){
			resumeInf = false;
			setTimeout("networkInf()", 3000);

		}else{
			var rmg = window.sessionStorage.getItem("roming");
			if(rmg == true){
				//alert("hhhhh");
				//해외 로밍을 사용 중이다.
				if(conType != "wifi"){
					alertgo("알림","해외에서 3G 또는 4G로 접속은 불가능 합니다.");
					setTimeout("messageClose(2)", 3000);
				}

			}else{
				//alert("not roming="+window.sessionStorage.getItem("nara")+"/"+conType);
				if(conType != "4G" && conType != "4g" && conType != "3G" && conType != "3g" && (conType == "r" || conType == "R")){
					//해외 모드

					if(conType != "wifi"){
						alertgo("알림","해외에서 3G 또는 4G로 접속은 불가능 합니다.");
						setTimeout("messageClose(2)", 3000);
					}else{
						//비행기 보드 확인
						if(window.sessionStorage.getItem("aplinf") == "on"){

							navigator.notification.confirm('비행기 탑승모드 사용불가, 모드변경할까요?. 취소하면 앱을 종료합니다.', function(button){
						    	if(button == 2){   //확인
						    		messageClose(1);
						    	}else{
						    		if(navigator.network.connection.type == "none") messageClose(2);
						    	}
						    }, '질문', '취소,확인');

						}
					}

				}else{
					//한국 국내 사용 이다.
					var lteinf = false;
					//네트워크 상태에 변동이 생겼다.-처음 실행할때 또는 변동이 생긴 경
					//alert(conType+"/"+conTypeOld);
					if(conType != conTypeOld){  //------------------------
						conTypeOld = conType;
						if(conType == "none"){

							navigator.notification.confirm('네트워크 연결 변경하세요. 취소하면 앱을 종료합니다.', function(button){
						    	if(button == 2){   //확인
						    		messageClose(1);
						    	}else{
						    		if(navigator.network.connection.type == "none") messageClose(2);
						    	}
						    }, '질문', '취소,확인');

						}else{
							if(conType != "wifi"){
								lteinf = true;
							}else{
								//와이파이 상태 이다.
								//비행기 보드 확인
								if(window.sessionStorage.getItem("aplinf") == "on"){

									navigator.notification.confirm('비행기 탑승모드에서 사용불가, 모드변경할까요? 취소하면 앱을 종료합니다.', function(button){
								    	if(button == 2){   //확인
								    		messageClose(1);
								    	}else{
								    		messageClose(2);
								    	}
								    }, '질문', '취소,확인');


								}
							}
						}
					}else{  //--------------------------------------
						if(conType == "none"){

							navigator.notification.confirm('네트워크 연결 변경하세요. 취소하면 앱을 종료합니다.', function(button){
						    	if(button == 2){   //확인
						    		messageClose(1);
						    	}else{
						    		if(navigator.network.connection.type == "none") messageClose(2);
						    	}
						    }, '질문', '취소,확인');

						}else{
							if(conType != "wifi"){
								lteinf = true;
							}else{
								//와이파이 상태 이다.
								//비행기 보드 확인
								if(window.sessionStorage.getItem("aplinf") == "on"){
									navigator.notification.confirm('비행기 탑승모드에서 사용불가, 모드변경할까요? 취소하면 앱을 종료합니다.', function(button){
								    	if(button == 2){   //확인
								    		messageClose(1);
								    	}else{
								    		messageClose(2);
								    	}
								    }, '질문', '취소,확인');

								}
							}
						}
					}  //---------------------------

					if(lteinf && conType != "none" && window.sessionStorage.getItem("wifiinf") == "init"){
						navigator.notification.confirm('데이터요금이 발생 할 수 있습니다. Wifi로 전환하시겠습니까?', function(button){
					    	if(button == 2){   //삭제한다.
					    		messageClose(1);
					    	}
					    }, '질문', '취소,확인');
						window.sessionStorage.setItem("wifiinf", "ok");

					}else{
					}

				}
			}

		}

	}



    function messageClose(mode){

        switch(mode){
        case 1:   //무선데이트 설

            window.netcon("gogo", function(echoValue) {
                //alert("rs=");
                ////console.log(JSON.stringify(echoValue));
             });


        break;
        case 2:   //무선데이트 닫기
            //$("#network3g4g").popup("close");

            exitApp();

            break;
        }

    }


	function makeFold(FileSys){
		//녹음된 파일을 실제로 저장하는 경로
		FileSys.root.getDirectory("mrro",{create:true ,exclusive:false},function (directoryEntry){
			FileSys.root.getDirectory("mrro/voice",{create:true ,exclusive:false},function (directoryEntry){
				newDirEntry = directoryEntry;
				//디렉토리의 전체경로를 구한다.
				localPo = directoryEntry.toURL();
			}, function (error){});
		}, function (FileError){
			console.log("window.requestFileSystem====="+FileError.code);
		});
	}

	function makeFoldDown(FileSys){
		//녹음된 파일을 실제로 저장하는 경로
		FileSys.root.getDirectory("mrro",{create:true ,exclusive:false},function (directoryEntry){
			FileSys.root.getDirectory("mrro/.down",{create:true ,exclusive:false},function (directoryEntry){
				newDirEntry = directoryEntry;
				//디렉토리의 전체경로를 구한다.
				localDownPo = directoryEntry.toURL();
			}, function (error){});
		}, function (FileError){
			console.log("window.requestFileSystem====="+FileError.code);
		});
	}


//=====================================================
//알림 처리
//=====================================================
var proMsg = {

    endMsgText:"lll",

    onBackKeyDownMsg:function(button){
        if(button == 2) {     //종료한다.
    	    	exitApp();
    	}
    },

    goLogin:function(button){
        if(button == 2) {     //로그인 페이지로 간다.
    	    proPage.loadPage(loginPage);
    	}
    },



}


//=====================================================
//변수 사용
//=====================================================
var meminf = new parMem();
var naraNew = new seNara();
var lngTxt = naraNew.chanenara(1);  //국가언어 선택
//=====================================================