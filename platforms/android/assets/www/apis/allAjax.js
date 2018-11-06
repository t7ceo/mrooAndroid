//======================================
//////SERVER 처리//////////////////////
//======================================
/*
var el = frmPro.forminput("loginForm");
if(frmPro.formInf){
	var gs1 = new GetServer();
	//서버에서 선택한 사업의 대상자를 가져온다.
	gs1.basServer(gs1, "mu", "mode=login&"+el);  //서버에서 post 모드로 가져온다.
}
*/
//var gs1 = new GetServer();
//서버에서 선택한 사업의 대상자를 가져온다.
//gs1.basServer(gs1, "mu", {mode:"pushGet", uiu:device.uuid});  //서버에서 post 모드로 가져온다.
//서버에서 정보를 가져온다.   //uws64-181.cafe24.com/WebMysql      id:pigg1234,    pass:soho7273
//============================================================
//ajax의 시작과 끝에 처리할 내용을 여기 기술
//imsiSv, imsiDom, imsiGab
//beforeSend:ajaxBeforeSend, complete:ajaxComplete,
function ajaxBeforeSend(e, xhr, obj){
	//alert("ofset=="+$("#"+appBasInfo.nowPage).offset().top);
	$(".loadingDiv").show();
	ajaxing = true;
	
	switch(appBasInfo.nowPage){
	case "page":
		
		break;
	}
	
}
//---------------------------------------------------------------------------------
function ajaxComplete(e, xhr, obj){

    $(".contentLoading").hide();

	//alert("npage=="+appBasInfo.nowPage+"/"+e);
	ajaxing = false;
	var mode = modeGet(this.data);
	//alert("ddd=="+mode+"//"+this.data);

	
	setTimeout(function(){
		$(".loadingDiv").hide();
	},1500);
	
}
function ajaxError(xhr,status,error){
    $(".contentLoading").hide();
	alert("ajax err=="+error+"/"+status+"/"+xhr);
	$(".loadingDiv").hide();
}
//=======================================================================================
//모드값을 추출 한다.
function modeGet(pr){
	var prr = pr.split("&")
	var md = prr[0].split("=");
	return md[1];
}
//성공시 페이지별 처리========================================================================
function ajaxSuccess(data, status, xhr){
	var mode = modeGet(this.data);  //mode=...... 값으로 구분한다.
	if(mode == "getTel"){
		//
		meminf.tel = data.rs.phonum;

		return;
	}
	
	if(mode == "autoLogin"){
		//로그인 성공
		if(data.su > 0) evClick.login(data);
		
		return;
	}
	
	//alert("ajax==="+appBasInfo.nowPage);
	switch(appBasInfo.nowPage){
	case "Fpage":

        dispTabData(data);

		switch(proPage.pageId){
		case "Jumun":
			

			
			break;
		case "loginPage":

			switch(mode){
			case "login":
				if(data.su > 0){
					//로그인 성공
					evClick.login(data);
					
				}else{
					//로그인 실패
					evClick.logout();
					
				}
				
				appUtil.pagemovePro(meminf.loginStat, "go", mode, 0, 0, 0);
				break;
			}
			
			break;
		case "joinPage":

            if(mode == "joinedit"){
                //원본값을 가져와서 뿌린다.
                frmPro.formEditGab("joinOkForm", "join", data);

            }else if(mode == "findReEmail"){

                if(data.su > 0){ //이미등록된 이메일 이다.

                    meminf.reEmail = "";
                    meminf.reEmailInf = false;
                    appUtil.alertgo(lngTxt.alerttit, lngTxt.reEmailNo);
                    document.getElementById("emailJ").focus();

                }else{  //중복확인 완료

                    meminf.reEmail = $("#emailJ").val();
                    meminf.reEmailInf = true;
                    appUtil.alertgo(lngTxt.alerttit, lngTxt.reEmailUse);

                }

            }else{
                //회원가입 또는 수정 처리 결과
                if(data.rs == "two"){
                    appUtil.alertgo(lngTxt.alerttit, lngTxt.jointow);
                }else{
                    if(data.rs == 0){
                        appUtil.alertgo(lngTxt.alerttit, lngTxt.joinErr);
                    }else{
                        if($("#idmdJ").val() == "on"){
                            appUtil.alertgo(lngTxt.alerttit, lngTxt.joinOk);
                            appUtil.moveOkHistory("index.html#Login");
                        }else{
                            appUtil.alertgo(lngTxt.alerttit, lngTxt.joinEditOk);
                        }
                    }
                }
            }
            break;
            }

		
		break;
	case "SongShow":
		
		var ss = "";
		if(mode == "songBest"){
			
		    for(var c=1; c <= data.length; c++){
		    	$("#img1"+c+" p").html(data[c-1].tit).prop("id",data[c-1].id+"-"+data[c-1].fname);
		    }
			
		}else if(mode == "songNew"){
			
		    for(var c=1; c <= data.length; c++){
		    	$("#img2"+c+" p").html(data[c-1].tit).prop("id",data[c-1].id+"-"+data[c-1].fname);
		    }
			
		}
		
	break;
	case "JarangSS":
		if(mode == "likeSu"){
			
			$("span.likeSu").html(data.rs);
			
		}else if(mode == "likeOn"){
			
			$("span.likeSu").html(data.rs);
			
		}else if(mode == "jrDet"){
			
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "mu", "mode=getAllJrDet&jid="+appBasInfo.seJarangRid);  //서버에서 post 모드로 가져온다.	
			
		}else{
	        var ss = "";
	        for(var c=0; c < data.length; c++){
	        	ss += "<li>";
	        	ss += "<table><tr><td><img src='./images/txtface.png'></td><td>";
	        	ss += "<p><span>"+data[c].email+" "+data[c].onday+"</span></p>";
	        	ss += "<div>"+data[c].jrText+"</div></td></tr></table>";
	        	ss += "</li>";
	        }
	        
	        $("#allJarangList").html(ss);
		}
	        
		break;
	case "JumunList":
		
        var ss = "";
        for(var c=0; c < data.length; c++){
        	ss += '<li id="jumun'+c+'" onclick="evClick.jumunListV(this)">';
        	ss += '<div>'+data[c].onday+'&nbsp;&nbsp;&nbsp;&nbsp;주문내역 '+(c+1)+'<img src="./images/downC.png"></div>';
        	ss += '<table><tr><td>'+data[c].jlgubun+'</td><td>'+data[c].don+'원</td></tr>';
        	ss += '<tr><td>곡명</td><td>'+data[c].song+'</td></tr>';
        	ss += '<tr><td>아티스트</td><td>'+data[c].gasu+'</td></tr>';
        	ss += '<tr><td>키조절</td><td>'+data[c].keymemo+'</td></tr>';
        	ss += '<tr><td>요청사항</td><td>'+data[c].jumunmemo+'</td></tr>';
        	ss += '<tr><td>현재상태</td><td>'+data[c].stat+'</td></tr></table>';
        	ss += "</li>";
        }
        
        $(getServ.dispDom).html(ss);
		
		break;
	case "Jumungo":
		
		if(data.rs > 0){
			appUtil.alertgo(lngTxt.alerttit, lngTxt.jumunOk);
			appUtil.moveNoHistory("jumunList.html");
		}else{
			
		}
		
		break;
	case "Setup":
		
		if(mode == "myDevice"){
			//등록된 장비를 뿌린다.
	        var ss = "";
	        if(data.length > 0){
	            for(var c=0; c < data.length; c++){
	            	ss = '<tr><td>'+data[c].cosa+data[c].device+'</td><td><span></span></td></tr>';
	            	$("#myDeviceTbSetup").append(ss);
	            }        	
	        }else{
	        	ss += '<tr><td>등록된 기기 없음</td><td><span></span></td></tr>';
	        	$("#myDeviceTbSetup").append(ss);
	        }
	        
		}else{
			//쿠폰 결재내역을 뿌린다.
	        var ss = "";
	        if(data.length > 0){
	            for(var c=0; c < data.length; c++){
	            	ss = '<tr><td>'+data[c].tit+'(매월)</td><td><span>'+data[c].onday+'</span></td></tr>';
	            	$(getServ.dispDom).append(ss);
	            }        	
	        }else{
	        	ss += '<tr><td>보유한 이용권 없음</td><td><span></span></td></tr>';
	        	$(getServ.dispDom).append(ss);
	        }
		}
		
		break;
	case "SetupDevice":
		
			if(mode == "deviceOnPro"){
				if(data.rs > 0){
					appUtil.alertgo(lngTxt.alerttit, lngTxt.deviceok);
					
					getServ = new GetServer();
					//서버에서 선택한 사업의 대상자를 가져온다.
					getServ.basServer(getServ, "myDeviceTb", "mode=myDevice&email="+meminf.email);  //서버에서 post 모드로 가져온다.				
				}else{
					
				}
			}else{
				//등록된 장비를 뿌린다.
		        var ss = "";
		        if(data.length > 0){
		            for(var c=0; c < data.length; c++){
		            	ss += '<tr><td>'+data[c].cosa+data[c].device+'</td><td><span>X</span></td></tr>';
		            }        	
		        }else{
		        	ss += '<tr><td>등록된 기기 없음</td><td><span></span></td></tr>';
		        }
		        
		        $(getServ.dispDom).html(ss);
			}
					
		break;
	case "DownMp3":
		
		var ss = "";
		$("#gumeCPListD").html(ss);
		
        //alert("kkk=="+data.id+"/"+data.length);
		if(mode == "setDown"){
			if(data.id == "not"){
				appUtil.alertgo(lngTxt.alerttit, lngTxt.setDownErr);
				return;
			}else{
				if(data.id < 1){
					appUtil.alertgo(lngTxt.alerttit, lngTxt.setDownErr);
					return;
				}else{
					//구매요금제를 출력한다.
					getServ = new GetServer();
					//서버에서 선택한 사업의 대상자를 가져온다.
					getServ.basServer(getServ, "gumeCPListD", "mode=downmp&email="+meminf.email);  //서버에서 post 모드로 가져온다.
					return;
				}
			}
		}else{
			
			var allsu = 0;
			if(data.id == 0){
				ss += "<div class='notCupon'>사용가능한 이용권이 없습니다.</div>";
				$("#gumeCPListD").append(ss);
			}else{
				var noSu = 0;
				for(var c = 0; c < data.length; c++){
					allsu += Number(data[c].jansu);
					var cls = data[c].gubun;
					ss = '<table class="'+cuponInfo.cuponClass[cls]+'">';
					
					//alert(data[c].id);
					
					if(Number(data[c].stat) == 2){   //사용중
		 				ss += '<tr><td class="topcp">&nbsp;&nbsp;&nbsp;'+data[c].tit+" ( 사용중 )</td></tr>";
						ss += '<tr><td><ul class="downUL"><li>잔여 다운로드 : '+data[c].jansu+' (곡)</li><li></li><li id="mp3down'+c+'" onclick="evClick.mp3Down(this, '+data[c].id+')">다운로드</li></ul></td></tr></table>';					
					}else{  //사용전 또는 만료
						noSu += Number(data[c].jansu);
						
						var tt = "";
						var bt = "";
						switch(Number(data[c].stat)){
						case 1:  //사용전 
							tt = " ( 사용전 : 구매내역->사용 )";
							bt = "사용불가";
							break;
						case 3:  //사용완료
							tt = " ( 사용완료 )";
							bt = "사용불가";
							break;
						case 4:  //유효기간 경과
							tt = " ( 유효기간 경과 )";
							bt = "사용불가";
							break;
						}
		 				ss += '<tr><td class="topcp">&nbsp;&nbsp;&nbsp;'+data[c].tit+tt+"</td></tr>";
						ss += '<tr><td><ul class="downUL"><li>잔여 다운로드 : '+data[c].jansu+' (곡)</li><li></li><li id="mp3down'+c+'" onclick="evClick.noUserMsg('+Number(data[c].stat)+')">'+bt+'</li></ul></td></tr></table>';
					}
					
					
					$("#gumeCPListD").append(ss);
				}
				
			}
			cuponInfo.allSu = allsu - noSu;
			
		}
				
		downMp.checkSu("mp3downform");
		
		break;
	case "Myalbum":
		
		
		$("#myalbumListUL").html("");
		var ll = 0;
		ss = "";
        for(var c=0; c < data.rs.length; c++){
        	if(ll != data.rs[c].gubun){
        		
        		if(c > 0){
                	if(ll != data.rs[c].gubun){
                		ss += '</table></li>';
                	}
        		}
        		
        		ss += '<li id="jumun'+c+'" style="padding:0 2%;" onclick="evClick.jumunListV(this)">';
        		ss += '<div style="padding:10px 0 8px;">'+data.rs[c].albumtit+' <img src="./images/downC.png"></div>';
        		ss += '<table style="width:100%;">';
        	}
            	ss += '<tr><td style="border-bottom:#dedede 1px solid; width:200px;">'+data.rs[c].tit+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
            	ss += '<td style="width:30%;border-bottom:#dedede 1px solid;" onclick="evClick.albumPlay(\''+data.rs[c].fdir+"/"+data.rs[c].songid+data.rs[c].endfix+'\')"><i class="fa fa-play fa-4px"></i></td></tr>';
        	
        	ll = data.rs[c].gubun;
        	
		}
        ss += '</table></li>';
        
        
        $("#myalbumListUL").html(ss);
        
		break;
	case "MyJarang":
		
		ss = "";
        for(var c=0; c < data.length; c++){
		ss += "<li>";
		ss += "<table><tr><td><input type='checkbox' name='myLfile'></td>";
		ss += "<td>"+data[c].tit+"</td>";
		ss += "<td onclick='evClick.myRecPlay(\""+data[c].fname+"\")'><i class='fa fa-play'></i></td></tr></table></li>";
        }
        $("#myJarangAll").html(ss);
        
        
		break;
	case "BestJarang":
		
		ss = "";
		var cc = 1;
        for(var c=0; c < data.length; c++){
        	if(cc == 1) ss += "<tr>";
        	else if(cc == 3){
        		cc = 1;
        		ss += "</tr><tr>";
        	}
		    ss += "<td style='height:130px;' onclick='evClick.myRecPlay(\""+data[c].fname+"\")'><div class='boxbd'>"+data[c].tit+"</div></td>";
		
		    if(c == (data.length -1) && cc == 1){
			    ss += "<td></td>";
		    }
		    cc++;
        }
        ss += "</tr>";
        
        $("#bestJarangDisp").html(ss);
        
		break;
	case "NewJarang":
		
		ss = "";
		var cc = 1;
        for(var c=0; c < data.length; c++){
        	if(cc == 1) ss += "<tr>";
        	else if(cc == 3){
        		cc = 1;
        		ss += "</tr><tr>";
        	}
		    ss += "<td style='height:130px;' onclick='evClick.myRecPlay(\""+data[c].fname+"\")'><div class='boxbd'>"+data[c].tit+"</div></td>";
		
		    if(c == (data.length -1) && cc == 1){
			    ss += "<td></td>";
		    }
		    cc++;
        }
        ss += "</tr>";
        
        $("#newJarangDisp").html(ss);
        
		break;
	case "AlbumAnz":
		
		if(mode == "albumAddPro"){
			if(data.id == "re"){
				appUtil.alertgo(lngTxt.alerttit, lngTxt.albumanzRe);
			}else{
				if(data.id > 0){
					appUtil.alertgo(lngTxt.alerttit, lngTxt.albumanzOk);
					
					getServ = new GetServer();
					//서버에서 선택한 사업의 대상자를 가져온다.
					getServ.basServer(getServ, "albumAll", "mode=getMyAlbumAll&email="+meminf.email);  //서버에서 post 모드로 가져온다.				
					
				}else{
					appUtil.alertgo(lngTxt.alerttit, lngTxt.albumanzErr);
				}
			}
		}else if(mode == "albumDel"){
			
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "albumAll", "mode=getMyAlbumAll&email="+meminf.email);  //서버에서 post 모드로 가져온다.				
		
		}else if(mode == "albumEdit"){
			getServ = new GetServer();
			//서버에서 선택한 사업의 대상자를 가져온다.
			getServ.basServer(getServ, "albumAll", "mode=getMyAlbumAll&email="+meminf.email);  //서버에서 post 모드로 가져온다.				
		
		}else{
			
			$("#albumAll").html("");
	        for(var c=0; c < data.length; c++){
	        	ss = '<li id="jumun"'+c+'>';
	        	ss += '<table class="gumeMpTb"><tr><td style="border:none;"><i class="fa fa-dot-circle-o"></i></td><td style="border:none;">';
	        	ss += '<input type="text" name="albumTit'+c+'" id="albumTit'+c+'" value="'+data[c].tit+'"></td>';
	        	ss += '<td><i class="fa fa-pencil-square-o" onclick="evClick.albumEdit('+data[c].id+', '+c+')"></i>&nbsp;&nbsp;</td>';
	        	ss += '<td>&nbsp;&nbsp;<i class="fa fa-trash-o" onclick="evClick.albumDel('+data[c].id+')"></i>&nbsp;&nbsp;</td></tr></table>';
	        	ss += '</li>';
	        	
		        $("#albumAll").append(ss);
    		}
			
		}
		
		break;
	case "Gume":
		
		var ss = "";
		
		if(mode == "cuponUser"){
			
			if(data.id > 0){
				//구매요금제를 출력한다.
				getServ = new GetServer();
				//서버에서 선택한 사업의 대상자를 가져온다.
				getServ.basServer(getServ, "gumeCPList", "mode=gumeyg&email="+meminf.email);  //서버에서 post 모드로 가져온다.	
			}else{

			}
			
		}else if(mode == "gumeMpList"){   //mp3 다운로드 리스트
			
			$("#gumeMpListUl").html("");
	        for(var c=0; c < data.length; c++){
	        	ss = '<li id="jumun"'+c+'>';
	        	ss += '<table><tr><td>';
	        	ss += '<input type="checkbox" name="mpdwList" id="'+data[c].songid+'"></td><td>'+data[c].mptit+" "+data[c].prefix+'<br />';
	        	ss += '<span>down : '+data[c].downday+'</span></td>';
	        	ss += '<td><a href="#" class="nButton" onclick="evClick.playMpDown(\''+data[c].fdir+'/'+data[c].songid+data[c].endfix+'\')"><i class="fa fa-play"></i></a></td></tr></table>';
	        	//ss += '<td><button onclick="evClick.playMpDown(\''+data[c].fdir+'/'+data[c].songid+data[c].endfix+'\')">듣기</button></td></tr></table>';
	        	ss += '</li>';
	        	
		        $("#gumeMpListUl").append(ss);
	        }
	        
		}else if(mode == "getMyAlbumAll"){
			
			ss = '<li data-role="list-divider">앨범을 선택하세요.</li>';
			$("#popupMenu").html(ss);
	        for(var c=0; c < data.length; c++){
	        	ss = '<li>';
	        	ss += '<a href="#" id="'+data[c].id+'" onclick="evClick.seAlbum(this)">'+data[c].tit+'</a></li>';
	        	
		        $("#popupMenu").append(ss);
	        }
	        $("#popupMenu").listview().listview("refresh");
	        
		}else if(mode == "seAlbumSet"){
			
			$("#popupMenu").popup("close");
			
			alert("완료하였습니다.");
			
			
		}else{
			
			$("#gumeCPList").html(ss);   //구매한 쿠폰리스트
			
			for(var c = 0; c < data.length; c++){
				var cls = data[c].gubun;
				var tt = "."
				switch(Number(data[c].stat)){
				case 1:  //사용전
					tt = " ( 사용전 )";
					break;
				case 2:   //사용중 
					tt = " ( 사용중 )";
					break;
				case 3:   //사용완료 
					tt = " ( 사용완료 )";
					break;
				case 4:
					tt = " ( 유효기간 경과 )";
					break;  //유효기간 종료
				}
				
				ss = '<table class="'+cuponInfo.cuponClass[cls]+'">';
				
				if(cls == 1){
					//24시간 스트리밍 
					ss += '<tr><td class="topcp">&nbsp;&nbsp;&nbsp;'+data[c].tit+tt+" - 계약기간 전체</td></tr>";
				}else{
					ss += '<tr><td class="topcp">&nbsp;&nbsp;&nbsp;'+data[c].tit+tt+" - 잔여곡 : "+data[c].jansu+" (곡)</td></tr>";
				}
				
			    if(data[c].stat == 1){
					ss += '<tr><td><ul class="gumeUL"><li>'+data[c].daysu+'일</li><li>'+data[c].don+'원</li>';
					ss += '<li onclick="evClick.cpUser(\''+data[c].id+'\')">사용</li>';
			    }else{
					ss += '<tr><td class="whiteTd" style="vertical-align:top;"><ul class="gumeUL2"><li>유효기간 :</li><li>'+data[c].sday+'</li><li> ~ </li><li>'+data[c].eday+'</li>';
			    }
				
				ss += '</ul></td></tr></table>';
				
				$("#gumeCPList").append(ss);
			}
			
		}
		
		
		break;
	case "Cuponbuy":
		
		if(data.rs > 0){
			appUtil.alertgo(lngTxt.alerttit, lngTxt.cuponok);
			appUtil.moveNoHistory("gume.html");
		}else{
			
		}
		
		break;
	case "FAQ":
        var ss = "";
        for(var c=0; c < data.length; c++){
        	ss += '<li id="jumun'+c+'" onclick="evClick.jumunListV(this)">';
        	ss += '<div><i class="fa fa-dot-circle-o"></i> '+data[c].tit+'<img src="./images/downC.png"></div>';
        	ss += '<table><tr><td>'+data[c].content+'</td></tr></table>';
        	ss += '</li>';
        }
        
        $(getServ.dispDom).html(ss);
		
		break;
	case "Gongji":
		
        var ss = "";
        for(var c=0; c < data.length; c++){
        	ss += '<li id="jumun'+c+'" onclick="evClick.jumunListV(this)">';
        	ss += '<div><i class="fa fa-dot-circle-o"></i> '+data[c].tit+' <img src="./images/downC.png"></div>';
        	ss += '<table><tr><td>'+data[c].content+'</td></tr></table>';
        	ss += '</li>';
        }
        
        $(getServ.dispDom).html(ss);
        
		break;
	case "Myquestion":
		
        var ss = "";
        for(var c=0; c < data.length; c++){
        	ss += "<li>";
        	ss += "<table><tr><td><img src='./images/txtface.png'></td><td>";
        	ss += "<p>"+data[c].qtit+"<span>"+data[c].email+" "+data[c].onday+"</span></p>";
        	ss += "<div>"+data[c].qtext+"</div></td></tr></table>";
        	ss += "</li>";
        }
        
        $(getServ.dispDom).html(ss);
		
		break;
	case "Question":
	
		if(data.rs > 0){
			appUtil.moveNoHistory("jumun.html");
		}else{
			appUtil.alertgo(lngTxt.alerttit, lngTxt.qonErr);
		}
		
		break;
	case "PassChange":
	    if(data.rs == "dif"){
	    	appUtil.alertgo(lngTxt.alerttit, lngTxt.passdif);
	    }else{
	    	if(data.rs == 0){
	    		appUtil.alertgo(lngTxt.alerttit, lngTxt.passChanErr);
	    	}else{
	    		appUtil.alertgo(lngTxt.alerttit, lngTxt.passChanOK);
	    	    evClick.logout();
	    	}
	    }
		
		break;
	case "FindMem":
		switch(mode){
		case "idfind":
			if(data.su > 0){
				//이메일을 찾는다.
				meminf.email = data.email;
				
				lngTxt.addMent = data.email;
				appUtil.alertgo("nn", joinFindEmail);
			}else{
				//회원정보 실패
			    appUtil.alertgo("nn", lngTxt.joinNoMem);
			}
			appUtil.pagemovePro(meminf.loginStat, data.su, mode, 0, 0, 0);
			
			break;
		case "passfind":
			if(data.su > 0){
				//비밀번호를 전송 
				alert("이메일로 전송 완료");
				
				
			}else{
				//회원정보 실패
			    alert("전송실패");
				
				
			}
			
			break;
		}

		
		break;
	case "PhotoOn":      //현장등록한다.
		
	    switch(mode){
	    case "getAllSaupGsInfo": //현장등록에서 공사 정보를 가져와서 보여 준다.
	    	
	        $("#ssPCt1").html(data.rs.gsname);
			
	        $("#ssPGj").html(data.rs.gjname);
	        $("#ssPGdon").html(data.rs.don);
	        
	        $("#ssPCt2").html(data.rs.content);
	        var dant = "전";
	        if(data.rs.dange == 2) dant = "중";
	        if(data.rs.dange == 3) dant = "후";
	        
	        $("#ssPDange").html(dant);
	        $("#ssPDay").html(data.rs.start_dt+" ~ "+data.rs.end_dt);
	    	
            var ss = "<ul class='fileDownUl'>";
            for(var c=0; c < data.gs.length; c++){
            	var ll = LKDOWN+data.gs[c].fnam;
            	ss += "<li><a href='#' onclick='appUtil.addUpfileDown(\""+ll+"\")'>"+data.gs[c].fnam+" <img src='./images/bts_file.png' style='width:20px; border-radius:6px;'></a></li>";
            }
            
            if(data.gs.length == 0) ss += "<li>없음</li>";
            ss += "</ul>";
            $("#ssPFileGG").html(ss);
	        
	        
	    break;
	    }
		
		break;
	}
	
}




