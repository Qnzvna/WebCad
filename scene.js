var M_ADDPOINT = 1, M_ADDLINE = 2, M_ADDCIRCLE = 3, M_DELETE=4, M_ADDSQUARE=5, M_ADDARC=6, M_ADDINFLINE=7, M_TRIM=10, M_MEASURE=11, M_ADDRAY=8, M_ADDPARLINE=9, M_CHAMFER=12, M_FILLET=13;

var mode = 0;

var lineStart=-1, circlePhase=0, squarePhase=0, arcPhase=0, rayPhase=0, addParLinePhase=-1;

var squareIndexA = -1;

var measureStart = new Point();

var arcTheta = 0;

var lastUsedPoint=new Point(), axisSnap=false, axisSnapXLock=false, axisSnapYLock=false;

var pxOverride = undefined, pyOverride = undefined, overridePhase=0;

var infLinePt1 = new Point(), infLinePhase=0;

var chamferMSA = 0, chamferMSB = 0, chamferDA = 32, chamferDB = 32, chamferPhase = 0;

var tempArc = new Arc();

function SelectTool(toolIndex){
	ResetMode();
	mode = toolIndex;
	
	lineStart = -1;
	circlePhase = 0;
}

function ToolModifier(){
	if(mode==M_ADDLINE)
		lineStart=-1;
}

function ResetMode(){
	if(mode==3){
		if(circlePhase==1)
			scene.circleC.pop();
		circlePhase = 0;
		
	}
	else if(mode==2)
		lineStart=-1;
	else if(mode==M_ADDARC){
		arcPhase=0;
		tempArc=new Arc();
	}
	else if(mode==M_ADDINFLINE)
		infLinePhase=0;
	else if(mode==M_ADDRAY)
		rayPhase=0;
	else if(mode==M_ADDPARLINE)
		addParLinePhase=-1;
	else if(mode==M_CHAMFER)
		chamferPhase=0;
	
	mode=0;
}

function ToolKeyboardOverride(){
	if(keyboard.charBuffer=="")
		return;
	
	if(pxOverride==undefined){
		pxOverride = keyboard.BufferToString();
		keyboard.ResetBuffer();
		return;
	}
	pyOverride=keyboard.BufferToString();
	keyboard.ResetBuffer();
	AddItem();
}

function AddLine(lineStart, lineEnd){
	var rv = LineFromEndpoints(lineStart, lineEnd);
	
	var k = scene.lines.length;
	
	scene.lines.push(rv);
	
	for(var q = scene.circleC.length-1; q >=0; q--){
		PlaceCircleLineIntersections(q, k);
	}
	
	for(var q = scene.lines.length-2; q>=0; q--){
		var j = scene.lines[q].IntersectWithLine(rv);
		if(j!=0){
			j.indexA=q;
			j.indexB=k;
			if(j!=0)
				scene.lineInts.push(j);
		}
	}
	
	for(var q = scene.arcs.length-1; q>=0; q--){
		PlaceArcLineIntersections(q, k);
	}
}

function AddRay(rayStart, directionPoint, reverse){
	if(typeof rayStart == typeof new Point()){
		scene.points.push(directionPoint);
		
		var rv = LineFromEndpoints(scene.points.length-2, scene.points.length-1);
		
		rv.pointB=-1;
		scene.points.pop();
		
		rv.type='ray';
		
		if(rv.b==0){
			if(directionPoint.y<rayStart.y)
				rv.positive=false;
		}else{
			if(directionPoint.x<rayStart.x)
				rv.positive=false;
		}
		
		if(reverse)
			rv.positive=!rv.positive;
	}
	
	/****/
	
	var k = scene.lines.length;
	
	scene.lines.push(rv);
	
	for(var q = scene.circleC.length-1; q >=0; q--){
		PlaceCircleLineIntersections(q, k);
	}
	
	for(var q = scene.lines.length-2; q>=0; q--){
		var j = scene.lines[q].IntersectWithLine(rv);
		if(j!=0){
			j.indexA=q;
			j.indexB=k;
			if(j!=0)
				scene.lineInts.push(j);
		}
	}
	
	for(var q = scene.arcs.length-1; q>=0; q--){
		PlaceArcLineIntersections(q, k);
	}
}

