//  Dmitriy Guryanov

(function ($) {
	var hdtdata={},
		targethdtoptions={},
		hdtoptions = {
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
			TruncateResult:false
		},	
		hdtpicker_datetruncate = function (TS,level_indx) {
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
			var level=targethdtoptions[hdtdata.targetID].LevelSet[level_indx],
				delta=Math.round((TS-hdtpicker_datetruncateTS(TS,level_indx)-targethdtoptions[hdtdata.targetID].HeightFactor__[level])/targethdtoptions[hdtdata.targetID].HeightFactor[level]),
				oldtop=parseInt($("#hdtpicker_level_"+level+"_holder").css('top').substr(0,$("#hdtpicker_level_"+level+"_holder").css('top').length-2));
//console.log(level,delta,TS,hdtpicker_datetruncateTS(TS,level_indx),$("#hdtpicker_level_"+level+"_holder").css('top'),oldtop);
				if (flag && Math.abs((-hdtdata.windowOffset+delta)-oldtop)<targethdtoptions[hdtdata.targetID].HeightFactor__[level]/targethdtoptions[hdtdata.targetID].HeightFactor[level]) {
					$("#hdtpicker_level_"+level+"_holder").css({top:-hdtdata.windowOffset+delta});
				} else {
					var time=Math.pow(Math.abs(-hdtdata.windowOffset+delta-oldtop),0.5)*75;
					$("#hdtpicker_level_"+level+"_holder").stop().animate({top:-hdtdata.windowOffset+delta},time);
				};
				$("#hdtpicker_bar"+level_indx).css({top:hdtdata.windowOffset+(hdtdata.windowHeight-hdtdata.lineHeight)/2-delta});
		},
		hdtpicker_Process = function (level_indx,TS,dir) {
			var level=targethdtoptions[hdtdata.targetID].LevelSet[level_indx],
				date_=hdtpicker_datetruncate(TS,level_indx),
				sel=Math.floor(new Date(date_).getTime()/1000)*1000;
			if (dir==null) {
				if (hdtdata.Cur[level].startTS!=null && TS+hdtdata.windowHeight/2*targethdtoptions[hdtdata.targetID].HeightFactor[level]<=hdtdata.Cur[level].endTS && TS-hdtdata.windowHeight/2*targethdtoptions[hdtdata.targetID].HeightFactor[level]>=hdtdata.Cur[level].startTS) {
					$("#"+level+hdtdata.Cur[level].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Cur[level].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
				} else
					hdtdata.Cur[level]=hdtpicker_getSet(TS,Math.floor(date_['set'+level](date_['get'+level]() - Math.floor(targethdtoptions[hdtdata.targetID].Span[level]/2))/1000)*1000,level);
				$("#hdtpicker_level_"+level+"_holder").children().not(".hdtpicker_column_bar,.hdtpicker_mark,#"+level+hdtdata.Cur[level].startTS).remove();
				delete hdtdata.Next[level][hdtdata.Cur[level].endTS];
				delete hdtdata.Prev[level][hdtdata.Cur[level].prevTS];
			} else if (dir==-1) {
				var StartTS=hdtdata.Cur[level].endTS;
				if (hdtdata.Next[level][hdtdata.Cur[level].endTS]==null)
					hdtdata.Next[level][StartTS]=hdtpicker_getSet(TS,StartTS,level)
				else if (TS-hdtdata.windowHeight/2*targethdtoptions[hdtdata.targetID].HeightFactor[level]>hdtdata.Next[level][hdtdata.Cur[level].endTS].endTS) {
					$("#level"+hdtdata.Next[level][StartTS].startTS).remove();
					var StartTS=Math.floor(date_['set'+level](date_['get'+level]() - Math.floor(targethdtoptions[hdtdata.targetID].Span[level]/2))/1000)*1000;
					hdtdata.Next[level][StartTS]=hdtpicker_getSet(TS,StartTS,level);
					var n=true;
				};
				if (TS-hdtdata.windowHeight/2*targethdtoptions[hdtdata.targetID].HeightFactor[level]>hdtdata.Cur[level].endTS || n) {
					hdtdata.Cur[level]={prevTS:hdtdata.Next[level][StartTS].prevTS,startTS:hdtdata.Next[level][StartTS].startTS,endTS:hdtdata.Next[level][StartTS].endTS};
					$("#hdtpicker_level_"+level+"_holder").children().not(".hdtpicker_column_bar,.hdtpicker_mark,#"+level+hdtdata.Cur[level].startTS).remove();
					delete hdtdata.Next[level][hdtdata.Cur[level].endTS];
					delete hdtdata.Prev[level][hdtdata.Cur[level].prevTS];
			//console.log(level);
				} else {
		//console.log(level,TS,hdtdata.Cur[level].startTS,targethdtoptions[hdtdata.targetID].HeightFactor[level]);
					$("#"+level+hdtdata.Cur[level].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Cur[level].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
					if (hdtdata.Prev[level][hdtdata.Cur[level].prevTS]!=null) $("#"+level+hdtdata.Prev[level][hdtdata.Cur[level].prevTS].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Prev[level][hdtdata.Cur[level].prevTS].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
					if (hdtdata.Next[level][hdtdata.Cur[level].endTS]!=null) $("#"+level+hdtdata.Next[level][hdtdata.Cur[level].endTS].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Next[level][hdtdata.Cur[level].endTS].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
				}
			} else if (dir==1) {
				var StartTS=hdtdata.Cur[level].prevTS;
				if (hdtdata.Prev[level][hdtdata.Cur[level].prevTS]==null)
					hdtdata.Prev[level][StartTS]=hdtpicker_getSet(TS,StartTS,level)
				else if (TS+hdtdata.windowHeight/2*targethdtoptions[hdtdata.targetID].HeightFactor[level]<hdtdata.Prev[level][hdtdata.Cur[level].prevTS].startTS) {
					$("#"+level+hdtdata.Prev[level][hdtdata.Cur[level].prevTS].startTS).remove();
					var StartTS=Math.floor(date_['set'+level](date_['get'+level]() - Math.floor(targethdtoptions[hdtdata.targetID].Span[level]/2))/1000)*1000;
					hdtdata.Prev[level][StartTS]=hdtpicker_getSet(TS,StartTS,level);
					var n=true;
				};
				if (TS+hdtdata.windowHeight/2*targethdtoptions[hdtdata.targetID].HeightFactor[level]<hdtdata.Cur[level].startTS || n) {
					hdtdata.Cur[level]={prevTS:hdtdata.Prev[level][StartTS].prevTS,startTS:hdtdata.Prev[level][StartTS].startTS,endTS:hdtdata.Prev[level][StartTS].endTS};
					$("#hdtpicker_level_"+level+"_holder").children().not(".hdtpicker_column_bar,.hdtpicker_mark,#"+level+hdtdata.Cur[level].startTS).remove();
					delete hdtdata.Next[level][hdtdata.Cur[level].endTS];
					delete hdtdata.Prev[level][hdtdata.Cur[level].prevTS];
				} else {
		//console.log(level,TS,hdtdata.Cur[level].startTS,(TS-hdtdata.Cur[level].startTS),targethdtoptions[hdtdata.targetID].HeightFactor[level],hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Cur[level].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level]);
					$("#"+level+hdtdata.Cur[level].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Cur[level].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
					if (hdtdata.Prev[level][hdtdata.Cur[level].prevTS]!=null) $("#"+level+hdtdata.Prev[level][hdtdata.Cur[level].prevTS].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Prev[level][hdtdata.Cur[level].prevTS].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
					if (hdtdata.Next[level][hdtdata.Cur[level].endTS]!=null) $("#"+level+hdtdata.Next[level][hdtdata.Cur[level].endTS].startTS).css({top:Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-hdtdata.Next[level][hdtdata.Cur[level].endTS].startTS)/targethdtoptions[hdtdata.targetID].HeightFactor[level])});
				}
			};
			$("."+level+".hdtpicker_cell").not("#hdtpicker_cell"+level+sel).css({color:targethdtoptions[hdtdata.targetID].TextColor,fontWeight:"normal",fontFamily:hdtdata.textFontFamily});
			$("#hdtpicker_cell"+level+sel).css({color:targethdtoptions[hdtdata.targetID].SelectedTextColor,fontWeight:hdtdata.selectedFontWeight,fontFamily:hdtdata.selectedTextFontFamily});
		},
		hdtpicker_getSet = function(TS,starttimestamp,level) {
		//console.log(TS,starttimestamp,level);
			var str="",
				date_=new Date(starttimestamp),
				pos=starttimestamp,
				result={startTS:pos,prevTS:Math.floor(date_['set'+level](date_['get'+level]() - targethdtoptions[hdtdata.targetID].Span[level])/1000)*1000},
				nextpos,
				point,
				date;
			for (var i=0;i<targethdtoptions[hdtdata.targetID].Span[level];i++) {
				date = new Date(pos);
				point=date['get'+level]();
				nextpos=date['set'+level](point + 1);
		//console.log(pos,date,point,(point+"").length,nextpos);
				var height=(Math.round(nextpos/targethdtoptions[hdtdata.targetID].HeightFactor[level])-Math.round(pos/targethdtoptions[hdtdata.targetID].HeightFactor[level]));
				str+="<span level=\""+level+"\"pos=\""+pos+"\" id=\"hdtpicker_cell"+level+pos+"\" class=\""+level+" hdtpicker_cell\" style=\"HEIGHT:"+height+"px;LINE-HEIGHT:"+height+"px\">"+((targethdtoptions[hdtdata.targetID].Rep[level]==null)?('0000'.substr(0,targethdtoptions[hdtdata.targetID].Padding[level]-(point+"").length)+point):targethdtoptions[hdtdata.targetID].Rep[level][point])+"</span>";
				pos=nextpos;
			};
			$("#hdtpicker_level_"+level+"_holder").append("<div id=\""+level+starttimestamp+"\" class = \""+level+" hdtpicker_container\" style=\"TOP: "+Math.round(hdtdata.windowHeight/2+hdtdata.windowOffset-(TS-starttimestamp)/targethdtoptions[hdtdata.targetID].HeightFactor[level])+"px\">"+str+"</div>");
			result.endTS=pos;
			$("#"+level+starttimestamp).children().on("mouseup.htdatetime2",function (event) {
		//console.log('mu',hdtdata.iniTS,hdtdata.MouseMove);
				if (hdtdata.MouseMove)
					null;
				else {
					hdtdata.MouseMove=false;
					hdtdata.MouseDownPoint=null;
					event.stopPropagation();
					event.preventDefault();	
					event.cancelBubble=true;
					var TS=parseInt($(this).attr("pos")),
						level=$(this).attr("level"),
						TruncIniTS=hdtpicker_datetruncateTS(hdtdata.iniTS,targethdtoptions[hdtdata.targetID].Index[level]);
					if (TS!=TruncIniTS) {
						hdtdata.NowShift+=TS-TruncIniTS;
						TS+=hdtdata.iniTS-TruncIniTS;
						iterCnt=Math.round(Math.pow(Math.abs(TS-hdtdata.iniTS)/targethdtoptions[hdtdata.targetID].HeightFactor__[level],0.5)*2.5)*2;
				//console.log('TS-hdtdata.iniTS',TS,hdtdata.iniTS,iterCnt);
						if (iterCnt>0) {
							hdtpicker_rollout((TS-hdtdata.iniTS)/Math.pow(iterCnt/2,2),(hdtdata.iniTS>TS)?1:-1,level,TS,iterCnt,1)
						}
					};
				}
			})
			return result;
		},
		hdtpicker_ScrollPar = function(target,event) {
			if (hdtdata.scrollHistory[target]==null) 
				hdtdata.scrollHistory[target]=[];
				hdtdata.ScrollTop[target]=event.clientY-hdtdata.MouseDownPoint;
			var timestamp=new Date().getTime(),
				dump={};
			while (hdtdata.scrollHistory[target].length>0 && hdtdata.scrollHistory[target][0].T+100<timestamp) dump=hdtdata.scrollHistory[target].shift();
			if (hdtdata.scrollHistory[target].length>0) {
				var Yvelocity=(hdtdata.ScrollTop[target]-hdtdata.scrollHistory[target][0].Y)/(timestamp-hdtdata.scrollHistory[target][0].T),
					Yacceleration=(Yvelocity-hdtdata.scrollHistory[target][0].Vy)/(timestamp-hdtdata.scrollHistory[target][0].T),
					Ydirection=(Yvelocity>0)?1:(Yvelocity<0)?-1:0,
					Interval=(timestamp-hdtdata.scrollHistory[target][0].T)/hdtdata.scrollHistory[target].length;
			} else {
				var Yvelocity=0,
					Yacceleration=0,
					Ydirection=((hdtdata.ScrollTop[target]-dump.Y)>0)?1:((hdtdata.ScrollTop[target]-dump.Y)<0)?-1:0,
					Interval=0;
			};
			hdtdata.scrollHistory[target].push({T:timestamp,I:Interval,Y:hdtdata.ScrollTop[target],Vy:Yvelocity,Ay:Yacceleration,Dy:Ydirection,L:hdtdata.scrollHistory[target].length+1});
	//console.log(JSON.stringify(hdtdata.scrollHistory[target][hdtdata.scrollHistory[target].length-1]));
			return hdtdata.scrollHistory[target][hdtdata.scrollHistory[target].length-1];
		},
		hdtpicker_scroll = function (scrolllevel,event) {
			hdtdata.scrollpar=hdtpicker_ScrollPar(scrolllevel,event);
			hdtdata.CurrentTS=hdtdata.iniTS-hdtdata.scrollpar.Y*targethdtoptions[hdtdata.targetID].HeightFactor[scrolllevel];
			hdtpicker_Process(targethdtoptions[hdtdata.targetID].Index[hdtdata.MouseLevel],hdtdata.CurrentTS,hdtdata.scrollpar.Dy);
			for (var level in targethdtoptions[hdtdata.targetID].Dependence[hdtdata.MouseLevel])
				hdtpicker_Process(targethdtoptions[hdtdata.targetID].Dependence[hdtdata.MouseLevel][level],hdtdata.CurrentTS);
		},
		hdtpicker_rollout = function (a,dir,level,TS,iterCnt,iter) {
				hdtpicker_Timer.Start("","D",30,function(c,a,dir,level,TS,iterCnt,iter) {
					if (iter==iterCnt)
						TS_=TS;
					else if (iter*2>iterCnt)
						TS_=Math.floor((hdtdata.iniTS+(TS-hdtdata.iniTS)/2+a*iterCnt/2*(iter-iterCnt/2)-a*(iterCnt/2-iter)*(iterCnt/2-iter)/2)/1000)*1000;
					else
						TS_=Math.floor((hdtdata.iniTS+a*iter*iter/2)/1000)*1000;
	//console.log(TS,TS_,hdtdata.iniTS,(TS_-hdtdata.iniTS)/(TS-hdtdata.iniTS));
					hdtpicker_Process(targethdtoptions[hdtdata.targetID].Index[level],TS_);
					for (var l in targethdtoptions[hdtdata.targetID].Dependence[level])
						hdtpicker_Process(targethdtoptions[hdtdata.targetID].Dependence[level][l],TS_);
					if (iter++==iterCnt) {
						hdtdata.iniTS=TS;
						hdtdata.RollerTS[level]=0;
						for (var l in targethdtoptions[hdtdata.targetID].LevelSet)
							hdtpicker_align(l,hdtdata.iniTS);
						$('.hdtpicker_mark').css("opacity",0.3);
						$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
						$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
						if (hdtdata.stopwatch) {
							$("#now_button").html("<center>СТОП</center>");
							hdtdata.iniTS=new Date().getTime()+hdtdata.NowShift;
							hdtdata.SecTS=hdtdata.iniTS;
							for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
								hdtpicker_Process(level,Math.floor(hdtdata.iniTS/1000)*1000);
								hdtpicker_align(level,Math.floor(hdtdata.iniTS/1000)*1000,true);
							};
							$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1+Math.round((hdtdata.iniTS-Math.floor(hdtdata.iniTS/1000)*1000)/targethdtoptions[hdtdata.targetID].HeightFactor[targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]])})
							hdtpicker_Timer.Resume(hdtdata.now_timer);
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
			//console.log(c+" "+t[c].counter, t[c].array);
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
					event.clientX=event.targetTouches[0].clientX;
					event.clientY=event.targetTouches[0].clientY;
				};
				hdtdata.MouseDownPoint=event.clientY;
				hdtdata.MouseLevel=$(this).attr("level");
				hdtpicker_Timer.Stop(hdtdata.nowTimer);
				$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1});
				var level=targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1],
					delta=Math.round((hdtdata.iniTS-hdtpicker_datetruncateTS(hdtdata.iniTS,targethdtoptions[hdtdata.targetID].LevelSet.length-1)-targethdtoptions[hdtdata.targetID].HeightFactor__[level])/targethdtoptions[hdtdata.targetID].HeightFactor[level]);
				$("#hdtpicker_level_"+level+"_holder").css({top:-hdtdata.windowOffset+delta});
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
				if (hdtdata.MouseMove || (hdtdata.MouseDownPoint && hdtdata.MouseDownPoint!=event.clientY)) {
					hdtdata.MouseMove=true;
					hdtpicker_Timer.Abort(hdtdata.nowTimer);
					hdtdata.stopwatch=false;
					$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].NOW+"</center>");
					hdtpicker_scroll(hdtdata.MouseLevel,event);
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
				if (hdtdata.MouseMove) {
					hdtpicker_scroll(hdtdata.MouseLevel,event);
		//console.log('mu',hdtdata.MouseMove);
					hdtdata.MouseMove=false;
					hdtdata.MouseDownPoint=null;
					hdtdata.iniTS=(hdtdata.CurrentTS==null)?hdtdata.iniTS:hdtdata.CurrentTS;
					v=hdtdata.scrollpar.Vy;
					if (Math.abs(v)<0.01) {
						for (var l in targethdtoptions[hdtdata.targetID].LevelSet)
							hdtpicker_align(l,hdtdata.iniTS);
						$('.hdtpicker_mark').css("opacity",0.3);
						$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
						$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
					} else {
						dir=(v>0)?1:-1;
						a=-0.005*dir;
						iniMark=new Date().getTime();
			//console.log(v,a,dir,hdtdata.MouseLevel);
						hdtpicker_Timer.Start("","I",30,function(c,a,v,dir,level,iniMark) {
							var TS_=new Date().getTime()-iniMark;
			//console.log(level,hdtdata.iniTS,TS_,-a*TS_);
							if (Math.abs(v)-Math.abs(a*TS_)>0.01) {
			//console.log(v*TS_+a*TS_*TS_/2,(v*TS_+a*TS_*TS_/2)*targethdtoptions[hdtdata.targetID].HeightFactor[level]);
								TS_=hdtdata.iniTS-(v*TS_+a*TS_*TS_/2)*targethdtoptions[hdtdata.targetID].HeightFactor[level];
			//console.log(TS_);
								hdtpicker_Process(targethdtoptions[hdtdata.targetID].Index[level],TS_,dir);
								for (var l in targethdtoptions[hdtdata.targetID].Dependence[level])
									hdtpicker_Process(targethdtoptions[hdtdata.targetID].Dependence[level][l],TS_);
							} else {
								TS_=hdtdata.iniTS-Math.round(v*TS_+a*TS_*TS_/2)*targethdtoptions[hdtdata.targetID].HeightFactor[level];
			//console.log(TS_);
								hdtpicker_Process(targethdtoptions[hdtdata.targetID].Index[level],TS_,dir);
								for (var l in targethdtoptions[hdtdata.targetID].Dependence[level])
									hdtpicker_Process(targethdtoptions[hdtdata.targetID].Dependence[level][l],TS_);
								hdtpicker_Timer.Abort(c)
								hdtdata.iniTS=TS_;
								for (var l in targethdtoptions[hdtdata.targetID].LevelSet)
									hdtpicker_align(l,hdtdata.iniTS);
								$('.hdtpicker_mark').css("opacity",0.3);
								$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
								$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
							} 
						},a,v,dir,hdtdata.MouseLevel,iniMark)
					}
				}
		};
	$.fn.HorecaTechDateTimePickerIni4HorecaTech = function() {
		label_prop("4",function() {
			hdtoptions.DONE=label_object["4"].label["1"].name.replace(/"/g, '&quot')
			hdtoptions.STOP=label_object["4"].label["2"].name.replace(/"/g, '&quot')
			hdtoptions.NOW=label_object["4"].label["3"].name.replace(/"/g, '&quot')
			hdtoptions.Rep.Month=JSON.parse(label_object["4"].label["4"].name);
		});
	};
	$.fn.HorecaTechDateTimePicker = function(opt) {
		var opt_=$.extend(true,{},hdtoptions);
		targethdtoptions[this.attr("id")]=$.extend(true,opt_,opt);
		targethdtoptions[this.attr("id")].LevelSet=(opt.LevelSet==null)?targethdtoptions[this.attr("id")].LevelSet:opt.LevelSet;
		targethdtoptions[this.attr("id")].Dependence={};
		for (var level in targethdtoptions[this.attr("id")].LevelSet) {
			var Level_=targethdtoptions[this.attr("id")].LevelSet[level];
			targethdtoptions[this.attr("id")].Dependence[Level_]=[];
			for (var innerlevel in targethdtoptions[this.attr("id")].LevelSet) 
				if (level!=innerlevel)
					targethdtoptions[this.attr("id")].Dependence[Level_].push(hdtoptions.Index[targethdtoptions[this.attr("id")].LevelSet[innerlevel]]);
		};
		this.on("click.htdatetime",function(e) {
			e.stopPropagation();
			hdtdata.target=this;
			hdtdata.targetID=$(this).attr("id");
			hdtdata.MouseDownPoint=null;
			hdtdata.MouseLevel=null;
			hdtdata.CurrentTS=null;
			hdtdata.SecTS=null;
			hdtdata.iniTS=null;
			hdtdata.nowTimer=null;
			hdtdata.MouseMove=false;
			hdtdata.NowShift=0;
			hdtdata.ScrollTop={};
			hdtdata.RollerTS={};
			hdtdata.Prev={};
			hdtdata.Next={};
			hdtdata.widthMark={};
			hdtdata.Cur={};
			hdtdata.scrollHistory={};
			hdtdata.lineHeight=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor*2)*2;
			hdtdata.windowHeight=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor*targethdtoptions[hdtdata.targetID].WindowHeightFactor/2)*2;
			hdtdata.marginSize=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor*0.75);
			hdtdata.mainFontSize=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor*3);
			hdtdata.buttonFontSize=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor*2.5);
			hdtdata.separatorWidth=Math.ceil(hdtdata.mainFontSize/4);
			hdtdata.frameBorderWidth=(targethdtoptions[hdtdata.targetID].FrameBorderWidth==null)?Math.round(targethdtoptions[hdtdata.targetID].SizeFactor/4):targethdtoptions[hdtdata.targetID].borderWidth;
			hdtdata.frameBorderColor=(targethdtoptions[hdtdata.targetID].FrameBorderColor==null)?targethdtoptions[hdtdata.targetID].TextColor:targethdtoptions[hdtdata.targetID].FrameBorderColor;
			hdtdata.frameShadowColor=(targethdtoptions[hdtdata.targetID].FrameShadowColor==null)?"black":targethdtoptions[hdtdata.targetID].FrameShadowColor;
			hdtdata.frameShadowOffsetX=(targethdtoptions[hdtdata.targetID].FrameShadowOffsetX==null)?Math.round(targethdtoptions[hdtdata.targetID].SizeFactor/4):targethdtoptions[hdtdata.targetID].FrameShadowOffsetX;
			hdtdata.frameShadowOffsetY=(targethdtoptions[hdtdata.targetID].FrameShadowOffsetY==null)?Math.round(targethdtoptions[hdtdata.targetID].SizeFactor/4):targethdtoptions[hdtdata.targetID].FrameShadowOffsetY;
			hdtdata.frameShadowRadius=(targethdtoptions[hdtdata.targetID].FrameShadowRaduis==null)?Math.round(targethdtoptions[hdtdata.targetID].SizeFactor/1.5):targethdtoptions[hdtdata.targetID].FrameShadowRadius;
			hdtdata.barShadowOffset=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor/4);
			hdtdata.barShadowRadius=Math.round(targethdtoptions[hdtdata.targetID].SizeFactor/2);
			hdtdata.textFontFamily=(targethdtoptions[hdtdata.targetID].TextFontFamily==null)?$('body').css('font-family'):targethdtoptions[hdtdata.targetID].TextFontFamily;
			hdtdata.selectedTextFontFamily=(targethdtoptions[hdtdata.targetID].SelectedTextFontFamily==null)?hdtdata.textFontFamily:targethdtoptions[hdtdata.targetID].SelectedTextFontFamily;
			hdtdata.selectedFontWeight=(hdtdata.textFontFamily==hdtdata.selectedTextFontFamily)?"bold":"normal";
			hdtdata.Container=(targethdtoptions[hdtdata.targetID].Container=='body')?'body':'#'+targethdtoptions[hdtdata.targetID].Container;
			hdtdata.windowOffset=0;
			var acc=0,str="";
			$("#hdtpicker_frame").remove();
			$(hdtdata.Container).append('<div id="hdtpicker_frame" class="hdtpicker_frame"><div id="hdtpicker_button_panel" class="hdtpicker_button_panel"><span id="hdtpicker_now_button" class="hdtpicker_buttons" ></span><span id="hdtpicker_done_button" class="hdtpicker_buttons"><center>'+targethdtoptions[hdtdata.targetID].DONE+'</center></span></div><div id="hdtpicker_holder" class="hdtpicker_holder"><div id="hdtpicker_bar" class="hdtpicker_bar"></div></div></div>');
			for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
				hdtdata.windowOffset=Math.max(hdtdata.windowOffset,Math.round(targethdtoptions[hdtdata.targetID].HeightFactor__[targethdtoptions[hdtdata.targetID].LevelSet[level]]/targethdtoptions[hdtdata.targetID].HeightFactor[targethdtoptions[hdtdata.targetID].LevelSet[level]]*1.2)*2);
				hdtdata.widthMark[level]={left:acc+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]],left_middle:acc+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]]+targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]/10,middle:acc+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]]+targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]/2,right_middle:acc+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]]+targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]*9/10,right:acc+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]]+targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]};
				if (targethdtoptions[hdtdata.targetID].Separator[targethdtoptions[hdtdata.targetID].LevelSet[level]]!="")
					$("#hdtpicker_bar").append("<span class=\"hdtpicker_separator\" style=\"WIDTH:"+targethdtoptions[hdtdata.targetID].SeparatorWidth[targethdtoptions[hdtdata.targetID].LevelSet[level]]+"px;LEFT:"+(acc-(targethdtoptions[hdtdata.targetID].SeparatorWidth[targethdtoptions[hdtdata.targetID].LevelSet[level]]-targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]])/2)+"px\">"+targethdtoptions[hdtdata.targetID].Separator[targethdtoptions[hdtdata.targetID].LevelSet[level]]+"</span>");
				acc+=targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]];
				hdtdata.Cur[targethdtoptions[hdtdata.targetID].LevelSet[level]]=hdtdata.Prev[targethdtoptions[hdtdata.targetID].LevelSet[level]]=hdtdata.Next[targethdtoptions[hdtdata.targetID].LevelSet[level]]={};
				hdtdata.ScrollTop[targethdtoptions[hdtdata.targetID].LevelSet[level]]=hdtdata.RollerTS[targethdtoptions[hdtdata.targetID].LevelSet[level]]=0;
				$("#hdtpicker_holder").append("<div level=\""+targethdtoptions[hdtdata.targetID].LevelSet[level]+"\" id=\"hdtpicker_level_"+targethdtoptions[hdtdata.targetID].LevelSet[level]+"_holder\" class=\"hdtpicker_column_holder\" style=\"MARGIN-LEFT:"+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]]+"px;WIDTH:"+targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]+"px\"><div id=\"hdtpicker_bar"+level+"\" class=\"hdtpicker_column_bar\"></div><div id=\"p"+level+"\" class=\"hdtpicker_mark\"></div></div>");
				$("#hdtpicker_bar").append("<div level=\""+targethdtoptions[hdtdata.targetID].LevelSet[level]+"\" id=\"hdtpicker_bar_"+targethdtoptions[hdtdata.targetID].LevelSet[level]+"\" class=\"hdtpicker_column_bar_button\" style=\"MARGIN-LEFT:"+targethdtoptions[hdtdata.targetID].ColumnMargin[targethdtoptions[hdtdata.targetID].LevelSet[level]]+"px;WIDTH:"+targethdtoptions[hdtdata.targetID].Width[targethdtoptions[hdtdata.targetID].LevelSet[level]]+"px\"></div>");
				/*hdtpicker_Process(level,hdtdata.iniTS);
				if (level<=targethdtoptions[hdtdata.targetID].LevelSet.length-1)
					hdtpicker_align(level,hdtdata.iniTS);*/
			};
			for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
				str+=","+targethdtoptions[hdtdata.targetID].SelectedBarBackgroundColor+"1)"+(hdtdata.widthMark[level].left/acc*100)+"%,"+targethdtoptions[hdtdata.targetID].SelectedBarBackgroundColor+"0.1)"+(hdtdata.widthMark[level].left_middle/acc*100)+"%,"+targethdtoptions[hdtdata.targetID].SelectedBarBackgroundColor+"0)"+(hdtdata.widthMark[level].middle/acc*100)+"%,"+targethdtoptions[hdtdata.targetID].SelectedBarBackgroundColor+"0.1)"+(hdtdata.widthMark[level].right_middle/acc*100)+"%,"+targethdtoptions[hdtdata.targetID].SelectedBarBackgroundColor+"1)"+(hdtdata.widthMark[level].right/acc*100)+"%";
			};
			$("#hdtpicker_frame").append("<style>.hdtpicker_holder {		margin: "+hdtdata.marginSize+"px;		font-size:"+hdtdata.mainFontSize+"px;		width:auto;		overflow:hidden;		height:"+hdtdata.windowHeight+"px;		position:relative;		display:block;	}	.hdtpicker_column_holder {		overflow:hidden;		height:"+(hdtdata.windowHeight+hdtdata.windowOffset*2)+"px;		top: -"+hdtdata.windowOffset+"px;		display:inline-block;		position: relative;		background-image : "+targethdtoptions[hdtdata.targetID].ColumnBackgroundImage+";	}	.hdtpicker_container {		width:100%;		position: absolute;		left:0px;	}	.hdtpicker_cell {		width:100%;		text-align:center;		vertical-align:baseline;		display:block;		background-image : "+targethdtoptions[hdtdata.targetID].CellBackgroundImage+";		cursor:arrow;	}	.hdtpicker_mark {		height:2px;		width:100%;		position:absolute;		top:"+(hdtdata.windowHeight/2+hdtdata.windowOffset-1)+"px;		background-color:"+targethdtoptions[hdtdata.targetID].MarkColor+";		opacity:0.3;	}	.hdtpicker_bar {		height:"+hdtdata.lineHeight+"px;		top:"+(hdtdata.windowHeight/2-hdtdata.lineHeight/2)+"px;		position: absolute;		opacity:0;		z-index:1;		box-shadow: 0px "+hdtdata.barShadowOffset+"px "+hdtdata.barShadowRadius+"px "+hdtdata.frameShadowColor+";		border-left:none;border-right:none;border-bottom: 1px solid "+hdtdata.frameBorderColor+";border-top: 1px solid "+hdtdata.frameBorderColor+";		margin-top:-1;		margin-left:-1;	}	.hdtpicker_column_bar {		opacity:0;		background-color:"+targethdtoptions[hdtdata.targetID].SelectedBarBackgroundColor+"1);		height:"+hdtdata.lineHeight+"px;		width:100%;		position: absolute;		cursor:arrow;	}	.hdtpicker_column_bar_button {		height:100%;		background-color:tranparent;		position:relative;		display:inline-block;	}	.hdtpicker_button_panel {		background-image : "+targethdtoptions[hdtdata.targetID].ButtonBackgroundImage+";		margin: "+hdtdata.marginSize+"px;		height:"+hdtdata.lineHeight+"px;		width:100%;		position: relative;		display: block;	}	.hdtpicker_buttons {		width: 50%;		margin: auto;		color: "+targethdtoptions[hdtdata.targetID].SelectedTextColor+";		font-size: "+hdtdata.buttonFontSize+"px;		line-height:"+hdtdata.lineHeight+"px;		position: relative;		display: inline-block;		cursor:arrow;	}	.hdtpicker_frame{		"+((targethdtoptions[hdtdata.targetID].FrameBackgroundImage==null)?("background-color: "+targethdtoptions[hdtdata.targetID].FrameBackgroundColor):("background-image : "+targethdtoptions[hdtdata.targetID].FrameBackgroundImage))+";		padding:1px;		display:block;		position:fixed;		z-index:20;		box-shadow: "+hdtdata.frameShadowOffsetX+"px "+hdtdata.frameShadowOffsetY+"px "+hdtdata.frameShadowRadius+"px "+hdtdata.frameShadowColor+";		-webkit-touch-callout: none;		-webkit-user-select: none;		-khtml-user-select: none;		-moz-user-select: none;		-ms-user-select: none;		user-select: none;		font-family: "+hdtdata.selectedTextFontFamily+";		font-size: "+hdtdata.mainFontSize+"px;		opacity:0;		border: "+hdtdata.frameBorderWidth+"px outset "+hdtdata.frameBorderColor+";	}	.hdtpicker_separator {		width:"+hdtdata.separatorWidth+"px;		display:block;		position:absolute;		font-weight:"+hdtdata.selectedFontWeight+";		color: "+targethdtoptions[hdtdata.targetID].SelectedTextColor+";		line-height:"+hdtdata.lineHeight+"px;		top:0px;	}</style>");
			$("#hdtpicker_holder,#hdtpicker_button_panel").width(acc);
			$("#hdtpicker_frame").width(acc+hdtdata.marginSize*2);
			$("#hdtpicker_bar").css({backgroundImage:"-webkit-linear-gradient(left"+str+")",width:acc});
			$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
			$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
			$("#hdtpicker_level_"+targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]+"_holder").stop().css({top:-hdtdata.windowOffset-targethdtoptions[hdtdata.targetID].HeightFactor__[targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]]/targethdtoptions[hdtdata.targetID].HeightFactor[targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]]});	
			$("#hdtpicker_frame").width(acc+hdtdata.marginSize*2);
			$("#hdtpicker_frame").animate({opacity:1},200);
			var fr_height=$("#hdtpicker_frame").height(),
				fr_width=$("#hdtpicker_frame").width(),
				coord=hdtdata.target.getBoundingClientRect(),
				scr_height=$(window).height(),
				scr_width=$(window).width();