//======================================
//////SERVER 처리//////////////////////
//======================================
/*
var el = frmPro.forminput("loginForm");
if(frmPro.formInf){
	var gs1 = new GetServer();
	//서버에서 선택한 사업의 대상자를 가져온다.
	gs1.basServer(gs1, "mu", "mode=login&"+el);  //서버에서 post 모드로 가져온다.
}
*/
//var gs1 = new GetServer();
//서버에서 선택한 사업의 대상자를 가져온다.
//gs1.basServer(gs1, "mu", {mode:"pushGet", uiu:device.uuid});  //서버에서 post 모드로 가져온다.
//서버에서 정보를 가져온다.   //uws64-181.cafe24.com/WebMysql      id:pigg1234,    pass:soho7273
function GetServer(){
	this.urlLink = LK;
	this.musicBasLink = "http://mroo.co.kr/mrphp/music/";
	this.qr = null;
	this.param = null;
	this.dirEntry = null;
	this.fileEntry = null;
	this.fileDownUrl = null;
	this.fileTrans = null;
	this.mode = null;
	this.downSu = 0;      //다운로드 완료한 음원의 숫자
	this.dispDom = null;
	this.dispDomText =  "";
	this.domIndx = 0;        //메인메뉴와 비슷
	this.domid = new Array("#playListContainer");   //서버에서 가져온 값을 출력하는 위치
	this.dmode = new Array("allMusic");   //서버에서 가져오는 모드 값



}



