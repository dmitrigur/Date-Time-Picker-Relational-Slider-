//  Dmitriy Guryanov

(function ($) {
	var horecaTechDateTimePicker={}
	horecaTechDateTimePicker.data={};
	horecaTechDateTimePicker.counter=0;
	horecaTechDateTimePicker.tarOpt={};
	horecaTechDateTimePicker.opt = {
			First:{"Month":0,"Date":1,"Hours":0,"Minutes":0,"Seconds":0},
			Span:{"FullYear":15,"Month":15,"Date":15,"Hours":16,"Minutes":20,"Seconds":20},
			HeightFactor:{"FullYear":31557600000/36.525,"Month":2592000000/30,"Date":86400000/24,"Hours":3600000/30,"Minutes":60000/30,"Seconds":1000/30},
			HeightFactor__:{"FullYear":31557600000/2,"Month":2592000000/2,"Date":86400000/2,"Hours":3600000/2,"Minutes":60000/2,"Seconds":1000/2},
			Width:{"FullYear":62,"Month":62,"Date":35,"Hours":35,"Minutes":35,"Seconds":35},
			WheelStep:{"FullYear":5,"Month":3,"Date":7,"Hours":3,"Minutes":5,"Seconds":5},
			Separator:{"FullYear":"","Month":"\u2022","Date":"\u2022","Hours":"","Minutes":":","Seconds":":"},
			SeparatorWidth:{"FullYear":"","Month":9,"Date":9,"Hours":"","Minutes":7,"Seconds":7},
			ColumnMargin:{"FullYear":0,"Month":2,"Date":2,"Hours":5,"Minutes":2,"Seconds":2},
			Padding:{"FullYear":4,"Month":0,"Date":0,"Hours":2,"Minutes":2,"Seconds":2},
			LevelSet:["FullYear","Month","Date","Hours","Minutes","Seconds"],
			Index:{"FullYear":0,"Month":1,"Date":2,"Hours":3,"Minutes":4,"Seconds":5},
			Rep : {Month: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OKT","NOV","DEC"]},
			Container : 'body',
			STOP:'STOP',
			DONE:'DONE',
			NOW:'NOW',
			FrameBackgroundColor : "white",
	//		FrameBorderColor : "grey",
	//		FrameShadowColor : "HSLA(120,70%,15%,0.85)",
			ColumnBackgroundImage : "-webkit-linear-gradient(top,RGBA(255,210,210,0.9)0%,RGBA(255,240,240,0.9)25%,RGBA(255,255,255,0.9)50%,RGBA(240,240,255,0.9)70%,RGBA(210,210,255,0.9)100%)",
			CellBackgroundImage : "-webkit-linear-gradient(top,HSLA(0,0%,50%,0.2)0%,HSLA(0,0%,100%,0.2)25%,HSLA(0,0%,0%,0.2)100%)",
			ButtonBackgroundImage : "-webkit-linear-gradient(top,HSLA(0,0%,50%,0.2)0%,HSLA(0,0%,100%,0.2)25%,HSLA(0,0%,0%,0.2)100%)",
			TextColor : "HSLA(0,0%,40%,1)",
			SelectedTextColor : "black",
			MarkColor:"red",
			SelectedBarBackgroundColor : "HSLA(0,0%,100%,",
		//	TextFontFamily : "Tahome Arial Roboto",
		//	SelectedTextFontFamily : "Tahome Arial Roboto",
			SizeFactor:8,
			WindowHeightFactor:40,
			ResultMode:"time", // time, date, object
			TruncateResult:false,
			FlagInProgress:false,
			FlagOnStop:false,
			FlagOnBlur:false
	};
	var	hdtpicker_datetruncate = function (TS,level_indx) {
			level_indx=parseInt(level_indx+"");
			var date=new Date(TS);
			switch (level_indx) {
				case 0: {date = new Date(date.getFullYear(),0,1);break};
				case 1: {date = new Date(date.getFullYear(),date.getMonth(),1);break};
				case 2: {date = new Date(date.getFullYear(),date.getMonth(),date.getDate());break};
				case 3: {date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours());break};
				case 4: {date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes());break};
				case 5: {date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());break};
			}
			return date;
		},
		hdtpicker_datetruncateTS = function (TS,level_indx) {
			return hdtpicker_datetruncate(TS,level_indx).getTime();
		},
		hdtpicker_align = function (level_indx,TS,flag) {
			var level=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level_indx],
				delta=Math.round((TS-hdtpicker_datetruncateTS(TS,level_indx)-horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[level])/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]),
				oldtop=parseInt($("#hdtpicker_level_"+level+"_holder").css('top').substr(0,$("#hdtpicker_level_"+level+"_holder").css('top').length-2));
				if (flag && Math.abs((-horecaTechDateTimePicker.data.windowOffset+delta)-oldtop)<horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[level]/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]) {
					$("#hdtpicker_level_"+level+"_holder").css({top:-horecaTechDateTimePicker.data.windowOffset+delta});
				} else {
					var time=Math.pow(Math.abs(-horecaTechDateTimePicker.data.windowOffset+delta-oldtop),0.5)*75;
					$("#hdtpicker_level_"+level+"_holder").stop().animate({top:-horecaTechDateTimePicker.data.windowOffset+delta},time);
				};
				$("#hdtpicker_bar"+level_indx).css({top:horecaTechDateTimePicker.data.windowOffset+(horecaTechDateTimePicker.data.windowHeight-horecaTechDateTimePicker.data.lineHeight)/2-delta});
		},
		hdtpicker_Process = function (level_indx,TS,dir) {
			var level=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level_indx],
				date_=hdtpicker_datetruncate(TS,level_indx),
				sel=Math.floor(new Date(date_).getTime()/1000)*1000;
			if (dir==null) {
				if (horecaTechDateTimePicker.data.Cur[level].startTS!=null && TS+horecaTechDateTimePicker.data.windowHeight/2*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]<=horecaTechDateTimePicker.data.Cur[level].endTS && TS-horecaTechDateTimePicker.data.windowHeight/2*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]>=horecaTechDateTimePicker.data.Cur[level].startTS) {
					$("#"+level+horecaTechDateTimePicker.data.Cur[level].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Cur[level].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
				} else
					horecaTechDateTimePicker.data.Cur[level]=hdtpicker_getSet(TS,Math.floor(date_['set'+level](date_['get'+level]() - Math.floor(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Span[level]/2))/1000)*1000,level);
				$("#hdtpicker_level_"+level+"_holder").children().not(".hdtpicker_column_bar,.hdtpicker_mark,#"+level+horecaTechDateTimePicker.data.Cur[level].startTS).remove();
				delete horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS];
				delete horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS];
			} else if (dir==-1) {
				var StartTS=horecaTechDateTimePicker.data.Cur[level].endTS;
				if (horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS]==null)
					horecaTechDateTimePicker.data.Next[level][StartTS]=hdtpicker_getSet(TS,StartTS,level)
				else if (TS-horecaTechDateTimePicker.data.windowHeight/2*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]>horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS].endTS) {
					$("#level"+horecaTechDateTimePicker.data.Next[level][StartTS].startTS).remove();
					var StartTS=Math.floor(date_['set'+level](date_['get'+level]() - Math.floor(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Span[level]/2))/1000)*1000;
					horecaTechDateTimePicker.data.Next[level][StartTS]=hdtpicker_getSet(TS,StartTS,level);
					var n=true;
				};
				if (TS-horecaTechDateTimePicker.data.windowHeight/2*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]>horecaTechDateTimePicker.data.Cur[level].endTS || n) {
					horecaTechDateTimePicker.data.Cur[level]={prevTS:horecaTechDateTimePicker.data.Next[level][StartTS].prevTS,startTS:horecaTechDateTimePicker.data.Next[level][StartTS].startTS,endTS:horecaTechDateTimePicker.data.Next[level][StartTS].endTS};
					$("#hdtpicker_level_"+level+"_holder").children().not(".hdtpicker_column_bar,.hdtpicker_mark,#"+level+horecaTechDateTimePicker.data.Cur[level].startTS).remove();
					delete horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS];
					delete horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS];
				} else {
					$("#"+level+horecaTechDateTimePicker.data.Cur[level].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Cur[level].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
					if (horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS]!=null) $("#"+level+horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
					if (horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS]!=null) $("#"+level+horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
				}
			} else if (dir==1) {
				var StartTS=horecaTechDateTimePicker.data.Cur[level].prevTS;
				if (horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS]==null)
					horecaTechDateTimePicker.data.Prev[level][StartTS]=hdtpicker_getSet(TS,StartTS,level)
				else if (TS+horecaTechDateTimePicker.data.windowHeight/2*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]<horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS].startTS) {
					$("#"+level+horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS].startTS).remove();
					var StartTS=Math.floor(date_['set'+level](date_['get'+level]() - Math.floor(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Span[level]/2))/1000)*1000;
					horecaTechDateTimePicker.data.Prev[level][StartTS]=hdtpicker_getSet(TS,StartTS,level);
					var n=true;
				};
				if (TS+horecaTechDateTimePicker.data.windowHeight/2*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]<horecaTechDateTimePicker.data.Cur[level].startTS || n) {
					horecaTechDateTimePicker.data.Cur[level]={prevTS:horecaTechDateTimePicker.data.Prev[level][StartTS].prevTS,startTS:horecaTechDateTimePicker.data.Prev[level][StartTS].startTS,endTS:horecaTechDateTimePicker.data.Prev[level][StartTS].endTS};
					$("#hdtpicker_level_"+level+"_holder").children().not(".hdtpicker_column_bar,.hdtpicker_mark,#"+level+horecaTechDateTimePicker.data.Cur[level].startTS).remove();
					delete horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS];
					delete horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS];
				} else {
					$("#"+level+horecaTechDateTimePicker.data.Cur[level].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Cur[level].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
					if (horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS]!=null) $("#"+level+horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Prev[level][horecaTechDateTimePicker.data.Cur[level].prevTS].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
					if (horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS]!=null) $("#"+level+horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS].startTS).css({top:Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-horecaTechDateTimePicker.data.Next[level][horecaTechDateTimePicker.data.Cur[level].endTS].startTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])});
				}
			};
			$("."+level+".hdtpicker_cell").not("#hdtpicker_cell"+level+sel).css({color:horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TextColor,fontWeight:"normal",fontFamily:horecaTechDateTimePicker.data.textFontFamily});
			$("#hdtpicker_cell"+level+sel).css({color:horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedTextColor,fontWeight:horecaTechDateTimePicker.data.selectedFontWeight,fontFamily:horecaTechDateTimePicker.data.selectedTextFontFamily});
			if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FlagInProgress) {
				switch (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ResultMode) {
					case "time" :{var result=new Date(TS);result=result.toLocaleString();$(horecaTechDateTimePicker.data.target).val(result);break;}
					case "date" :{var result=new Date(TS);result=result.toLocaleDateString();$(horecaTechDateTimePicker.data.target).val(result);break;}
					case "object" : {
										var date=new Date(TS),result={};
											for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
												result[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=date['get'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]();
										break;
									}
					};
				if (typeof (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].inProgress)=='function')
					horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].inProgress(horecaTechDateTimePicker.data.target,TS,result);
			}
		},
		hdtpicker_getSet = function(TS,starttimestamp,level) {
			var str="",
				date_=new Date(starttimestamp),
				pos=starttimestamp,
				result={startTS:pos,prevTS:Math.floor(date_['set'+level](date_['get'+level]() - horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Span[level])/1000)*1000},
				nextpos,
				point,
				date;
			for (var i=0;i<horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Span[level];i++) {
				date = new Date(pos);
				point=date['get'+level]();
				nextpos=date['set'+level](point + 1);
				var height=(Math.round(nextpos/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])-Math.round(pos/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]));
				str+="<span level=\""+level+"\"pos=\""+pos+"\" id=\"hdtpicker_cell"+level+pos+"\" class=\""+level+" hdtpicker_cell\" style=\"HEIGHT:"+height+"px;LINE-HEIGHT:"+height+"px\">"+((horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Rep[level]==null)?('0000'.substr(0,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Padding[level]-(point+"").length)+point):horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Rep[level][point])+"</span>";
				pos=nextpos;
			};
			$("#hdtpicker_level_"+level+"_holder").append("<div id=\""+level+starttimestamp+"\" class = \""+level+" hdtpicker_container\" style=\"TOP: "+Math.round(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-(TS-starttimestamp)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level])+"px\">"+str+"</div>");
			result.endTS=pos;
			$("#"+level+starttimestamp).children().on("mouseup.htdatetime2",function (event) {
				if (horecaTechDateTimePicker.data.MouseMove)
					null;
				else {
					horecaTechDateTimePicker.data.MouseMove=false;
					horecaTechDateTimePicker.data.MouseDownPoint=null;
					event.stopPropagation();
					event.preventDefault();	
					event.cancelBubble=true;
					var TS=parseInt($(this).attr("pos")),
						level=$(this).attr("level"),
						TruncIniTS=hdtpicker_datetruncateTS(horecaTechDateTimePicker.data.iniTS,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Index[level]);
					if (TS!=TruncIniTS) {
						horecaTechDateTimePicker.data.NowShift+=TS-TruncIniTS;
						TS+=horecaTechDateTimePicker.data.iniTS-TruncIniTS;
						iterCnt=Math.round(Math.pow(Math.abs(TS-horecaTechDateTimePicker.data.iniTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[level],0.5)*2.5)*2;
						if (iterCnt>0) {
							hdtpicker_rollout((TS-horecaTechDateTimePicker.data.iniTS)/Math.pow(iterCnt/2,2),(horecaTechDateTimePicker.data.iniTS>TS)?1:-1,level,TS,iterCnt,1)
						}
					};
				}
			})
			return result;
		},
		hdtpicker_ScrollPar = function(target,event) {
			if (horecaTechDateTimePicker.data.scrollHistory[target]==null) 
				horecaTechDateTimePicker.data.scrollHistory[target]=[];
				horecaTechDateTimePicker.data.ScrollTop[target]=event.clientY-horecaTechDateTimePicker.data.MouseDownPoint;
			var timestamp=new Date().getTime(),
				dump={};
			while (horecaTechDateTimePicker.data.scrollHistory[target].length>0 && horecaTechDateTimePicker.data.scrollHistory[target][0].T+100<timestamp) dump=horecaTechDateTimePicker.data.scrollHistory[target].shift();
			if (horecaTechDateTimePicker.data.scrollHistory[target].length>0) {
				var Yvelocity=(horecaTechDateTimePicker.data.ScrollTop[target]-horecaTechDateTimePicker.data.scrollHistory[target][0].Y)/(timestamp-horecaTechDateTimePicker.data.scrollHistory[target][0].T),
					Yacceleration=(Yvelocity-horecaTechDateTimePicker.data.scrollHistory[target][0].Vy)/(timestamp-horecaTechDateTimePicker.data.scrollHistory[target][0].T),
					Ydirection=(Yvelocity>0)?1:(Yvelocity<0)?-1:0,
					Interval=(timestamp-horecaTechDateTimePicker.data.scrollHistory[target][0].T)/horecaTechDateTimePicker.data.scrollHistory[target].length;
			} else {
				var Yvelocity=0,
					Yacceleration=0,
					Ydirection=((horecaTechDateTimePicker.data.ScrollTop[target]-dump.Y)>0)?1:((horecaTechDateTimePicker.data.ScrollTop[target]-dump.Y)<0)?-1:0,
					Interval=0;
			};
			horecaTechDateTimePicker.data.scrollHistory[target].push({T:timestamp,I:Interval,Y:horecaTechDateTimePicker.data.ScrollTop[target],Vy:Yvelocity,Ay:Yacceleration,Dy:Ydirection,L:horecaTechDateTimePicker.data.scrollHistory[target].length+1});
			return horecaTechDateTimePicker.data.scrollHistory[target][horecaTechDateTimePicker.data.scrollHistory[target].length-1];
		},
		hdtpicker_scroll = function (scrolllevel,event) {
			horecaTechDateTimePicker.data.scrollpar=hdtpicker_ScrollPar(scrolllevel,event);
			horecaTechDateTimePicker.data.CurrentTS=horecaTechDateTimePicker.data.iniTS-horecaTechDateTimePicker.data.scrollpar.Y*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[scrolllevel];
			hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Index[horecaTechDateTimePicker.data.MouseLevel],horecaTechDateTimePicker.data.CurrentTS,horecaTechDateTimePicker.data.scrollpar.Dy);
			for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[horecaTechDateTimePicker.data.MouseLevel])
				hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[horecaTechDateTimePicker.data.MouseLevel][level],horecaTechDateTimePicker.data.CurrentTS);
		},
		hdtpicker_rollout = function (a,dir,level,TS,iterCnt,iter) {
				hdtpicker_Timer.Start("","D",30,function(c,a,dir,level,TS,iterCnt,iter) {
					if (iter==iterCnt)
						TS_=TS;
					else if (iter*2>iterCnt)
						TS_=Math.floor((horecaTechDateTimePicker.data.iniTS+(TS-horecaTechDateTimePicker.data.iniTS)/2+a*iterCnt/2*(iter-iterCnt/2)-a*(iterCnt/2-iter)*(iterCnt/2-iter)/2)/1000)*1000;
					else
						TS_=Math.floor((horecaTechDateTimePicker.data.iniTS+a*iter*iter/2)/1000)*1000;
					hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Index[level],TS_);
					for (var l in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[level])
						hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[level][l],TS_);
					if (iter++==iterCnt) {
						horecaTechDateTimePicker.data.iniTS=TS;
						horecaTechDateTimePicker.data.RollerTS[level]=0;
						for (var l in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
							hdtpicker_align(l,horecaTechDateTimePicker.data.iniTS);
						$('.hdtpicker_mark').css("opacity",0.3);
						$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
						$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
						if (horecaTechDateTimePicker.data.stopwatch) {
							$("#now_button").html("<center>СТОП</center>");
							horecaTechDateTimePicker.data.iniTS=new Date().getTime()+horecaTechDateTimePicker.data.NowShift;
							horecaTechDateTimePicker.data.SecTS=horecaTechDateTimePicker.data.iniTS;
							for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
								hdtpicker_Process(level,Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000);
								hdtpicker_align(level,Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000,true);
							};
							$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1+Math.round((horecaTechDateTimePicker.data.iniTS-Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]])})
							hdtpicker_Timer.Resume(horecaTechDateTimePicker.data.now_timer);
						};
					} else
						hdtpicker_rollout(a,dir,level,TS,iterCnt,iter)
				},a,dir,level,TS,iterCnt,iter)
		};
		hdtpicker_Timer =(function() {
			var t=[],timercnt=0;
			return {
				Resume: function(c) { // возобновляет исполнение, по возможности в придыдущий график
					if (typeof(c)=='number' && t[c]!=null) {
						if (!t[c].active) {
							t[c].active=true;
							var timestamp=new Date().getTime();
							t[c].next=Math.max(timestamp,t[c].next);
							t[c].timer=setTimeout("hdtpicker_Timer.Execute("+c+");",Math.max(1,t[c].next-timestamp));
						};
						return c
					}
				},
				Stop : function (c) { // замораживает выполнение
					if (typeof(c)=='number' && t[c]!=null) {
						t[c].active=false
						clearTimeout(t[c].timer);
					}
				},
				Start : function() { // возобновляет исполнение или создает новый график
					if (!hdtpicker_Timer.Resume(arguments[0]) && (arguments[1]=='I' || arguments[1]=='D')) {
						var c=timercnt++,
							timestamp=new Date().getTime();
						t[c]={active:true,array:arguments,type:arguments[1],next:timestamp+arguments[2],counter:0,timer:setTimeout("hdtpicker_Timer.Execute("+c+");",arguments[2])};
						return c;
					} else 
						return arguments[0]
				},
				Execute : function (c) {
					if (c!=undefined && c!=null && t[c]!=null) {
						//t[c].stat='e';
						if (t[c].active) {
							var timestamp=new Date().getTime();
							t[c].next=timestamp+t[c].array[2];
							t[c].counter++;
							t[c].array[3](c,t[c].array[4],t[c].array[5],t[c].array[6],t[c].array[7],t[c].array[8],t[c].array[9],t[c].array[10]);
							if (t[c]!=null && t[c].type=='I') {
								var timestamp=new Date().getTime();
								t[c].timer=setTimeout("hdtpicker_Timer.Execute("+c+");",Math.max(1,t[c].next-timestamp));
							} else delete t[c];
						}
					}
				},
				Abort : function (c) { //удаляет график исполнения 
					if (typeof(c)=='number' && t[c]!=null) {
						clearTimeout(t[c].timer);
						delete t[c];
					};
				},
			}
		}()),
		hdtmovestart =function(event) {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				if (event.targetTouches!=null) {
					var touch=event.targetTouches[event.targetTouches.length-1];
					event.clientX=touch.clientX;
					event.clientY=touch.clientY;
				};
				horecaTechDateTimePicker.data.MouseDownPoint=event.clientY;
				horecaTechDateTimePicker.data.MouseLevel=$(this).attr("level");
				hdtpicker_Timer.Stop(horecaTechDateTimePicker.data.nowTimer);
				$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1});
				var level=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1],
					delta=Math.round((horecaTechDateTimePicker.data.iniTS-hdtpicker_datetruncateTS(horecaTechDateTimePicker.data.iniTS,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)-horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[level])/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]);
				$("#hdtpicker_level_"+level+"_holder").css({top:-horecaTechDateTimePicker.data.windowOffset+delta});
				$('.hdtpicker_mark').css("opacity",1);
				$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:0},100,function() {
					$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"none"});
				});
		},
		hdtmoveprogress =function(event) {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				if (event.targetTouches!=null) {
					event.clientX=event.targetTouches[0].clientX;
					event.clientY=event.targetTouches[0].clientY;
				};
				if (horecaTechDateTimePicker.data.MouseMove || (horecaTechDateTimePicker.data.MouseDownPoint && horecaTechDateTimePicker.data.MouseDownPoint!=event.clientY)) {
					horecaTechDateTimePicker.data.MouseMove=true;
					hdtpicker_Timer.Abort(horecaTechDateTimePicker.data.nowTimer);
					horecaTechDateTimePicker.data.stopwatch=false;
					$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].NOW+"</center>");
					hdtpicker_scroll(horecaTechDateTimePicker.data.MouseLevel,event);
				}
		},
		hdtmoveend =function(event) {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				if (event.targetTouches!=null) {
					event.clientX=event.targetTouches[0].clientX;
					event.clientY=event.targetTouches[0].clientY;
				};
				if (horecaTechDateTimePicker.data.MouseMove) {
					hdtpicker_scroll(horecaTechDateTimePicker.data.MouseLevel,event);
					horecaTechDateTimePicker.data.MouseMove=false;
					horecaTechDateTimePicker.data.MouseDownPoint=null;
					horecaTechDateTimePicker.data.iniTS=(horecaTechDateTimePicker.data.CurrentTS==null)?horecaTechDateTimePicker.data.iniTS:horecaTechDateTimePicker.data.CurrentTS;
					v=horecaTechDateTimePicker.data.scrollpar.Vy;
					if (Math.abs(v)<0.01) {
						for (var l in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
							hdtpicker_align(l,horecaTechDateTimePicker.data.iniTS);
						$('.hdtpicker_mark').css("opacity",0.3);
						$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
						$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
						if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FlagOnStop) {
							switch (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ResultMode) {
								case "time" :{var result=new Date(horecaTechDateTimePicker.data.iniTS);result=result.toLocaleString();$(horecaTechDateTimePicker.data.target).val(result);break;}
								case "date" :{var result=new Date(horecaTechDateTimePicker.data.iniTS);result=result.toLocaleDateString();$(horecaTechDateTimePicker.data.target).val(result);break;}
								case "object" : {
													var date=new Date(horecaTechDateTimePicker.data.iniTS),result={};
													for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
														result[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=date['get'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]();
													break;
												}
							};
							if (typeof (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onStop)=='function')
								horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onStop(horecaTechDateTimePicker.data.target,horecaTechDateTimePicker.data.iniTS,result);
						}
					} else {
						dir=(v>0)?1:-1;
						a=-0.005*dir;
						iniMark=new Date().getTime();
						hdtpicker_Timer.Start("","I",30,function(c,a,v,dir,level,iniMark) {
							var TS_=new Date().getTime()-iniMark;
							if (Math.abs(v)-Math.abs(a*TS_)>0.01) {
								TS_=horecaTechDateTimePicker.data.iniTS-(v*TS_+a*TS_*TS_/2)*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level];
								hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Index[level],TS_,dir);
								for (var l in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[level])
									hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[level][l],TS_);
							} else {
								TS_=horecaTechDateTimePicker.data.iniTS-Math.round(v*TS_+a*TS_*TS_/2)*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level];
								hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Index[level],TS_,dir);
								for (var l in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[level])
									hdtpicker_Process(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Dependence[level][l],TS_);
								hdtpicker_Timer.Abort(c)
								horecaTechDateTimePicker.data.iniTS=TS_;
								for (var l in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
									hdtpicker_align(l,horecaTechDateTimePicker.data.iniTS);
								$('.hdtpicker_mark').css("opacity",0.3);
								$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
								$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
								if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FlagOnStop) {
									switch (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ResultMode) {
										case "time" :{var result=new Date(horecaTechDateTimePicker.data.iniTS);result=result.toLocaleString();$(horecaTechDateTimePicker.data.target).val(result);break;}
										case "date" :{var result=new Date(horecaTechDateTimePicker.data.iniTS);result=result.toLocaleDateString();$(horecaTechDateTimePicker.data.target).val(result);break;}
										case "object" : {
															var date=new Date(horecaTechDateTimePicker.data.iniTS),result={};
															for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
																result[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=date['get'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]();
															break;
														}
									};
									if (typeof (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onStop)=='function')
										horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onStop(horecaTechDateTimePicker.data.target,horecaTechDateTimePicker.data.iniTS,result);
								}
							} 
						},a,v,dir,horecaTechDateTimePicker.data.MouseLevel,iniMark)
					}
				}
		};
	$.fn.HorecaTechDateTimePickerIni4HorecaTech = function() {
		label_prop("4",function() {
			horecaTechDateTimePicker.opt.DONE=label_object["4"].label["1"].name.replace(/"/g, '&quot')
			horecaTechDateTimePicker.opt.STOP=label_object["4"].label["2"].name.replace(/"/g, '&quot')
			horecaTechDateTimePicker.opt.NOW=label_object["4"].label["3"].name.replace(/"/g, '&quot')
			horecaTechDateTimePicker.opt.Rep.Month=JSON.parse(label_object["4"].label["4"].name);
		});
	};
	$.fn.HorecaTechDateTimePicker = function(opt) {
		if ($(this).attr("pickerid")==null) {
			$(this).attr("pickerid",horecaTechDateTimePicker.counter++);
		};
		var targetID=$(this).attr("pickerid");
		var opt_=$.extend(true,{},horecaTechDateTimePicker.opt);
		horecaTechDateTimePicker.tarOpt[targetID]=$.extend(true,opt_,opt);
		horecaTechDateTimePicker.tarOpt[targetID].LevelSet=(opt.LevelSet==null)?horecaTechDateTimePicker.tarOpt[targetID].LevelSet:opt.LevelSet;
		horecaTechDateTimePicker.tarOpt[targetID].Dependence={};
		if (horecaTechDateTimePicker.tarOpt[targetID].onStop=="onClose")
			horecaTechDateTimePicker.tarOpt[targetID].onStop=horecaTechDateTimePicker.tarOpt[targetID].onClose;
		if (horecaTechDateTimePicker.tarOpt[targetID].inProgress=="onStop")
			horecaTechDateTimePicker.tarOpt[targetID].inProgress=horecaTechDateTimePicker.tarOpt[targetID].onStop
		else if (horecaTechDateTimePicker.tarOpt[targetID].inProgress=="onClose")
			horecaTechDateTimePicker.tarOpt[targetID].inProgress=horecaTechDateTimePicker.tarOpt[targetID].onClose;
		for (var level in horecaTechDateTimePicker.tarOpt[targetID].LevelSet) {
			var Level_=horecaTechDateTimePicker.tarOpt[targetID].LevelSet[level];
			horecaTechDateTimePicker.tarOpt[targetID].Dependence[Level_]=[];
			for (var innerlevel in horecaTechDateTimePicker.tarOpt[targetID].LevelSet) 
				if (level!=innerlevel)
					horecaTechDateTimePicker.tarOpt[targetID].Dependence[Level_].push(horecaTechDateTimePicker.opt.Index[horecaTechDateTimePicker.tarOpt[targetID].LevelSet[innerlevel]]);
		};
		this.on("click.htdatetime",function(e) {
			e.stopPropagation();
			horecaTechDateTimePicker.data.target=this;
			horecaTechDateTimePicker.data.targetID=$(this).attr("pickerid");
			horecaTechDateTimePicker.data.MouseDownPoint=null;
			horecaTechDateTimePicker.data.MouseLevel=null;
			horecaTechDateTimePicker.data.CurrentTS=null;
			horecaTechDateTimePicker.data.SecTS=null;
			horecaTechDateTimePicker.data.iniTS=null;
			horecaTechDateTimePicker.data.nowTimer=null;
			horecaTechDateTimePicker.data.MouseMove=false;
			horecaTechDateTimePicker.data.NowShift=0;
			horecaTechDateTimePicker.data.ScrollTop={};
			horecaTechDateTimePicker.data.RollerTS={};
			horecaTechDateTimePicker.data.Prev={};
			horecaTechDateTimePicker.data.Next={};
			horecaTechDateTimePicker.data.widthMark={};
			horecaTechDateTimePicker.data.Cur={};
			horecaTechDateTimePicker.data.scrollHistory={};
			horecaTechDateTimePicker.data.lineHeight=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor*2)*2;
			horecaTechDateTimePicker.data.windowHeight=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor*horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].WindowHeightFactor/2)*2;
			horecaTechDateTimePicker.data.marginSize=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor*0.75);
			horecaTechDateTimePicker.data.mainFontSize=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor*3);
			horecaTechDateTimePicker.data.buttonFontSize=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor*2.5);
			horecaTechDateTimePicker.data.separatorWidth=Math.ceil(horecaTechDateTimePicker.data.mainFontSize/4);
			horecaTechDateTimePicker.data.frameBorderWidth=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameBorderWidth==null)?Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor/4):horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].borderWidth;
			horecaTechDateTimePicker.data.frameBorderColor=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameBorderColor==null)?horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TextColor:horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameBorderColor;
			horecaTechDateTimePicker.data.frameShadowColor=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowColor==null)?"black":horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowColor;
			horecaTechDateTimePicker.data.frameShadowOffsetX=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowOffsetX==null)?Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor/4):horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowOffsetX;
			horecaTechDateTimePicker.data.frameShadowOffsetY=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowOffsetY==null)?Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor/4):horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowOffsetY;
			horecaTechDateTimePicker.data.frameShadowRadius=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowRaduis==null)?Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor/1.5):horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameShadowRadius;
			horecaTechDateTimePicker.data.barShadowOffset=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor/4);
			horecaTechDateTimePicker.data.barShadowRadius=Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SizeFactor/2);
			horecaTechDateTimePicker.data.textFontFamily=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TextFontFamily==null)?$('body').css('font-family'):horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TextFontFamily;
			horecaTechDateTimePicker.data.selectedTextFontFamily=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedTextFontFamily==null)?horecaTechDateTimePicker.data.textFontFamily:horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedTextFontFamily;
			horecaTechDateTimePicker.data.selectedFontWeight=(horecaTechDateTimePicker.data.textFontFamily==horecaTechDateTimePicker.data.selectedTextFontFamily)?"bold":"normal";
			horecaTechDateTimePicker.data.Container=(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Container=='body')?'body':'#'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Container;
			horecaTechDateTimePicker.data.windowOffset=0;
			var acc=0,str="";
			$("#hdtpicker_frame").remove();
			$(horecaTechDateTimePicker.data.Container).append('<div id="hdtpicker_frame" class="hdtpicker_frame"><div id="hdtpicker_button_panel" class="hdtpicker_button_panel"><span id="hdtpicker_now_button" class="hdtpicker_buttons" ></span><span id="hdtpicker_done_button" class="hdtpicker_buttons"><center>'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].DONE+'</center></span></div><div id="hdtpicker_holder" class="hdtpicker_holder"><div id="hdtpicker_bar" class="hdtpicker_bar"></div></div></div>');
			for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
				horecaTechDateTimePicker.data.windowOffset=Math.max(horecaTechDateTimePicker.data.windowOffset,Math.round(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]*1.2)*2);
				horecaTechDateTimePicker.data.widthMark[level]={left:acc+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]],left_middle:acc+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]/10,middle:acc+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]/2,right_middle:acc+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]*9/10,right:acc+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]};
				if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Separator[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]!="")
					$("#hdtpicker_bar").append("<span class=\"hdtpicker_separator\" style=\"WIDTH:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SeparatorWidth[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+"px;LEFT:"+(acc-(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SeparatorWidth[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]-horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]])/2)+"px\">"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Separator[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+"</span>");
				acc+=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]];
				horecaTechDateTimePicker.data.Cur[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=horecaTechDateTimePicker.data.Prev[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=horecaTechDateTimePicker.data.Next[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]={};
				horecaTechDateTimePicker.data.ScrollTop[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=horecaTechDateTimePicker.data.RollerTS[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=0;
				$("#hdtpicker_holder").append("<div level=\""+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]+"\" id=\"hdtpicker_level_"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]+"_holder\" class=\"hdtpicker_column_holder\" style=\"MARGIN-LEFT:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+"px;WIDTH:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+"px\"><div id=\"hdtpicker_bar"+level+"\" class=\"hdtpicker_column_bar\"></div><div id=\"p"+level+"\" class=\"hdtpicker_mark\"></div></div>");
				$("#hdtpicker_bar").append("<div level=\""+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]+"\" id=\"hdtpicker_bar_"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]+"\" class=\"hdtpicker_column_bar_button\" style=\"MARGIN-LEFT:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnMargin[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+"px;WIDTH:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Width[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]+"px\"></div>");
			};
			for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
				str+=","+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedBarBackgroundColor+"1)"+(horecaTechDateTimePicker.data.widthMark[level].left/acc*100)+"%,"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedBarBackgroundColor+"0.1)"+(horecaTechDateTimePicker.data.widthMark[level].left_middle/acc*100)+"%,"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedBarBackgroundColor+"0)"+(horecaTechDateTimePicker.data.widthMark[level].middle/acc*100)+"%,"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedBarBackgroundColor+"0.1)"+(horecaTechDateTimePicker.data.widthMark[level].right_middle/acc*100)+"%,"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedBarBackgroundColor+"1)"+(horecaTechDateTimePicker.data.widthMark[level].right/acc*100)+"%";
			};
			$("#hdtpicker_frame").append("<style>.hdtpicker_holder {		margin: "+horecaTechDateTimePicker.data.marginSize+"px;		font-size:"+horecaTechDateTimePicker.data.mainFontSize+"px;		width:auto;		overflow:hidden;		height:"+horecaTechDateTimePicker.data.windowHeight+"px;		position:relative;		display:block;	}	.hdtpicker_column_holder {		overflow:hidden;		height:"+(horecaTechDateTimePicker.data.windowHeight+horecaTechDateTimePicker.data.windowOffset*2)+"px;		top: -"+horecaTechDateTimePicker.data.windowOffset+"px;		display:inline-block;		position: relative;		background-image : "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ColumnBackgroundImage+";	}	.hdtpicker_container {		width:100%;		position: absolute;		left:0px;	}	.hdtpicker_cell {		width:100%;		text-align:center;		vertical-align:baseline;		display:block;		background-image : "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].CellBackgroundImage+";		cursor:arrow;	}	.hdtpicker_mark {		height:2px;		width:100%;		position:absolute;		top:"+(horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1)+"px;		background-color:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].MarkColor+";		opacity:0.3;	}	.hdtpicker_bar {		height:"+horecaTechDateTimePicker.data.lineHeight+"px;		top:"+(horecaTechDateTimePicker.data.windowHeight/2-horecaTechDateTimePicker.data.lineHeight/2)+"px;		position: absolute;		opacity:0;		z-index:1;		box-shadow: 0px "+horecaTechDateTimePicker.data.barShadowOffset+"px "+horecaTechDateTimePicker.data.barShadowRadius+"px "+horecaTechDateTimePicker.data.frameShadowColor+";		border-left:none;border-right:none;border-bottom: 1px solid "+horecaTechDateTimePicker.data.frameBorderColor+";border-top: 1px solid "+horecaTechDateTimePicker.data.frameBorderColor+";		margin-top:-1;		margin-left:-1;	}	.hdtpicker_column_bar {		opacity:0;		background-color:"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedBarBackgroundColor+"1);		height:"+horecaTechDateTimePicker.data.lineHeight+"px;		width:100%;		position: absolute;		cursor:arrow;	}	.hdtpicker_column_bar_button {		height:100%;		background-color:tranparent;		position:relative;		display:inline-block;	}	.hdtpicker_button_panel {		background-image : "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ButtonBackgroundImage+";		margin: "+horecaTechDateTimePicker.data.marginSize+"px;		height:"+horecaTechDateTimePicker.data.lineHeight+"px;		width:100%;		position: relative;		display: block;	}	.hdtpicker_buttons {		width: 50%;		margin: auto;		color: "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedTextColor+";		font-size: "+horecaTechDateTimePicker.data.buttonFontSize+"px;		line-height:"+horecaTechDateTimePicker.data.lineHeight+"px;		position: relative;		display: inline-block;		cursor:arrow;	}	.hdtpicker_frame{		"+((horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameBackgroundImage==null)?("background-color: "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameBackgroundColor):("background-image : "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FrameBackgroundImage))+";		padding:1px;		display:block;		position:fixed;		z-index:20;		box-shadow: "+horecaTechDateTimePicker.data.frameShadowOffsetX+"px "+horecaTechDateTimePicker.data.frameShadowOffsetY+"px "+horecaTechDateTimePicker.data.frameShadowRadius+"px "+horecaTechDateTimePicker.data.frameShadowColor+";		-webkit-touch-callout: none;		-webkit-user-select: none;		-khtml-user-select: none;		-moz-user-select: none;		-ms-user-select: none;		user-select: none;		font-family: "+horecaTechDateTimePicker.data.selectedTextFontFamily+";		font-size: "+horecaTechDateTimePicker.data.mainFontSize+"px;		opacity:0;		border: "+horecaTechDateTimePicker.data.frameBorderWidth+"px outset "+horecaTechDateTimePicker.data.frameBorderColor+";	}	.hdtpicker_separator {		width:"+horecaTechDateTimePicker.data.separatorWidth+"px;		display:block;		position:absolute;		font-weight:"+horecaTechDateTimePicker.data.selectedFontWeight+";		color: "+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].SelectedTextColor+";		line-height:"+horecaTechDateTimePicker.data.lineHeight+"px;		top:0px;	}</style>");
			$("#hdtpicker_holder,#hdtpicker_button_panel").width(acc);
			$("#hdtpicker_frame").width(acc+horecaTechDateTimePicker.data.marginSize*2);
			$("#hdtpicker_bar").css({backgroundImage:"-webkit-linear-gradient(left"+str+")",width:acc});
			$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
			$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
			$("#hdtpicker_level_"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]+"_holder").stop().css({top:-horecaTechDateTimePicker.data.windowOffset-horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]]/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]]});	
			$("#hdtpicker_frame").width(acc+horecaTechDateTimePicker.data.marginSize*2);
			$("#hdtpicker_frame").animate({opacity:1},200);
			var fr_height=$("#hdtpicker_frame").height(),
				fr_width=$("#hdtpicker_frame").width(),
				coord=horecaTechDateTimePicker.data.target.getBoundingClientRect(),
				scr_height=$(window).height(),
				scr_width=$(window).width();
			if (scr_height-coord.bottom>=fr_height) {
				$("#hdtpicker_frame").css({top:coord.bottom})
			} else if (coord.top>=fr_height) {
				$("#hdtpicker_frame").css({top:coord.top-fr_height})
			} else {
				$("#hdtpicker_frame").css({top:(scr_height-fr_height)/2})
			};
			if (scr_width-coord.left>=fr_width) {
				$("#hdtpicker_frame").css({left:coord.left})
			} else if (scr_width-coord.right>=fr_height) {
				$("#hdtpicker_frame").css({left:coord.right-fr_width})
			} else {
				$("#hdtpicker_frame").css({left:(scr_width-fr_width)/2})
			};
			horecaTechDateTimePicker.data.stopwatch=false;
			if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TS!==undefined)
				horecaTechDateTimePicker.data.iniTS=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TS;
			else if ($(horecaTechDateTimePicker.data.target).attr("ts")!="" && $(horecaTechDateTimePicker.data.target).attr("ts")!="0" && $(horecaTechDateTimePicker.data.target).attr("ts")!==undefined && $(horecaTechDateTimePicker.data.target).attr("ts")!=null)
				horecaTechDateTimePicker.data.iniTS = parseInt($(horecaTechDateTimePicker.data.target).attr("ts"));
			else {
				horecaTechDateTimePicker.data.iniTS=new Date().getTime();
				horecaTechDateTimePicker.data.stopwatch=true
			};
			horecaTechDateTimePicker.data.SecTS=horecaTechDateTimePicker.data.iniTS;
			for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
				hdtpicker_Process(level,horecaTechDateTimePicker.data.iniTS);
				hdtpicker_align(level,horecaTechDateTimePicker.data.iniTS);
			};
			if (horecaTechDateTimePicker.data.stopwatch) {
				$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].STOP+"</center>");
				horecaTechDateTimePicker.data.nowTimer=hdtpicker_Timer.Start("","I",1000/100,function() {
					horecaTechDateTimePicker.data.iniTS=new Date().getTime()+horecaTechDateTimePicker.data.NowShift;
					if (Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000==Math.floor(horecaTechDateTimePicker.data.SecTS/1000)*1000) {
						$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1+Math.round((horecaTechDateTimePicker.data.iniTS-Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]])})
					} else {
						horecaTechDateTimePicker.data.SecTS=horecaTechDateTimePicker.data.iniTS;
						for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
							hdtpicker_Process(level,horecaTechDateTimePicker.data.iniTS);
							if (level<=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)
								hdtpicker_align(level,horecaTechDateTimePicker.data.iniTS,true);
						};
						$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
						$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
					};
				})	
			} else {
				$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].NOW+"</center>");
			}
			$(".hdtpicker_column_bar_button").on("click",function (event) {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				if (horecaTechDateTimePicker.data.MouseMove)
					null;
				else {
					hdtpicker_Timer.Abort(horecaTechDateTimePicker.data.nowTimer);
					horecaTechDateTimePicker.data.stopwatch=false;
					$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].NOW+"</center>");
					horecaTechDateTimePicker.data.MouseMove=false;
					horecaTechDateTimePicker.data.MouseDownPoint=null;
					var level=$(this).attr("level"),
						TS=hdtpicker_datetruncateTS(horecaTechDateTimePicker.data.iniTS,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].Index[level]);
					iterCnt=Math.ceil(Math.pow(Math.abs(TS-horecaTechDateTimePicker.data.iniTS)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[level],0.5)*2.5)*2;
					if (iterCnt>0)
						hdtpicker_rollout((TS-horecaTechDateTimePicker.data.iniTS)/Math.pow(iterCnt/2,2),(horecaTechDateTimePicker.data.iniTS>TS)?1:-1,level,TS,iterCnt,1)
				}
			})
			$(document).on("touchmove",hdtmoveprogress);
			$(document).on("mousemove",hdtmoveprogress);
			$(document).on("touchend",hdtmoveend);
			$(document).on("mouseup",hdtmoveend);