//console.log(fr_height,fr_width,coord,scr_height,scr_width);
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
			hdtdata.stopwatch=false;
			if (targethdtoptions[hdtdata.targetID].TS!==undefined)
				hdtdata.iniTS=targethdtoptions[hdtdata.targetID].TS;
			else if ($(hdtdata.target).attr("ts")!="" && $(hdtdata.target).attr("ts")!="0" && $(hdtdata.target).attr("ts")!==undefined && $(hdtdata.target).attr("ts")!=null)
				hdtdata.iniTS = parseInt($(hdtdata.target).attr("ts"));
			else {
				hdtdata.iniTS=new Date().getTime();
				hdtdata.stopwatch=true
			};
			hdtdata.SecTS=hdtdata.iniTS;
			for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
				hdtpicker_Process(level,hdtdata.iniTS);
				hdtpicker_align(level,hdtdata.iniTS);
			};
			if (hdtdata.stopwatch) {
				$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].STOP+"</center>");
				hdtdata.nowTimer=hdtpicker_Timer.Start("","I",1000/100,function() {
					hdtdata.iniTS=new Date().getTime()+hdtdata.NowShift;
					if (Math.floor(hdtdata.iniTS/1000)*1000==Math.floor(hdtdata.SecTS/1000)*1000) {
						$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1+Math.round((hdtdata.iniTS-Math.floor(hdtdata.iniTS/1000)*1000)/targethdtoptions[hdtdata.targetID].HeightFactor[targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]])})
					} else {
						hdtdata.SecTS=hdtdata.iniTS;
						for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
							hdtpicker_Process(level,hdtdata.iniTS);
							if (level<=targethdtoptions[hdtdata.targetID].LevelSet.length-1)
								hdtpicker_align(level,hdtdata.iniTS,true);
						};
						$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
						$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
					};
				})	
			} else {
				$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].NOW+"</center>");
			}
		//console.log('md');
			$(".hdtpicker_column_bar_button").on("click",function (event) {
				event.stopPropagation();
				event.preventDefault();	
				event.cancelBubble=true;
				if (hdtdata.MouseMove)
					null;
				else {
					hdtpicker_Timer.Abort(hdtdata.nowTimer);
					hdtdata.stopwatch=false;
					$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].NOW+"</center>");
					hdtdata.MouseMove=false;
					hdtdata.MouseDownPoint=null;
					var level=$(this).attr("level"),
						TS=hdtpicker_datetruncateTS(hdtdata.iniTS,targethdtoptions[hdtdata.targetID].Index[level]);
					iterCnt=Math.ceil(Math.pow(Math.abs(TS-hdtdata.iniTS)/targethdtoptions[hdtdata.targetID].HeightFactor__[level],0.5)*2.5)*2;
			//	console.log(TS,iterCnt);
					if (iterCnt>0) {
			//console.log((TS-hdtdata.iniTS)/Math.pow(iterCnt/2,2),(hdtdata.iniTS>TS)?1:-1,level,hdtdata.iniTS,iterCnt,1);
						hdtpicker_rollout((TS-hdtdata.iniTS)/Math.pow(iterCnt/2,2),(hdtdata.iniTS>TS)?1:-1,level,TS,iterCnt,1)
					}
				}
			})
			$(".hdtpicker_column_holder").on("touchmove",hdtmoveprogress);
			$(".hdtpicker_column_holder").on("mousemove",hdtmoveprogress);
			$(".hdtpicker_column_holder").on("touchend",hdtmoveend);
			$(".hdtpicker_column_holder").on("mouseup",hdtmoveend);
			$(".hdtpicker_column_holder").on("mouseleave",hdtmoveend);
			$(".hdtpicker_column_holder").on("touchstart",hdtmovestart);
			$(".hdtpicker_column_holder").on("mousedown",hdtmovestart);
			$(".hdtpicker_column_holder,.hdtpicker_column_bar_button").on("mousewheel", function(event) {
				e.stopPropagation();
				hdtpicker_Timer.Abort(hdtdata.nowTimer);
				hdtdata.stopwatch=false;
				$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].NOW+"</center>");			
				$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1});
				var level=targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1],
					delta=Math.round((hdtdata.iniTS-hdtpicker_datetruncateTS(hdtdata.iniTS,targethdtoptions[hdtdata.targetID].LevelSet.length-1)-targethdtoptions[hdtdata.targetID].HeightFactor__[level])/targethdtoptions[hdtdata.targetID].HeightFactor[level]);
				$("#hdtpicker_level_"+level+"_holder").css({top:-hdtdata.windowOffset+delta});
				$('.hdtpicker_mark').css("opacity",1);
				$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:0},100,function() {
					$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"none"});
				});
				var shift=(event.originalEvent.wheelDeltaY<1)?-1:1,
					level=$(this).attr("level"),
					step=targethdtoptions[hdtdata.targetID].WheelStep[level]*shift,
					date_=new Date((hdtdata.RollerTS[level]==0)?hdtdata.iniTS:hdtdata.RollerTS[level]);
					hdtdata.RollerTS[level]=date_['set'+level](date_['get'+level]()+step);
					hdtdata.iniTS=hdtdata.RollerTS[level];
					hdtdata.RollerTS[level]=0;
							for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
								hdtpicker_Process(level,hdtdata.iniTS);
								hdtpicker_align(level,hdtdata.iniTS);
							};
							$('.hdtpicker_mark').css("opacity",0.3);
							$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
							$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
				/*var	iterCnt=Math.max(Math.round(Math.pow(Math.abs(hdtdata.RollerTS[level]-hdtdata.iniTS)/targethdtoptions[hdtdata.targetID].HeightFactor__[level],0.5)*2)*2,2);
				//console.log('TS-hdtdata.iniTS',TS,hdtdata.iniTS,iterCnt);
				if (iterCnt>0) {
					hdtpicker_rollout((hdtdata.RollerTS[level]-hdtdata.iniTS)/Math.pow(iterCnt/2,2),(hdtdata.iniTS>hdtdata.RollerTS[level])?1:-1,level,hdtdata.RollerTS[level],iterCnt,1)
				}*/
			})
			$("#hdtpicker_now_button").on("click",function() {
				if (hdtdata.stopwatch) {
					hdtdata.stopwatch=false;
					$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].NOW+"</center>");
					hdtpicker_Timer.Abort(hdtdata.nowTimer);
					$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1});
					for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
						hdtpicker_Process(level,hdtdata.iniTS);
						hdtpicker_align(level,hdtdata.iniTS);
					};
				} else {
					hdtdata.stopwatch=true;
					hdtdata.NowShift=0;
					$("#hdtpicker_now_button").html("<center>"+targethdtoptions[hdtdata.targetID].STOP+"</center>");
					hdtdata.iniTS=new Date().getTime()+hdtdata.NowShift;
					hdtdata.SecTS=hdtdata.iniTS;
					for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
						hdtpicker_Process(level,Math.floor(hdtdata.iniTS/1000)*1000);
						hdtpicker_align(level,Math.floor(hdtdata.iniTS/1000)*1000,true);
					};
					$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1+Math.round((hdtdata.iniTS-Math.floor(hdtdata.iniTS/1000)*1000)/targethdtoptions[hdtdata.targetID].HeightFactor[targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]])})
					hdtdata.nowTimer=hdtpicker_Timer.Start("","I",1000/100,function() {
						hdtdata.iniTS=new Date().getTime()+hdtdata.NowShift;
						if (Math.floor(hdtdata.iniTS/1000)==Math.floor(hdtdata.SecTS/1000)) {
							$("#p"+(targethdtoptions[hdtdata.targetID].LevelSet.length-1)).css({top:hdtdata.windowHeight/2+hdtdata.windowOffset-1+Math.round((hdtdata.iniTS-Math.floor(hdtdata.iniTS/1000)*1000)/targethdtoptions[hdtdata.targetID].HeightFactor[targethdtoptions[hdtdata.targetID].LevelSet[targethdtoptions[hdtdata.targetID].LevelSet.length-1]])})
						} else {
							hdtdata.SecTS=hdtdata.iniTS;
							for (var level in targethdtoptions[hdtdata.targetID].LevelSet) {
								hdtpicker_Process(level,hdtdata.iniTS);
								if (level<=targethdtoptions[hdtdata.targetID].LevelSet.length-1)
									hdtpicker_align(level,hdtdata.iniTS,true);
							};
							$("#hdtpicker_bar,.hdtpicker_column_bar").css({display:"block"});
							$("#hdtpicker_bar,.hdtpicker_column_bar").stop().animate({opacity:1},400);
						};
					})	
				}
			});
			$("#hdtpicker_done_button").on("click.hdtdatetime",function() {
				$("#hdtpicker_frame").remove();
				$(document).off("click.hdtdatetime scroll.hdtdatetime");
				hdtpicker_Timer.Abort(hdtdata.nowTimer);
				if (targethdtoptions[hdtdata.targetID].TruncateResult)
					hdtdata.iniTS=hdtpicker_datetruncateTS(hdtdata.iniTS,targethdtoptions[hdtdata.targetID].LevelSet.length-1);
				switch (targethdtoptions[hdtdata.targetID].ResultMode) {
					case "time" :{var result=new Date(hdtdata.iniTS);result=result.toLocaleString();$(hdtdata.target).val(result);break;}
					case "date" :{var result=new Date(hdtdata.iniTS);result=result.toLocaleDateString();$(hdtdata.target).val(result);break;}
					case "object" : {
										var date=new Date(hdtdata.iniTS),result={};
										for (var level in targethdtoptions[hdtdata.targetID].LevelSet)
											result[targethdtoptions[hdtdata.targetID].LevelSet[level]]=date['get'+targethdtoptions[hdtdata.targetID].LevelSet[level]]();
										break;
									}
				};
				if (typeof (targethdtoptions[hdtdata.targetID].onClose)=='function')
					targethdtoptions[hdtdata.targetID].onClose(hdtdata.target,hdtdata.iniTS,result);
			});
			$("#hdtpicker_frame").on("click.hdtdatetime",function(e) {
				e.stopPropagation();
			});
			$(document).on("click.hdtdatetime scroll.hdtdatetime",function() {
				$("#hdtpicker_frame").remove();
				$(document).off("click.hdtdatetime scroll.hdtdatetime");
				hdtpicker_Timer.Abort(hdtdata.nowTimer);
				if (typeof (targethdtoptions[hdtdata.targetID].onCancel)=='function')
					targethdtoptions[hdtdata.targetID].onCancel(hdtdata.target,hdtdata.iniTS,result);
			});
		});
	};	
}(jQuery));