//대상자관리에서 사업리스트->공사리스트->총공사현황 순으로 가져온다.
GetServer.prototype.basServer = function(obj, dom, param){
	if(!readOking) return;
	//imsiSv = obj;
	this.dispDomText = dom;

	//사업검색없이 선택한 업체의 모든 사업리스트를 가져온다.
	this.qr = LKAJAXC+"mobileFun";

	//alert(this.qr+"//"+param);

	$.ajax({type:"POST", data:param, url:this.qr, timeout:10000, dataType:"json",
		success:ajaxSuccess, beforeSend:ajaxBeforeSend, complete:ajaxComplete, error:ajaxError
	});

}



//======================================
////////////////////////////
//======================================
GetServer.prototype.initParam = function(php, param, mod){
	this.qr = this.urlLink+php;
	this.param = param;
	this.mode = mod;

    //alert("mode===="+param);

	//각 모드에 따른 설정을 한다.
	switch(this.mode){
	case "allMusic":


		break;
	}

}


GetServer.prototype.getPostMode = function(){
	//전체 음원리스트를 가져온다.
	var mode = this.mode;
	console.log("Ajax Go===mode=="+mode+"////param=="+this.param+"////qr=="+this.qr);


	$.ajax({type:"POST", data:input_smstext(this.param,0), url:this.qr, timeout:10000, dataType:"json",success:function(data){

	    //console.log("=====Text data="+data);

		$(".contentLoading").hide();

		switch(mode){
		case "top100Page":
			//top100, 최mr 출력
			getServ.allMusic5(data, mode);

			break;
		case "newMrPage":
			//top100, 최mr 출력
			getServ.allMusic5(data, mode);

			break;
		case "allMusicDW":
			//1차 목록을 출력한다.
			getServ.downmpLi(data, music1cha);

			break;
		case "gasathink":

			//1차목록을 출력한다.
        	getServ.dispThink(data, music1cha);

		break;
		case "getGasa":
		    //싱크파일 제작에서 사용할 가사를 가져온다.
		    //싱크파일의 존재 여부를 확인하고 존재하면 가져온다.
		    //가사를 먼저 출력한다.
		    localSys.songGasaDisplay(data);

            localSys.thinkFileDownBas(MRPHP + mPlayer.songFold + mPlayer.thinkFileName, localSys.dirEntry.toURL()+"imsigasa.txt");

		break;
		case "allMusic5":
		case "allMusic":

			//1차목록을 출력한다.
			getServ.dispLi(data, music1cha);

			break;
		case "allMusicSThink":

		    myPlug.dispAcodianDDThink(data);

		break;
		case "allMusicS":
			//상세음악출력
			//1차 목록의 상세음악들을 가져온다.
			//music1cha.sList(data);
			//alert(data.mid);

            myPlug.dispAcodianDD(data);

			//getServ.dispLiSs(data, music1cha);

			break;
		}



	},error:function(xhr,status,error){

        $(".contentLoading").hide();
		console.log("Ajax Error mode="+mode+"///error="+error);

	}
	});


}


