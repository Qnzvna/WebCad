function ResizeDisplay(){
	var widthShift = 0;
	if(showHelp)
		widthShift=helpWidth;
	cvn.width = document.body.clientWidth-widthShift;
	displayWidth = cvn.width;
	cvn.height = window.innerHeight-60-32-1;
	displayHeight = cvn.height;
}

keyboard.DisableKey(keys.space);

keyboard.AddKeyEvent(true, keys.a, function(){moveLeft=true;});
keyboard.AddKeyEvent(false, keys.a, function(){moveLeft=false;});

keyboard.AddKeyEvent(true, keys.closeBracket, function(){Zoom(2);});
keyboard.AddKeyEvent(true, keys.openBracket, function(){Zoom(0.5);});

keyboard.AddKeyEvent(true, keys.control, function(){ToolModifier(); toolModifierEnabled=true;});
keyboard.AddKeyEvent(false, keys.control, function(){toolModifierEnabled=false;});

keyboard.AddKeyEvent(true, keys.enter, function(){ToolKeyboardOverride();});

var k = new Point();
	
console.log(k.prototype);

//var crosshair = content.AddPath("crosshair.gif");
//content.LoadImages();

keyboard.AddKeyEvent(true, keys.alt, function(){camMoving = true; 
	xCNaught = mouseState.cursorXLocal(); 
	yCNaught = mouseState.cursorYLocal();});

function StopCamMovement(){camMoving = false; 
	camX += mouseState.cursorXLocal() - xCNaught; 
	camY += mouseState.cursorYLocal() - yCNaught;}

keyboard.AddKeyEvent(false, keys.alt, function(){StopCamMovement();});

keyboard.AddKeyEvent(true, keys.shift, function(){axisSnap=true;});
keyboard.AddKeyEvent(false, keys.shift, function(){axisSnap=false;});

keyboard.AddKeyEvent(true, keys.x, function(){if(axisSnap){axisSnapXLock=true;};});
keyboard.AddKeyEvent(false, keys.x, function(){axisSnapXLock=false;});
keyboard.AddKeyEvent(true, keys.z, function(){if(axisSnap){axisSnapYLock=true;};});
keyboard.AddKeyEvent(false, keys.z, function(){axisSnapYLock=false;});

var cOutX = camX;
var cOutY = camY;