function PlaceLine(rv){
	var k = scene.lines.length;
	
	scene.lines.push(rv);
	
	for(var q = scene.circleC.length-1; q >=0; q--){
		PlaceCircleLineIntersections(q, k);
	}
	
	for(var q = scene.lines.length-2; q>=0; q--){
		var j = scene.lines[q].IntersectWithLine(rv);
		if(j!=0){
			j.indexA=q;
			j.indexB=k;
			if(j!=0)
				scene.lineInts.push(j);
		}
	}
	
	for(var q = scene.arcs.length-1; q>=0; q--){
		PlaceArcLineIntersections(q, k);
	}
}

function AddArc(arc){
	var k = scene.arcs.length;
	
	scene.arcs.push(arc);
	
	for(var q = scene.lines.length-1; q>=0; q--){
		PlaceArcLineIntersections(k, q);
	}
	
	for(var q = scene.circleC.length-1; q>=0; q--){
		PlaceCircleArcIntersections(q, k);
	}
}

function SplitLinePExist(lineIndex, point){
	AddLine(point, scene.lines[lineIndex].pointB);
	scene.lines[lineIndex].RecalculateLineFromEndpoints(scene.lines[lineIndex].pointA, point);
}

function SplitLine(lineIndex, px, py){
	
}

function AddPoint(px, py){
	lastUsedPoint.x=px;
	lastUsedPoint.y=py;
	
	scene.points.push(new Point(px, py));}