GetServer.prototype.allMusic5 = function(data, dom){
    console.log("allMusic5=====Main TOP 1차 리스트 출력=====dom="+dom);

	//출력할 위치를 설정
	var tg = document.querySelector("#"+dom);
	var ss = "";
	for(var c= 0; c < data.rs.length; c++){

		//alert(data.rs[c].gasa);
        var imsi = data.rs[c].mss[0].fdir;
        imsi = imsi.replace("../", "");
        //alert(data.rs[c].mss[0].fdir+"//////"+imsi);

		var psong = "http://mroo.co.kr/mrphp/"+imsi+"/"+data.rs[c].mss[0].songid+data.rs[c].mss[0].endfix;


		var mtit = data.rs[c].tit;
		mtit = mtit.replaceAll("'", "");
		var gasa = data.rs[c].gasa;
		ss += "<dt class='acodion' id='"+dom+data.rs[c].id+"'>"; // onclick='evClick.basSongOnePlay(\""+psong+"\", \""+mtit+"\", \""+data.rs[c].gasu+"\", \""+gasa+"\", this)'>";
		ss += "<table class='topMusicLine'><tr><td><b>"+(c+1)+"</b></td><td onclick='myPlug.menuBar(\"#addMenuMain\", 700, \"easeOutBack\", \"open\")'>";
		ss += "<a class='acodion' id='"+data.rs[c].id+"' href='#musicSangseSe' data-rel='popup' data-transition='slideup'><b>"+mtit+"</b><span>"+data.rs[c].gasu+"</span></a>";
		ss += "</td>";
		ss += "<td>";
		ss += "<a class='acodion' id='"+data.rs[c].id+"Button' href='#musicSangseSe' data-rel='popup' data-transition='slideup'><i class='material-icons'>keyboard_arrow_down</i></a></td></tr></table>";
		ss += "</dt>";
		ss += "<dd class='acodion' id='dd"+dom+data.rs[c].id+"'><ul><li></li><li></li><li></li><li></li><li></li></ul></dd>"
	}

	tg.innerHTML = ss;


    myPlug.acodian(dom);


}