function Display()
{
	this.Execute = function()
	{
		railing=-1;
		railing = Rail(snapDistance, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		counter++;
		
		prevLoop = currentLoop;
		currentLoop = new Date().getTime();
		loopDeltaT = (currentLoop-prevLoop)/1000;
		
		cvn = document.getElementById("CADDisplay");
		cvn.style.cursor='crosshair';
		
		if(!initResize)
			ResizeDisplay();
		
		offsetX = $('#CADDisplay').offset().left;
		offsetY = $('#CADDisplay').offset().top;
		
		context = cvn.getContext('2d');
		
		var currentSnapRule=SR_Null;
		
		if(mode==M_ADDPOINT)
			currentSnapRule=SR_DrawPoint;
		else if(mode==M_ADDLINE || M_ADDSQUARE==mode || mode==M_ADDINFLINE)
			currentSnapRule=SR_DrawLine;
		else if(mode==M_ADDCIRCLE)
			currentSnapRule=SR_DrawCircle;
		else if(mode==M_ADDARC)
			currentSnapRule=SR_DrawArc;
		else if(mode==M_DELETE)
			currentSnapRule=SR_Delete;
		else if(mode==M_MEASURE)
			currentSnapRule=SR_Measure;
		else if(mode==M_TRIM)
			currentSnapRule=SR_Trim;
		else if(mode==M_ADDPARLINE && addParLinePhase==-1)
			currentSnapRule=SR_AddParallelLine;
		else if(mode==M_ADDPARLINE)
			currentSnapRule=SR_DrawLine;
		else if(mode==M_CHAMFER || mode==M_FILLET)
			currentSnapRule=SR_ChamferFillet;
		
		cOutX = camX;
		cOutY = camY;
		
		var snapperDeltaX = 0, snapperDeltaY = 0;
		
		if(camMoving){
			cOutX += mouseState.cursorXLocal() - xCNaught;
			cOutY += mouseState.cursorYLocal() - yCNaught;
			
			snapperDeltaX = cOutX - camX;
			snapperDeltaY = cOutY - camY;
		}
		
		var lx = mouseState.cursorXInFrame(), ly = mouseState.cursorYInFrame();
		var snapOut = MultiSnap(currentSnapRule, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		lx = (snapOut.x+cOutX)*zoom; ly = (snapOut.y+cOutY)*zoom;
		
		context.restore();
		
		context.fillStyle="#202020";
		context.fillRect(0, 0, displayWidth, displayHeight);
		
		context.save();
		
		context.translate(displayWidth/2, displayHeight/2);
		
		context.strokeStyle="grey";
		context.lineWidth = 0.5;
		DrawGrid(cOutX, cOutY);
		
		context.lineWidth=1;
		context.strokeStyle="#FFFF99";
		
		context.lineWidth=2;
		context.strokeStyle="white";
		
		
		DrawOrigin(cOutX, cOutY);
		
		for(var q = scene.lines.length-1; q>=0; q--){
			if(scene.lines[q].pointA>=0 && scene.lines[q].pointB>=0){
				context.beginPath();
				
				context.moveTo((scene.points[scene.lines[q].pointA].x + cOutX)*zoom, (scene.points[scene.lines[q].pointA].y + cOutY)*zoom);
				
				context.lineTo((scene.points[scene.lines[q].pointB].x + cOutX)*zoom, (scene.points[scene.lines[q].pointB].y + cOutY)*zoom);
				
				context.closePath();
				
				context.stroke();
			}
			
			else if(scene.lines[q].type=='infinite'){
				context.beginPath();
				
				if(scene.lines[q].b!=0){
					var y = (displayWidth/2/zoom+cOutX) * scene.lines[q].a / scene.lines[q].b + scene.lines[q].c;
					
					context.moveTo(displayWidth/-2, (y + cOutY)*zoom);
					
					y = (displayWidth/-2/zoom+cOutX) * scene.lines[q].a / scene.lines[q].b + scene.lines[q].c;
					
					context.lineTo(displayWidth/2, (y + cOutY)*zoom);
					
					context.closePath();
				}else{
					var x = (scene.lines[q].c/scene.lines[q].a + cOutX)*zoom;
					context.moveTo(x, displayHeight/2);
					context.lineTo(x, displayHeight/-2);
					context.closePath();
				}
				context.stroke();
			}
			else{
				context.beginPath();
				
				if(scene.lines[q].b!=0){
					if(scene.lines[q].positive){
						context.moveTo((scene.points[scene.lines[q].pointA].x + cOutX)*zoom, (scene.points[scene.lines[q].pointA].y + cOutY)*zoom);
						
						var y = (displayWidth/-2/zoom+cOutX) * scene.lines[q].a / scene.lines[q].b + scene.lines[q].c;
						
						context.lineTo(displayWidth/2, (y + cOutY)*zoom);
						
						context.closePath();
					}else{
						var y = (displayWidth/2/zoom+cOutX) * scene.lines[q].a / scene.lines[q].b + scene.lines[q].c;
						
						context.moveTo((scene.points[scene.lines[q].pointA].x + cOutX)*zoom, (scene.points[scene.lines[q].pointA].y + cOutY)*zoom);
						
						context.lineTo(-displayWidth/2, (y + cOutY)*zoom);
						
						context.closePath();
					}
				}else{
					if(scene.lines[q].positive){
						var x = (scene.lines[q].c/scene.lines[q].a + cOutX)*zoom;
						context.moveTo((scene.points[scene.lines[q].pointA].x + cOutX)*zoom, (scene.points[scene.lines[q].pointA].y + cOutY)*zoom);
						context.lineTo(x, displayHeight/2);
						context.closePath();
					}else{
						var x = (scene.lines[q].c/scene.lines[q].a + cOutX)*zoom;
						context.moveTo((scene.points[scene.lines[q].pointA].x + cOutX)*zoom, (scene.points[scene.lines[q].pointA].y + cOutY)*zoom);
						context.lineTo(x, displayHeight/-2);
						context.closePath();
					}
				}
				
				context.stroke();
			}
		}
			
		if(mode==2 && lineStart>=0){
			context.beginPath();
			context.moveTo((scene.points[lineStart].x + cOutX)*zoom, (scene.points[lineStart].y + cOutY)*zoom);
			context.lineTo((snapOut.x+cOutX)*zoom, (snapOut.y+cOutY)*zoom);
			context.closePath();
			context.stroke();
		}else if(mode==M_ADDARC && arcPhase==2){
			context.beginPath();
			context.arc((scene.points[tempArc.c].x + cOutX)*zoom,
				(scene.points[tempArc.c].y + cOutY)*zoom,
				tempArc.r * zoom, tempArc.a, FindAngle(scene.points[tempArc.c].x, scene.points[tempArc.c].y,
				snapOut.x, snapOut.y), !toolModifierEnabled);
			//context.closePath();
			
			/*console.log(scene.arcA[q]);
			console.log(FindAngle(scene.pointsX[scene.arcC[scene.arcC.length-1]], scene.pointsY[scene.arcC[scene.arcC.length-1]],
				snapOut.x+cOutX, snapOut.y+cOutY));*/
			
			context.stroke();
		}else if(mode==M_ADDINFLINE && infLinePhase==1){
			context.beginPath();
			context.moveTo((snapOut.x+cOutX)*zoom, (snapOut.y+cOutY)*zoom);
			context.lineTo((infLinePt1.x+cOutX)*zoom, (infLinePt1.y+cOutY)*zoom);
			context.stroke();
		}else if(mode==M_ADDPARLINE && addParLinePhase!=-1){
			var a = scene.lines[addParLinePhase].a, b = scene.lines[addParLinePhase].b;
			
			var pl = InfiniteLineThroughPoint(new Point(lx, ly), 
					scene.lines[addParLinePhase].a, scene.lines[addParLinePhase].b, false);
			
			DrawInfiniteLine(pl);
		}
		
		for(var q = scene.points.length-1; q>=0; q--){context.beginPath();
			/*context.arc((scene.points[q].x + cOutX)*zoom, 
				    (scene.points[q].y + cOutY)*zoom, 
				    5,  0, pi*2, false);
			context.closePath();
			context.stroke();*/
			
			DrawCross(scene.points[q].x, scene.points[q].y, 5);
		}
		
		for(var q = scene.circleC.length-1; q>=0; q--){context.beginPath();
			context.arc((scene.points[scene.circleC[q]].x + cOutX)*zoom, 
				    (scene.points[scene.circleC[q]].y + cOutY)*zoom, 
				    scene.circleR[q]*zoom, 0, 2*pi);
			context.closePath();
			context.stroke();
		}
		
		for(var q=scene.arcs.length-1; q>=0; q--){context.beginPath();
			context.arc((scene.points[scene.arcs[q].c].x + cOutX)*zoom,
				(scene.points[scene.arcs[q].c].y + cOutY)*zoom,
				scene.arcs[q].r, scene.arcs[q].a, scene.arcs[q].b, true);
			//context.closePath();
			context.stroke();
		}
		
		context.beginPath();
		
		context.strokeStyle=currentSnapRule.cColor;
		
		var r = currentSnapRule.cRadius;
		
		if(snapOut.type=='midpoint'){
			r = 4; context.strokeStyle = "#40FF20";}
		
		context.arc(lx, ly, r,  0, pi*2, false);
		context.closePath();
		context.stroke();
		
		if(mode==M_MEASURE){
			context.strokeStyle = "#EEEE00";
			context.fillStyle = "#EEEE00";
			
			context.beginPath();
			
			context.moveTo((measureStart.x+cOutX)*zoom, (measureStart.y+cOutY)*zoom);
			context.lineTo((snapOut.x+cOutX)*zoom, (snapOut.y+cOutY)*zoom);
			
			context.stroke();
			
			context.font = "16px courier";
			
			context.fillText(RoundNumber(Distance(measureStart.x, measureStart.y, snapOut.x, snapOut.y), 3),
					 (snapOut.x+cOutX)*zoom + 8, (snapOut.y+cOutY)*zoom) + 8;
		}
		
		//context.drawImage(content.images[crosshair], mouseState.cursorXInFrame()-16, mouseState.cursorYInFrame()-16);
		
		//this.levels[this.activeLevel].Update();
		//this.levels[this.activeLevel].Draw();
		
		context.fillStyle="#202020";
		
		context.fillRect(-displayWidth/2, displayHeight/2 - 20, displayWidth, 20);
		
		context.strokeStyle="black";
		
		context.lineWidth=1;
		
		context.strokeRect(-displayWidth/2 + 1, displayHeight/2 - 21, displayWidth-2, 20);
		
		context.fillStyle="#909090";
		
		context.font = "16px courier";
		
		SetPropertyTooltip(snapOut);
		
		context.fillText(tooltip, -displayWidth/2 + 3, displayHeight/2-6);
		
		context.fillStyle = "#606060";
		
		context.fillText('Maksim Mikityanskiy', displayWidth/2 - 200, displayHeight/2-6);
	}	
}

function DrawOrigin(cx, cy){
	context.beginPath();
	context.moveTo(cx*zoom, -displayHeight);
	context.lineTo(cx*zoom, displayHeight);
	context.closePath();
	context.stroke();
	
	context.beginPath();
	context.moveTo(-displayWidth, cy*zoom);
	context.lineTo(displayWidth, cy*zoom);
	context.closePath();
	context.stroke();
}

function DrawGrid(camXoff, camYoff){
	if(!showGrid)
		return;
	
	var naught = camXoff % (gridSpacing) * zoom - displayWidth /2 + 
		(displayWidth/2)%gridSpacing - gridSpacing*zoom;
	
	for(var q = 1 + displayWidth / gridSpacing / zoom; q >= 0; q--){
		context.beginPath();
		context.moveTo(naught, -displayHeight);
		context.lineTo(naught, displayHeight);
		context.closePath();
		context.stroke();
		
		naught += gridSpacing*zoom;
	}
	
	naught = camYoff % (gridSpacing) * zoom - displayHeight /2 + 
		(displayHeight/2)%gridSpacing - gridSpacing*zoom;
	
	for(var q = 1 + displayHeight / gridSpacing / zoom; q >= 0; q--){
		context.beginPath();
		context.moveTo(-displayWidth, naught);
		context.lineTo(displayWidth, naught);
		context.closePath();
		context.stroke();
		
		naught+= gridSpacing*zoom;
	}
}

function SetPropertyTooltip(snapDesc){
	if(mode==M_ADDARC){
		tooltip = 'Arc: x=' + snapDesc.x + ', y=' + snapDesc.y;
		if(arcPhase>0)
			tooltip += ', Θ=' + RoundNumber(arcTheta*-57.2957795, 3);
	}
	if(mode==M_ADDPOINT){
		//console.log(pxOverride, pyOverride);
		
		if(keyboard.BufferToString()!="" && pxOverride==undefined){
			if(pyOverride!=undefined){
				tooltip = "Point: x=" + pxOverride + ", y=" + keyboard.BufferToString();
				
			}else{
				tooltip = "Point: x=" + keyboard.BufferToString();
			}
		}
		else
			tooltip = 'Point: x=' + snapDesc.x + ', y=' + snapDesc.y;
	}
	if(mode==M_ADDLINE)
		tooltip = 'Line: x=' + snapDesc.x + ', y=' + snapDesc.y;
	if(mode==M_TRIM){
		if(toolModifierEnabled)
			tooltip = 'Trim (remove)';
		else
			tooltip = 'Trim (keep)';
	}
}

function DrawCross(x, y, radius){
	var r = 4;
	if(radius!=undefined)
		r=radius;
	
	context.beginPath();
	context.moveTo((x+cOutX)*zoom-radius, (y+cOutY)*zoom-r);
	context.lineTo((x+cOutX)*zoom+radius, (y+cOutY)*zoom+r);
	context.closePath();
	context.stroke();
	
	context.beginPath();
	context.moveTo((x+cOutX)*zoom+radius, (y+cOutY)*zoom-r);
	context.lineTo((x+cOutX)*zoom-radius, (y+cOutY)*zoom+r);
	context.closePath();
	context.stroke();
}

function DrawInfiniteLine(line){
	context.beginPath();
	
	if(line.b!=0){
		var y = (displayWidth/2/zoom+cOutX) * line.a / line.b + line.c;
		
		context.moveTo(displayWidth/-2, (y + cOutY)*zoom);
		
		y = (displayWidth/-2/zoom+cOutX) * line.a / line.b + line.c;
		
		context.lineTo(displayWidth/2, (y + cOutY)*zoom);
		
		context.closePath();
	}else{
		var x = (line.c/line.a + cOutX)*zoom;
		context.moveTo(x, displayHeight/2);
		context.lineTo(x, displayHeight/-2);
		context.closePath();
	}
	context.stroke();
}


function xWorldToCamera(i){
	var o = i*zoom;
	return o;
}

function GetFPS(){alert("Instantaneous Frame Rate = " + 1/loopDeltaT);}

var masterDisplay = new Display(); 

function Run()
{
	masterDisplay.Execute();
}

setInterval(Run,20); 

function NewFile(){
	$("#fileSaveNoCancel" ).dialog("open");
}