function AddItem(){
	if(mode==M_ADDPOINT){
		var s = MultiSnap(SR_DrawPoint, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		if(pxOverride!=undefined){
			s.x = parseFloat(pxOverride);
			s.type = 'null';
			pxOverride=undefined;
		}if(pyOverride!=undefined){
			s.y = parseFloat(pyOverride);
			s.type = 'null';
			pyOverride=undefined;
		}
		
		if(s.type=='point')
			return;
		
		AddPoint(s.x, s.y);
	}
	else if(mode==M_ADDRAY){
		var s = MultiSnap(SR_DrawLine, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		if(pxOverride!=undefined){
			s.x = parseFloat(pxOverride);
			s.type = 'null';
			pxOverride=undefined;
		}if(pyOverride!=undefined){
			s.y = parseFloat(pyOverride);
			s.type = 'null';
			pyOverride=undefined;
		}
		
		if(rayPhase==0){
			if(s.type!='point'){
				rayPhase=-scene.points.length-1;
				AddPoint(s.x, s.y);
			}
			else
				rayPhase=-s.index-1;
		}else{
			rayPhase=-(rayPhase+1);
			
			AddRay(scene.points[rayPhase], new Point(s.x, s.y), toolModifierEnabled);
			
			rayPhase=0;
		}
	}else if(mode==M_ADDLINE){
		var s = MultiSnap(SR_DrawLine, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		if(pxOverride!=undefined){
			s.x = parseFloat(pxOverride);
			s.type = 'null';
			pxOverride=undefined;
		}if(pyOverride!=undefined){
			s.y = parseFloat(pyOverride);
			s.type = 'null';
			pyOverride=undefined;
		}
		
		var snapPoint = scene.points.length;
		
		if(s.type!='point'){
			AddPoint(s.x, s.y);
			
			if(s.type=='midpoint'){
				SplitLinePExist(s.index, snapPoint);
			}
		}
		else{
			snapPoint = s.index; lastUsedPoint.x=s.x; lastUsedPoint.y=s.y;}
		
		if(lineStart>=0){
			AddLine(lineStart, snapPoint);
		}
		
		lineStart = snapPoint;
	}else if(mode==M_ADDPARLINE){
		if(addParLinePhase==-1){
			var s = MultiSnap(SR_AddParallelLine, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
			if(s.type=='failed')
				return;
			
			addParLinePhase=s.index;
			return;
		}
		var s = MultiSnap(SR_DrawLine, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		if(scene.lines[addParLinePhase].type=='infinite')
			InfiniteLineThroughPoint(new Point(s.x, s.y), scene.lines[addParLinePhase].a, scene.lines[addParLinePhase].b);
		else if(scene.lines[addParLinePhase].type=='ray'){
			var a = scene.lines[addParLinePhase].a, b = scene.lines[addParLinePhase].b;
			
			var guideA = InfiniteLineThroughPoint(scene.points[scene.lines[addParLinePhase].pointA],
					-b*b/a, b, false);
			
			var pl = InfiniteLineThroughPoint(new Point(s.x, s.y), 
					scene.lines[addParLinePhase].a, scene.lines[addParLinePhase].b, false);
			
			pl.pointA =  scene.points.length;
			
			scene.points.push(pl.IntersectWithLine(guideA));
			
			pl.positive = scene.lines[addParLinePhase].positive;
			pl.type='ray';
			
			console.log(pl);
			
			PlaceLine(pl);
		}else{
			var a = scene.lines[addParLinePhase].a, b = scene.lines[addParLinePhase].b;
			
			var guideA = InfiniteLineThroughPoint(scene.points[scene.lines[addParLinePhase].pointA],
					-b*b/a, b, false);
			var guideB = InfiniteLineThroughPoint(scene.points[scene.lines[addParLinePhase].pointB],
					-b*b/a, b, false);
			
			var pl = InfiniteLineThroughPoint(new Point(s.x, s.y), 
					scene.lines[addParLinePhase].a, scene.lines[addParLinePhase].b, false);
			
			scene.points.push(pl.IntersectWithLine(guideA));
			scene.points.push(pl.IntersectWithLine(guideB));
			
			AddLine(scene.points.length-2, scene.points.length-1);
		}
		
		addParLinePhase=-1;
		
	}else if(mode==M_ADDINFLINE){
		var s = MultiSnap(SR_DrawLine, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		lastUsedPoint.x=s.x; lastUsedPoint.y=s.y;
		
		if(infLinePhase==0){
			infLinePt1.x = s.x;
			infLinePt1.y = s.y;
			infLinePhase++;
		}else{
			InfiniteLineFromPoints(infLinePt1, s);
			infLinePhase=0;
		}
	}else if(mode==M_ADDCIRCLE){
		var s = MultiSnap(SR_DrawCircle, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		var snapPoint = scene.points.length;
		
		if(s.type!='point' && circlePhase==0){
			AddPoint(s.x, s.y);
		}
		else
			snapPoint = s.index;
		
		if(circlePhase==0){
			scene.circleC.push(snapPoint);
			circlePhase=1;
		}
		else{
			scene.circleR.push(Distance(scene.points[scene.circleC[scene.circleC.length-1]].x, 
				scene.points[scene.circleC[scene.circleC.length-1]].y,
				s.x, 
				s.y));
			circlePhase=0;
			
			lastUsedPoint.x = s.x;
			lastUsedPoint.y = s.y;
			
			var k = scene.circleC.length-1;
			
			for(var q = scene.circleC.length-2; q>=0; q--){	
				PlaceCircleIntersections(k, q);
			}
			
			for(var q = scene.arcs.length-1; q>=0; q--){
				PlaceCircleArcIntersections(k, q);
			}
			
			for(var q = scene.lines.length-1; q>=0; q--){
				PlaceCircleLineIntersections(k, q);
			}
		}
	}else if(mode==M_ADDSQUARE){
		if(squarePhase==0)
			squareIndexA=-1;
		var s = MultiSnap(SR_DrawLine, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		var snapPoint = scene.points.length;
		
		if(s.type!='point'){
			squareIndexA=snapPoint;
			AddPoint(s.x, s.y);
		}
		else{
			if(s.index==squareIndexA && squarePhase==1){
				squarePhase=0;
				return;
			}
			snapPoint = s.index;
			squareIndexA = s.index;
		}
		
		if(squarePhase==0)
			squarePhase++;
		else{
			AddPoint(s.x, scene.points[scene.points.length-2].y);
			
			AddPoint(scene.points[scene.points.length-3].x, s.y);
			
			AddLine(scene.points.length-4, scene.points.length-1);
			AddLine(scene.points.length-4, scene.points.length-2);
			
			AddLine(scene.points.length-3, scene.points.length-1);
			AddLine(scene.points.length-3, scene.points.length-2);
			
			lastUsedPoint.x = s.x;
			lastUsedPoint.y = s.y;
			
			squarePhase=0;
		}
	}else if(mode==M_ADDARC){
		var s=MultiSnap(SR_DrawArc, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		var snapPoint = scene.points.length;
		
		if(s.type!='point')
			AddPoint(s.x, s.y);
		else
			snapPoint=s.index;
		
		if(arcPhase==0){
			arcPhase=1;
			tempArc.c=snapPoint;
		}
		else if(arcPhase==1){
			tempArc.aIdx=snapPoint;
			
			tempArc.a=FindAngle(scene.points[tempArc.c].x, scene.points[tempArc.c].y,
				scene.points[snapPoint].x, scene.points[snapPoint].y);
			
			tempArc.r=Distance(scene.points[tempArc.c].x, scene.points[tempArc.c].y,
				scene.points[tempArc.aIdx].x, scene.points[tempArc.aIdx].y);
			
			arcPhase=2;
		}
		else if(arcPhase==2){
			tempArc.bIdx=snapPoint;
			
			var lx = scene.points[tempArc.bIdx].x - scene.points[tempArc.c].x;
			var ly = scene.points[tempArc.bIdx].y - scene.points[tempArc.c].y;
			
			var mult = Distance(0,0,lx,ly)/tempArc.r;
			
			if(s.type=='point' && mult!=1){
				AddPoint(lx / mult + scene.points[tempArc.c].x, ly / mult + scene.points[tempArc.c].y);
				tempArc.bIdx = scene.points.length-1;
			}
			else{
				scene.points[tempArc.bIdx].x = lx / mult + scene.points[tempArc.c].x;
				scene.points[tempArc.bIdx].y = ly / mult + scene.points[tempArc.c].y;
			}
			
			tempArc.b=FindAngle(scene.points[tempArc.c].x, scene.points[tempArc.c].y,
				scene.points[snapPoint].x, scene.points[snapPoint].y);
			
			if(toolModifierEnabled){
				var k = tempArc.b;
				tempArc.b = tempArc.a;
				tempArc.a = k;
				
				k = tempArc.bIdx;
				tempArc.bIdx = tempArc.aIdx;
				tempArc.aIdx = k;
			}
			
			if(tempArc.b > tempArc.a)
				tempArc.b-= pi*2;
			
			
			
			scene.arcs.push(tempArc);
			
			var k = scene.arcs.length-1;
			
			for(var q = scene.circleC.length-1; q>=0; q--){
				PlaceCircleArcIntersections(q, k);
			}
			for(var q = scene.lines.length-1; q>=0; q--){
				PlaceArcLineIntersections(k, q);
			}
			
			arcPhase=0;
			tempArc=new Arc();
		}
	}else if(mode==M_CHAMFER){
		var s=MultiSnap(SR_ChamferFillet, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		
		if(s.type!='line')
			return;
		
		if(chamferPhase==0){
			chamferMSA = s;
			chamferPhase++;
			return;
		}
		
		chamferMSB = s;
		
		Chamfer(chamferMSA, chamferMSB, chamferDA, chamferDB);
		
		chamferPhase=0;
	}
}

function EditItem(){
	if(mode==M_TRIM){
		var s=MultiSnap(SR_Trim, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		TrimCircle(s, !toolModifierEnabled);
		TrimLine(s, !toolModifierEnabled);
		TrimArc(s, !toolModifierEnabled);
	}
	else if(mode==M_MEASURE){
		var s=MultiSnap(SR_Measure, mouseState.cursorXLocal(), mouseState.cursorYLocal());
		measureStart.x = s.x;
		measureStart.y = s.y
	}
}

function NukeCircle(index){
	scene.circleC.splice(index, 1);
	scene.circleR.splice(index, 1);
	
	for(var q = scene.circleInts.length-1; q>=0; q--){
		if(scene.circleInts[q].indexA>=index)
			scene.circleInts[q].indexA--;
		if(scene.circleInts[q].indexB>=index)
			scene.circleInts[q].indexB--;
		
		if(scene.circleInts[q].indexA==index || scene.circleInts[q].indexB==index){
			scene.circleInts.splice(q, 1);
		}
	}
	
	for(var q = scene.circleLineInt.length-1; q>=0; q--){
		if(scene.circleLineInt[q].indexA>index)
			scene.circleLineInt[q].indexA--;
		else if(scene.circleLineInt[q].indexA==index)
			scene.circleLineInt.splice(q, 1);
	}
}

function NukeLineByIndex(index){
	scene.lines.splice(index, 1);
	
	for(var q = scene.lineInts.length-1; q>=0; q--){
		if(scene.lineInts[q].indexA==index || scene.lineInts[q].indexB==index){
			scene.lineInts.splice(q, 1);
		}
	}
	for(var q = scene.lineInts.length-1; q>=0; q--){
		if(scene.lineInts[q].indexA>=index)
			scene.lineInts[q].indexA--;
		if(scene.lineInts[q].indexB>=index)
			scene.lineInts[q].indexB--;
	}
	
	for(var q = scene.arcLineInts.length-1; q>=0; q--){
		if(scene.arcLineInts[q].indexB>index)
			scene.arcLineInts[q].indexB--;
		else if(scene.arcLineInts[q].indexB==index)
			scene.arcLineInts.splice(q, 1);
	}
	
	for(var q = scene.circleLineInt.length-1; q>=0; q--){
		if(scene.circleLineInt[q].indexB>index)
			scene.circleLineInt[q].indexB--;
		else if(scene.circleLineInt[q].indexB==index)
			scene.circleLineInt.splice(q, 1);
	}
}

function NukePoint(index){
	scene.points.splice(index, 1);
	
	var k = scene.circleC.length;
	
	for(var q = 0; q<k; q++){
		if(scene.circleC[q]==index)
			NukeCircle(q);
		
		if(scene.circleC[q]>index){
			scene.circleC[q]--;}
	}
	
	k = scene.lines.length;
	
	for(var q = 0; q<k; q++)
	{
		if(scene.lines[q].pointA>index)
			scene.lines[q].pointA--;
		
		if(scene.lines[q].pointB>index)
			scene.lines[q].pointB--;
	}
	
	k = scene.arcs.length;
	
	for(var q = 0; q<k; q++){
		if(scene.arcs[q].a>index)
			scene.arcs[q].a--;
		if(scene.arcs[q].b>index)
			scene.arcs[q].b--;
		if(scene.arcs[q].c>index)
			scene.arcs[q].c--;
	}
}

function NukeArc(index){
	scene.arcs.splice(index, 1);
}

function NukeArcByPoint(pointIndex){
	var k = scene.arcs.length;
	
	for(var q = 0; q<k; q++){
		if(scene.arcs[q].aIdx==pointIndex || scene.arcs[q].bIdx==pointIndex || scene.arcs[q].c==pointIndex){
			NukeArc(q);
		}
		
		if(scene.arcs[q].aIdx>pointIndex){
			scene.arcs[q].aIdx--;
		}
		if(scene.arcs[q].c>pointIndex){
			scene.arcs[q].c--;
		}
		if(scene.arcs[q].bIdx>pointIndex){
			scene.arcs[q].bIdx--;
		}
	}
}

function NukeLineByEndpoint(index){
	for(var q = scene.lines.length-1; q>=0; q--){
		if(scene.lines[q].pointA==index || scene.lines[q].pointB==index){
			NukeLineByIndex(q);
		}
	}
}

function DeleteItem(){
	if(mode!=M_DELETE)
		return;
	
	var s = MultiSnap(SR_Delete, mouseState.cursorXLocal(), mouseState.cursorYLocal());
	
	if(s.type=='failed')
		return;
	
	if(s.type=='circle'){
		NukeCircle(s.index);
	}
	else if(s.type=='point'){
		
		NukeLineByEndpoint(s.index);
		NukeArcByPoint(s.index);
		NukePoint(s.index);
	}
	else if(s.type=='arc')
		NukeArc(s.index);
	else if(s.type=='line')
		NukeLineByIndex(s.index);
}



function DeleteQuery(distance, ix, iy){
	var nearest = -1;
	var delta = distance;
	
	nearest = Snap(distance, ix, iy);
	
	var k = Rail(lastSnapDelta, ix, iy);
}

function Scene(){
	/*this.pointsX = new Array();
	this.pointsY = new Array();*/
	
	this.points = new Array();
	
	this.lines = new Array();
	this.lineInts = new Array();
	
	this.circleC = new Array();
	this.circleR = new Array();
	
	this.circleInts = new Array();
	
	this.circleLineInt = new Array();
	
	this.arcs = new Array();
	
	/*this.arcC = new Array();
	this.arcA = new Array();
	this.arcAIdx = new Array();
	this.arcB = new Array();
	this.arcBIdx = new Array();
	this.arcR = new Array();*/
	
	this.circleArcIntX = new Array();
	this.circleArcIntY = new Array();
	this.circleArcIntArcIdx = new Array();
	this.circleArcIntCircleIdx = new Array();
	
	this.arcLineInts = new Array();
}

function Selection(){
	this.type='point';
	this.index=-1;
}

var scene = new Scene(), blankScene = new Scene();

function SaveScene(){alert("saving is on the ToDo list.  sorry");}

function NewScene(){scene=new Scene();  camX = 0; camY=0; zoom=1;}