GetServer.prototype.downmpLi = function(data, ltrl){

	//출력할 위치를 설정
	//전체 음원리스트를 출력한다.
	ltrl.vList("allMusic", data);

}

GetServer.prototype.dispThink = function(data, ltrl){

	//출력할 위치를 설정
	//전체 음원리스트를 출력한다.
	ltrl.vAcodian("scrollGogo7", "gasathink", data);

}

GetServer.prototype.dispLi = function(data, ltrl){

	//출력할 위치를 설정
	//전체 음원리스트를 출력한다.
	ltrl.vList("newMrPage", data);

}
GetServer.prototype.dispLiSs = function(data, ltrl){

	switch(appBasInfo.nowPage){
	case "DownMp3":
		//다운로드에서 상세곡 정보를 연다.
		//노래에 대한 전체 mr리스트를 출력한다.
		ltrl.sDwList(data);
		break;
	default:
		//노래에 대한 전체 mr리스트를 출력한다.
		ltrl.sList(data);
		break;
	}

}



//로컬파일 삭제
GetServer.prototype.voiceDel = function(did){

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
	    fileSystem.root.getFile("mrro/voice/"+did, {create:false}, function(fileEntry){
	        fileEntry.remove(function(file){
	        	//appUtil.alertgo("알림","삭제완료 하였습니다.");
	        	getServ.fileList("mrro/voice", "allRecVoice");

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

}


GetServer.prototype.fileList = function(dir, domid){
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
		    		 lists += "<li><p><span>"+(su - c)+"</span>"+entf[c]+"<span class='soBtn'></span><span class='soBtn' onclick='evClick.voiceDel(\""+entf[c]+"\")'>삭제</span><span class='soBtn' onclick='evClick.voicePlay(\""+entf[c]+"\")'>듣기</span></p></li>";
		    	 }

		    	 document.getElementById(domid).innerHTML = lists;

		    	 console.log("fileList end=========");

		     }, function(){

		     });

		},function(err){});

	}, function(){

	});


}