//			$(document).on("mouseleave",hdtmoveend);
			$(".hdtpicker_column_holder").on("touchstart",hdtmovestart);
			$(".hdtpicker_column_holder").on("mousedown",hdtmovestart);
			$(".hdtpicker_column_holder,.hdtpicker_column_bar_button").on("mousewheel", function(event) {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				hdtpicker_Timer.Abort(horecaTechDateTimePicker.data.nowTimer);
				horecaTechDateTimePicker.data.stopwatch=false;
				$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].NOW+"</center>");			
				$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1});
				var level=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1],
					delta=Math.round((horecaTechDateTimePicker.data.iniTS-hdtpicker_datetruncateTS(horecaTechDateTimePicker.data.iniTS,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)-horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor__[level])/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[level]);
				$("#hdtpicker_level_"+level+"_holder").css({top:-horecaTechDateTimePicker.data.windowOffset+delta});
				$('.hdtpicker_mark').css("opacity",1);
				$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:0},100,function() {
					$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"none"});
				});
				var shift=(event.originalEvent.wheelDeltaY<1)?-1:1,
					level=$(this).attr("level"),
					step=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].WheelStep[level]*shift,
					date_=new Date((horecaTechDateTimePicker.data.RollerTS[level]==0)?horecaTechDateTimePicker.data.iniTS:horecaTechDateTimePicker.data.RollerTS[level]);
					horecaTechDateTimePicker.data.RollerTS[level]=date_['set'+level](date_['get'+level]()+step);
					horecaTechDateTimePicker.data.iniTS=horecaTechDateTimePicker.data.RollerTS[level];
					horecaTechDateTimePicker.data.RollerTS[level]=0;
							for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
								hdtpicker_Process(level,horecaTechDateTimePicker.data.iniTS);
								hdtpicker_align(level,horecaTechDateTimePicker.data.iniTS);
							};
							$('.hdtpicker_mark').css("opacity",0.3);
							$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
							$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
			})
			$("#hdtpicker_now_button").on("touchstart.hdtdatetime mousedown.hdtdatetime",function() {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				if (horecaTechDateTimePicker.data.stopwatch) {
					horecaTechDateTimePicker.data.stopwatch=false;
					$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].NOW+"</center>");
					hdtpicker_Timer.Abort(horecaTechDateTimePicker.data.nowTimer);
					$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1});
					for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
						hdtpicker_Process(level,horecaTechDateTimePicker.data.iniTS);
						hdtpicker_align(level,horecaTechDateTimePicker.data.iniTS);
					};
				} else {
					horecaTechDateTimePicker.data.stopwatch=true;
					horecaTechDateTimePicker.data.NowShift=0;
					$("#hdtpicker_now_button").html("<center>"+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].STOP+"</center>");
					horecaTechDateTimePicker.data.iniTS=new Date().getTime()+horecaTechDateTimePicker.data.NowShift;
					horecaTechDateTimePicker.data.SecTS=horecaTechDateTimePicker.data.iniTS;
					for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
						hdtpicker_Process(level,Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000);
						hdtpicker_align(level,Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000,true);
					};
					$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1+Math.round((horecaTechDateTimePicker.data.iniTS-Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]])})
					horecaTechDateTimePicker.data.nowTimer=hdtpicker_Timer.Start("","I",1000/100,function() {
						horecaTechDateTimePicker.data.iniTS=new Date().getTime()+horecaTechDateTimePicker.data.NowShift;
						if (Math.floor(horecaTechDateTimePicker.data.iniTS/1000)==Math.floor(horecaTechDateTimePicker.data.SecTS/1000)) {
							$("#p"+(horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)).css({top:horecaTechDateTimePicker.data.windowHeight/2+horecaTechDateTimePicker.data.windowOffset-1+Math.round((horecaTechDateTimePicker.data.iniTS-Math.floor(horecaTechDateTimePicker.data.iniTS/1000)*1000)/horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].HeightFactor[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1]])})
						} else {
							horecaTechDateTimePicker.data.SecTS=horecaTechDateTimePicker.data.iniTS;
							for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet) {
								hdtpicker_Process(level,horecaTechDateTimePicker.data.iniTS);
								if (level<=horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1)
									hdtpicker_align(level,horecaTechDateTimePicker.data.iniTS,true);
							};
							$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
							$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
						};
					})	
				}
			});
			$("#hdtpicker_done_button").on("touchstart.hdtdatetime mousedown.hdtdatetime",function() {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				$("#hdtpicker_frame").remove();
				$(document).off("mousedown.hdtdatetime touchstart.hdtdatetime keydown.hdtdatetime scroll.hdtdatetime");
				hdtpicker_Timer.Abort(horecaTechDateTimePicker.data.nowTimer);
				if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TruncateResult)
					horecaTechDateTimePicker.data.iniTS=hdtpicker_datetruncateTS(horecaTechDateTimePicker.data.iniTS,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1);
				switch (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ResultMode) {
					case "time" :{var result=new Date(horecaTechDateTimePicker.data.iniTS);result=result.toLocaleString();$(horecaTechDateTimePicker.data.target).val(result);break;}
					case "date" :{var result=new Date(horecaTechDateTimePicker.data.iniTS);result=result.toLocaleDateString();$(horecaTechDateTimePicker.data.target).val(result);break;}
					case "object" : {
										var date=new Date(horecaTechDateTimePicker.data.iniTS),result={};
										for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
											result[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=date['get'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]();
										break;
									}
				};
				if (typeof (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onClose)=='function')
					horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onClose(horecaTechDateTimePicker.data.target,horecaTechDateTimePicker.data.iniTS,result);
			});
			$("#hdtpicker_frame").on("mousedown.hdtdatetime touchstart.hdtdatetime keydown.hdtdatetime",function(e) {
				e.stopPropagation();
			});
			$(document).on("mousedown.hdtdatetime touchstart.hdtdatetime keydown.hdtdatetime",function(event) {
				$("#hdtpicker_frame").remove();
				$(document).off("mousedown.hdtdatetime touchstart.hdtdatetime keydown.hdtdatetime scroll.hdtdatetime");
				hdtpicker_Timer.Abort(horecaTechDateTimePicker.data.nowTimer);
				if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FlagOnBlur || horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FlagOnStop || horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].FlagInProgress) {
					if (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].TruncateResult)
						horecaTechDateTimePicker.data.iniTS=hdtpicker_datetruncateTS(horecaTechDateTimePicker.data.iniTS,horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet.length-1);
					switch (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].ResultMode) {
						case "time" :{var result=new Date(horecaTechDateTimePicker.data.iniTS).toLocaleString();$(horecaTechDateTimePicker.data.target).val(result);break;}
						case "date" :{var result=new Date(horecaTechDateTimePicker.data.iniTS).toLocaleDateString();$(horecaTechDateTimePicker.data.target).val(result);break;}
						case "object" : {
											var date=new Date(horecaTechDateTimePicker.data.iniTS),result={};
											for (var level in horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet)
												result[horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]=date['get'+horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].LevelSet[level]]();
											break;
										}
					};
					$(horecaTechDateTimePicker.data.target).attr('ts',horecaTechDateTimePicker.data.iniTS);
					if (typeof (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onBlur)=='function')
						horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onBlur(horecaTechDateTimePicker.data.target,horecaTechDateTimePicker.data.iniTS,result);
					else if (typeof (horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onClose)=='function')
						horecaTechDateTimePicker.tarOpt[horecaTechDateTimePicker.data.targetID].onClose(horecaTechDateTimePicker.data.target,horecaTechDateTimePicker.data.iniTS,result);
				}
			});
		});
	};	
}(jQuery));