//파일을 다운로드 한다.
GetServer.prototype.fileDown = function(mlink){

	//파일을 다운로드 한다.
	this.fileTrans = new FileTransfer();
	this.fileDownUrl = encodeURI(this.musicBasLink+mlink); //"1se/01c0c4606d/1se557-6e6a410.mp3");
	//다운로드한 파일의 절대경로를 구한다.
	var urlObj = $.mobile.path.parseUrl(this.fileDownUrl);

	this.fileTrans.download(this.fileDownUrl, localDownPo+urlObj.filename, function(entry){

		getServ.downSu++;

		if(getServ.downSu == music1cha.playAllsu){
			alert("선택한 모든 음원의 다운로드 완료"); //endtry="+entry.toURL());
			getServ.downSu = 0;
		}


	}, function(error){

		alert("error="+error.code);

	}, false, {
		//headers:{"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="}
		}
	);
}
//==========================================================
////////////////////////
//=====================================================
//1차목록의 리스트를 출력한다.
var music1cha = {

	sound : {},
	gasaFnam : "",
	dispDomText:"",
	gasa:"노래선택 하세요.",
	gasatit:"가사없음",
	playList : {},
	arrayTxt : null,
	playAllsu : 0,      //미리듣기 선택한 음원의 총 갯수
	playIndex : 0,      //현재 미리듣기 하는 음원의 인덱스
	playInf : false,    //현재 음악의 플레이 중인 여부 확인
	nowId : 0,          //가수 리스트의 선택과 해제에 사용.
	oldId : null,       //가수 리스트의 선택과 해제에 사용.
	sdomid : "",
	playid : 0,        //현재 플레이 하는 음원의 아이디값 - 인덱스 제외
	openInf : false,


	mp3Down : function(){

		    downMp.dsu = 0;
			//플레이 리스트에 있는 모든 음원을 다운로드 한다.
			for(var c = 0; c < downMp.downSu; c++){
				var uu = downMp.songLink[c];  //파일의 링크를 가져온다.
				//파일을 다운로드 한다.
				localSys.fileDown(uu, c);

			}

	},

	mDown : function(){

		if(this.playInit()){
			//플레이 리스트에 있는 모든 음원을 다운로드 한다.
			for(var c = 0; c < this.playAllsu; c++){
				var uu = this.sound[Number(this.playList[c])];  //파일의 링크를 가져온다.
				//alert(uu);
				//파일을 다운로드 한다.
				getServ.fileDown(uu);

			}
		}

	},

	dispGasa:function(){
		var gg = this.gasa;
		gg = gg.replaceAll("<br />", "\n");

		this.gasa = gg;

		appUtil.alertgo(this.gasatit+" 가사", gg);
	},

	vAcodian : function(dompare, domtxt, data){

        var domobj = $("#"+dompare+" dl#"+domtxt);
        domobj = $("#"+dompare+" dl#"+domtxt);


		//최신MR리스트
		var ss = "";
		for(var c=0; c < data.rs.length; c++){
			var inx = data.rs[c].id;

            ss += "<dt class='acodion' id='newMrPage"+inx+"'>"; // onclick='music1cha.allMusicPlay(this)'>";
            ss += "<table class='topMusicLine'><tr><td><b>"+(c+1)+"</b></td><td onclick='myPlug.menuBar(\"#addMenuMain\", 700, \"easeOutBack\", \"open\")'>";
            //ss += "<li id='"+dom+c+"' onclick='evClick.songOnePlay(\""+psong+"\", this)'><table><tr><td style='width:15%;'>"+(c+1)+"</td><td style='width:85%; text-align:left;'>";
            ss += "<a class='acodion' id='"+inx+"' href='#' style='border:none;'><b>"+data.rs[c].tit+"</b><span>"+data.rs[c].gasu+"</span></a>";
            ss += "</td>";
            //ss += "<td><i class='material-icons'>play_arrow</i></td>";
            ss += "<td>";
            ss += "<a class='acodion' id='"+inx+"Button' href='#' style='border:none;'><i class='material-icons'>keyboard_arrow_down</i></a></td></tr></table>";
            ss += "</dt>";

            ss += "<dd class='acodion' id='dd"+domtxt+inx+"'><ul><li></li><li></li><li></li><li></li><li></li></ul></dd>";

		}

		domobj.html(ss);

		myPlug.acodian(domtxt);


	},

	vList : function(domtxt, data){

        var domobj = $("#bodyContent"+tabInfo.mainTab+" dl#"+domtxt);
        domobj = $("#bodyContent"+tabInfo.mainTab+" dl#"+domtxt);


		//최신MR리스트
		var ss = "";
		for(var c=0; c < data.rs.length; c++){
			var inx = data.rs[c].id;

            ss += "<dt class='acodion' id='newMrPage"+inx+"'>"; // onclick='music1cha.allMusicPlay(this)'>";
            ss += "<table class='topMusicLine'><tr><td><b>"+(c+1)+"</b></td><td onclick='myPlug.menuBar(\"#addMenuMain\", 700, \"easeOutBack\", \"open\")'>";
            //ss += "<li id='"+dom+c+"' onclick='evClick.songOnePlay(\""+psong+"\", this)'><table><tr><td style='width:15%;'>"+(c+1)+"</td><td style='width:85%; text-align:left;'>";
            ss += "<a class='acodion' id='"+inx+"' href='#' style='border:none;'><b>"+data.rs[c].tit+"</b><span>"+data.rs[c].gasu+"</span></a>";
            ss += "</td>";
            //ss += "<td><i class='material-icons'>play_arrow</i></td>";
            ss += "<td>";
            ss += "<a class='acodion' id='"+inx+"Button' href='#' style='border:none;'><i class='material-icons'>keyboard_arrow_down</i></a></td></tr></table>";
            ss += "</dt>";

            ss += "<dd class='acodion' id='dd"+domtxt+inx+"'><ul><li></li><li></li><li></li><li></li><li></li></ul></dd>";

		}

		domobj.html(ss);

		myPlug.acodian(domtxt);


	},

	sDwList : function(data){
		//선택한 노래에 대한 모든 MR을 가져와서 출력 한다.
		this.arrayTxt = "";   //선택한 음원이 아이디값 문자열을 초기화 한다.

		this.gasatit = data.tit;
		this.gasa = disp_smstext(data.gasa, 0);


		var sdomid = document.getElementById(this.sdomid+"li2");
		$("#"+this.sdomid+"li2" ).html("");  //이전에 추가된 음원 리스트를 삭제한다.

		//ul을 추가 한다.----------------------------
		var ali0 = document.createElement("ul");
		ali0.setAttribute("id", this.sdomid+"ul");
		sdomid.appendChild(ali0);
		//-----------------------------------------

		this.sound = new Array();

		var sdomid2 = document.getElementById(this.sdomid+"ul");
		var tt = "";
		var gasa = "";
		for(var c=0; c < data.rs.length; c++){

			var ss = data.rs[c].dir+"/"+data.rs[c].sid+data.rs[c].endfix;
			this.sound[c] = ss;

			tt += "<li style='width:100%; padding:0; margin:0; border-bottom:#cdcdcd 1px dotted;'>";
			tt += "<ul class='musicSS'><li id='"+data.rs[c].id+"-"+c+"' class='allTypeMusic' onclick='music1cha.eaMusicPlay(this, "+c+")'><input type='checkbox' name='dwchek' id='"+data.rs[c].sid+"'> "+data.rs[c].pfix;
			tt += "<span></span></li><li onclick='evClick.musicPlayGo(\""+ss+"\", \""+data.rs[c].sid+"\")'><img src='images/greenPlay.png'></li></ul>";
			//tt += "<span></span></li><li onclick='music1cha.goMusicPlay(\""+ss+"\", \""+data.rs[c].sid+"\")'><img src='images/greenPlay.png'></li></ul>";
			tt += "</li>";

		}


		sdomid2.innerHTML = tt;
		sdomid2.style.display = "block";

	},

	//sList노래상세보기리스트
	sList : function(data){

		$("#addMenuMain").css({"display":"none"});
		$(".musicBarR").css({"display":"block"});

		//음악상세음악리스트출력
		//선택한 노래에 대한 모든 MR을 가져와서 출력 한다.
		this.arrayTxt = "";   //선택한 음원이 아이디값 문자열을 초기화 한다.

		this.gasatit = data.tit;
		this.gasa = disp_smstext(data.gasa, 0);


		var sdomid = ""; //document.getElementById(this.sdomid+"li2");
		sdomid = document.getElementById("sangseMList");
		//$("#sangseMList").html("");  //이전에 추가된 음원 리스트를 삭제한다.

		//ul을 추가 한다.----------------------------
		//var ali0 = document.createElement("ul");
		//ali0.setAttribute("id", this.sdomid+"ul");
		//sdomid.appendChild(ali0);
		//-----------------------------------------

		this.sound = new Array();


		//var sdomid2 = document.getElementById(this.sdomid+"ul");
		var tt = "";
		var gasa = "";
		for(var c=0; c < data.rs.length; c++){

			var ss = data.rs[c].dir+"/"+data.rs[c].sid+data.rs[c].endfix;
			this.sound[c] = ss;

			tt += "<li style='width:100%; padding:0; margin:0; border-bottom:#cdcdcd 1px dotted;'>";

			tt += "<ul class='musicSS'>";
			tt += "<li id='"+data.rs[c].id+"-"+c+"' class='allTypeMusic' onclick='music1cha.eaMusicPlay(this, "+c+", \""+ss+"\", \""+data.rs[c].sid+"\", \""+data.tit+"\", \""+data.rs[c].pfix+"\")'>";
			tt += "<img src='images/linefeed.png' style='width:15px;'> "+data.rs[c].pfix;
			tt += "<span></span></li>";
			//tt += "<li onclick='music1cha.goMusicPlay(\""+ss+"\", \""+data.rs[c].sid+"\", \""+data.tit+"\", \""+data.rs[c].pfix+"\")'><i class='fa fa-play-circle' style='color:green; font-size:1.5em;'></i></li>";
			//tt += "<li onclick='evClick.musicPlayGo(\""+ss+"\", \""+data.rs[c].sid+"\")'><i class='fa fa-microphone' style='color:red; font-size:1.5em;'></i></li>";

			tt += "</ul>";
			//tt += "<span></span></li><li onclick='music1cha.goMusicPlay(\""+ss+"\", \""+data.rs[c].sid+"\")'><img src='images/greenPlay.png'></li></ul>";

			tt += "</li>";

		}

	    //alert(tt);

		sdomid.innerHTML = tt;
		//sdomid.style.display = "block";

	},
	playInit : function(){

		if(this.arrayTxt == ""){
			this.playAllsu = 0;
			alert("가수의 음원을 먼저 선택하세요.");
			return false;
		}
		var aa = this.arrayTxt.split("/");
		this.playAllsu = (aa.length - 1);
		this.playIndex = 0;

		this.playList = new Array();
		for(var c=0; c < this.playAllsu; c++){
			var inx = aa[c].split("-");
			this.playid = inx[0];
			this.playList[c] = inx[1];
		}

		return true;

	},
	play : function(){

		//초기화 하고 play list에 곡을 담는다.
		if(this.playInit()){
			this.playIng();
		}

	},
	playIng : function(){

		this.playInf = true;  //현재 플레이 중 이다.
		var inx = this.playList[this.playIndex];

		$("#"+this.playid+"-"+inx+" span").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Play]");

		console.log("music play======="+MUSIC+music1cha.sound[Number(inx)]);


		document.getElementById("audioPly").src = MUSIC+music1cha.sound[Number(inx)];
		document.getElementById("audioPly").play();

		this.playIndex++;

	},
	stop : function(){


		document.getElementById("audioPly").src = " ";
		document.getElementById("audioPly").play();

		document.getElementById("audioPly").pause();
		//this.playIndex = 0;
		this.playInf = false;  //현재 플레이 중이 아니다.

	},
	audioend : function(){

		//음악을 끝까지 들어면 먼저 실행되고 다음에 stoped 실행됨

		//다음음악을 플레이 한다.
		if(this.playIndex < this.playAllsu){
			this.playIng();
		}else{

			this.stop();

			alert("선택한 모든 음악의 미리듣기를 마쳤습니다.");
		}

	},
	stoped : function(){
		//새로운 가수 선택하여 음악 초기화, 중간에 종료시 실행 - 음악이 종료되면 무조건 실행
		//alert("stoped");

		this.playInf = false;  //현재 플레이 중이 아니다.

		var aa = (this.playIndex - 1);
		if(aa < 0) aa = 0;

		var inx = this.playList[aa];
		if(this.playid != "" || this.playid > 0) $("#"+this.playid+"-"+inx+" span").html("");



	},
	goMusicPlay : function(music, sid, tit, gasu){    //음악전체 리스트에 플레이 한다.

		$("#songTitSp").html(tit);
		$("#songGasuSp").html(gasu);
		//alert("sss=="+this.gasa);
		$("#dispGasaTxt").html(this.gasa);

		var aa = this.gasa.split("-");

		this.gasaFnam = aa[0]+"_gasa.txt";


		//각각의 음원을 play() 한다.
        document.getElementById("audioPly").src = MUSIC+music;
        document.getElementById("audioPly").play();



	},

	basMusicPlay : function(dat){

		var aa = gasa.split("-");
		this.gasaFnam = aa[0]+"_gasa.txt";



		//각각의 음원을 play() 한다.
        document.getElementById("audioPly").src = MUSIC+music;
        document.getElementById("audioPly").play();

	},


	//상세음원선택
	//음원을 선택하면 음원을 체크또는 언체크한다.
	eaMusicPlay : function(obj, inx, ss, sid, tit, pifx){

		$("#addMenuMain").css({"display":"block"});
		$(".musicBarR").css({"display":"none"});


		this.goMusicPlay(ss, sid, tit, pifx);

		$("#overlay").popup("close");

		/*
		//각각의 음원을 play() 한다.
		//동적으로 클릭하면 실행되는 함수에서 this는 선택한 항목을 지칭한다.
		//선택한 목록에 존재 여부를 확인한다.
		var aa = music1cha.arrayTxt;
		//alert("상세음원선택"+aa);
		aa = aa.replaceAll(obj.id+"/", "");
		var sid = $("#"+obj.id+" input[type=checkbox]").attr("id");
		var sidval = "0";
		if(aa != music1cha.arrayTxt){
			sidval = "0"; //$("#"+obj.id+" input[type=checkbox]").attr("id");
			//기존에 선택된 것을 토글하여 취소한다.
			document.getElementById(obj.id).className = "allTypeMusic";
			$("#"+obj.id+" input").prop("checked", false);
		}else{
			//신규로 새로운 것을 선택 한다.
			sidval = music1cha.sound[inx];
			document.getElementById(obj.id).className = "allTypeMusicSe";
			$("#"+obj.id+" input").prop("checked", true);
			aa += obj.id+"/";
		}
		music1cha.arrayTxt = aa;
		//alert("sss=="+sid+"/"+sidval);

		downMp.checkSu("mp3downform");
		*/

	},
	allMusicPlay : function(obj){
		//최신MR리스트클릭
		//각노래에 등록된 모든 음원을 가져온다.
		//동적으로 클릭하면 실행되는 함수에서 this는 선택한 항목을 지칭한다.
		//music1cha.stop();

		music1cha.nowId = obj.id;
		music1cha.sdomid = obj.id;

		music1cha.openInf = false;

		if(music1cha.oldId != null){  //기존에 설정된 라인을 초기화 한다.
			/*
			$("#"+music1cha.oldId+"ul" ).html("");  //이전에 추가된 음원 리스트를 삭제한다.
			document.getElementById(music1cha.oldId).className = "allMusic";
			document.getElementById(music1cha.oldId+"li2").style.display = "none";
			document.getElementById("downupImg"+music1cha.oldId).src = "images/downC.png";
			this.gasatit = "가사없음";
			this.gasa = "노래선택 하세요.";

			//기존에 열린 것이 있다.
			if(music1cha.openInf){
				//document.getElementById(music1cha.oldId+"ul").style.display = "none";
				//music1cha.openInf = false;
			}

			if(music1cha.oldId == music1cha.nowId){
				//기존에 열린것을 다시 클릭하면 열린것을 닫고 종료 한다.
				music1cha.oldId = null;

				if(appBasInfo.nowPage == "DownMp3"){
					downMp.checkSu("mp3downform");
				}

				return;
			}

			if(appBasInfo.nowPage == "DownMp3"){
				downMp.checkSu("mp3downform");
			}
			*/
		}


		//----새로운 리스트를 연다.-------------------------------------------
			if(music1cha.openInf){

				//리스트를 닫는다.
				/*
				$("#"+music1cha.sdomid+"ul" ).html("");  //이전에 추가된 음원 리스트를 삭제한다.
				document.getElementById(music1cha.sdomid+"ul").style.display = "none";
				document.getElementById(music1cha.sdomid+"li2").style.display = "none";
				document.getElementById("downupImg"+music1cha.sdomid).src = "images/downC.png";
				this.gasa = "노래선택 하세요.";
				this.gasatit = "가사없음";
				*/
				music1cha.openInf = false;

			}else{
				//리스트를 연다.

				$("#overlay").popup("open");
				//$("#addMenuMain").popup("open");

				$("#sangseMList").html("");


				music1cha.openInf = true;
				//document.getElementById(music1cha.nowId).className = "allMusicSe";
				//document.getElementById(music1cha.sdomid+"li2").style.display = "block";
				//document.getElementById("downupImg"+music1cha.sdomid).src = "images/upC.png";

				//서버에서 모든 멜로디의 음원을 연다.
				getServ2 = new GetServer();
				//alert("mode=allMusicS&mid="+obj.id);
				getServ2.initParam("getMrAll.php", "mode=allMusicS&mid="+obj.id, "allMusicS");
				getServ2.getPostMode();  //서버에서 post 모드로 가져온다.

			}

			if(appBasInfo.nowPage == "DownMp3"){
				downMp.checkSu("mp3downform");
			}
		//--------------------------------------------------

		music1cha.oldId = obj.id;

	}


}




//프로그래스 진행상태를 보여 준다.
function dispProgressMedia(){

	//console.log("*********playBg.md="+playBg.md);

	if(playBg.md == 4 && playIng){
		//플레이 프로그래스 출력
		var oldN = 0;
		var alltt = 0;
		var deliy = 10;
		var timerDur = "";
		var timerDurInit = setInterval(function() {
			//alert("iiiiii");
			alltt = media.getDuration();
			deliy = parseInt(alltt);
		    if (alltt > 0) {
		    	//alert(alltt);
				timerDur = setInterval(function() {
					//alltt = media.getDuration();
				    media.getCurrentPosition(function (pt){
				    	//alert(pt);
				    	var ptInt = parseInt(pt);
				    	//alert(alltt+"/"+pt);
				    	var nn = parseInt((pt / alltt) * 100);
				    	if(nn > oldN){
					    	var tim = chnMusicTime(parseInt(ptInt));
					    	document.getElementById('mvdtime'+playBg.NowPlayId).innerHTML = tim;
						    oldN = nn;
				    	}

				    	if(playIng) document.getElementById("meterRole"+playBg.NowPlayId).style.width = nn+"%";
				    	else return;  //음악종료상태에서는 함수를 종료한다.


					    if(pt < 0) clearInterval(timerDur);

				    }, function (e){});
				}, deliy);

		        clearInterval(timerDurInit);

		    }

		}, deliy);

	}

}

//========================================
//결과 리스트 출력
//========================================
function dispTabData(data){

    var domid = $("#bodyContent"+tabInfo.mainTab+" "+getServ.dispDomText);

    switch(tabInfo.mainTab){
    case 1:   //top

    break;
    case 2:   //NEW

        //ltrl.vList(tg, data); 에서 출력

    break;
    case 3:   //주문제작

        Jumun.getData(data);

    break;
    case 4:   //MY

        Jumun.getData(data);


    break;
    case 5:   //CLUB

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

		domid.html(ss);

    break;
    }

}
