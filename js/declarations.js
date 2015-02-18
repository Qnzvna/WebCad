var counter = 0;
var context;
var displayHeight = 600, displayWidth = 800, offsetX = 0, offsetY = 0;
var inFocus = false, initResize=false;
var cvn = 0;
var launchTime = new Date().getTime(), prevLoop = launchTime, currentLoop = launchTime, loopDeltaT = 0;
var showGrid = true, snapToGrid = false, gridSpacing=100;
var toolModifierEnabled=false;

var pi = Math.PI;

var conversionFactor = 1, unitName = "px";

displayName="CADDisplay";
var tooltip = "JSCAD";

function SetTooltip(t){tooltip=t;}

function Cap(k, limit){if(k>limit){return limit;}return k;}
function InvCap(k, limit){if(k<limit){return limit;}return k;}

function Distance(ax, ay, bx, by){return Math.sqrt((ax-bx)*(ax-bx) + (ay-by)*(ay-by));}

function returnWindowHeight(){return windowHeight;}

function OnCanvasOver()
{
	inFocus = true;
}

function OnCanvasLeave()
{
	inFocus = false;
}

var railing = -1;

function FindCircleIntersections(r1, r2, delta){
	var solNum = 0;

	if(r1 + r2 == delta)
		solNum = 1;
	else if(r1+r2>delta)
		solNum=2;
	else
		return {'number' : 0};

	var x = r2*r2 - r1*r1 - delta*delta;
	x /= -2 * delta;

	var y = Math.sqrt(r1*r1 - x*x);

	if(solNum === 0)
		return {'number' : solNum};
	else if(solNum==1)
		return {'number' : solNum, 'x1' : x, 'y1' : y};
	else
		return {'number' : solNum, 'x1' : x, 'y1' : y, 'y2' : -1*y};
}

function PlaceCircleLineIntersections(circleIndex, lineIndex){
	var line = scene.lines[lineIndex];

	var k = (line.a*scene.points[scene.circleC[circleIndex]].x + line.b*scene.points[scene.circleC[circleIndex]].y - line.c)/
		Math.sqrt(line.a*line.a + line.b*line.b);

		//k = RoundNumber(k, 10);

	var roundedRadius = RoundNumber(scene.circleR[circleIndex], 10);

	var roundedK = RoundNumber(k, 10);

	if(Math.abs(roundedK)>roundedRadius)
		return;
	else if(Math.abs(roundedK)==roundedRadius){
		var moveVec = {'x' : 1, 'y' : 0};

		var m = line.b / -line.a;

		if(m>0)
			k*=-1;

		var n = Math.sqrt(1 + m*m);

		moveVec = {'x' : 1/n, 'y' : m/n};

		var j = new Intersection();
		j.x = RoundNumber(scene.points[scene.circleC[circleIndex]].x - moveVec.x * k, 10);
		j.y = RoundNumber(scene.points[scene.circleC[circleIndex]].y + moveVec.y * k, 10);

		j.indexA = circleIndex;
		j.indexB = lineIndex;

		scene.circleLineInt.push(j);
	}else{
		var i = new Intersection(), j = new Intersection();

		i.x = Math.sqrt(scene.circleR[circleIndex]*scene.circleR[circleIndex] - k*k);
		j.x = i.x * -1;
		i.y = k; j.y = k;

		j.indexA = circleIndex;
		j.indexB = lineIndex;
		i.indexA = circleIndex;
		i.indexB = lineIndex;

		var m = line.a / -line.b;
		var thetaNaught = Math.atan(m);
		thetaNaught-=pi;

		var x = i.x*Math.cos(thetaNaught) - i.y*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex]].x,
			y = i.x*Math.sin(thetaNaught) + i.y*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex]].y;

		i.x = x; i.y = y;

		x = j.x*Math.cos(thetaNaught) - j.y*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex]].x;

		y = j.x*Math.sin(thetaNaught) + j.y*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex]].y;

		j.x = x; j.y = y;

		if(scene.lines[lineIndex].BetweenEndpoints(i))
			scene.circleLineInt.push(i);
		if(scene.lines[lineIndex].BetweenEndpoints(j))
			scene.circleLineInt.push(j);
	}

}

function PlaceArcLineIntersections(arcIndex, lineIndex){
	var line = scene.lines[lineIndex];

	var k = (line.a*scene.points[scene.arcs[arcIndex].c].x + line.b*scene.points[scene.arcs[arcIndex].c].y - line.c)/
		Math.sqrt(line.a*line.a + line.b*line.b);


	var roundedRadius = RoundNumber(scene.circleR[arcIndex], 10);

	var roundedK = RoundNumber(k, 10);

	if(Math.abs(roundedK)>roundedRadius)
		return;
	else if(Math.abs(roundedK)==roundedRadius){
		var moveVec = {'x' : 1, 'y' : 0};

		var m = line.b / -line.a;

		if(m>0)
			k*=-1;

		var n = Math.sqrt(1 + m*m);

		moveVec = {'x' : 1/n, 'y' : m/n};

		var j = new Intersection();
		j.x = RoundNumber(scene.points[scene.arcs[arcIndex].c].x - moveVec.x * k, 10);
		j.y = RoundNumber(scene.points[scene.arcs[arcIndex].c].y + moveVec.y * k, 10);

		j.indexA = arcIndex;
		j.indexB = lineIndex;

		var t = FindAngle(scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].x,
				  j.x, j.y);

		if(t>scene.arcs[arcIndex].a && t<scene.arcs[arcIndex].b)
			scene.circleLineInt.push(j);
	}else{
		var i = new Intersection(), j = new Intersection();

		i.x = Math.sqrt(scene.arcs[arcIndex].r*scene.arcs[arcIndex].r - k*k);
		j.x = i.x * -1;
		i.y = k; j.y = k;

		j.indexA = arcIndex;
		j.indexB = lineIndex;
		i.indexA = arcIndex;
		i.indexB = lineIndex;

		var m = line.a / -line.b;
		var thetaNaught = Math.atan(m);
		thetaNaught-=pi;

		var x = i.x*Math.cos(thetaNaught) - i.y*Math.sin(thetaNaught) + scene.points[scene.arcs[arcIndex].c].x,
			y = i.x*Math.sin(thetaNaught) + i.y*Math.cos(thetaNaught) + scene.points[scene.arcs[arcIndex].c].y;

		i.x = x; i.y = y;

		x = j.x*Math.cos(thetaNaught) - j.y*Math.sin(thetaNaught) + scene.points[scene.arcs[arcIndex].c].x;

		y = j.x*Math.sin(thetaNaught) + j.y*Math.cos(thetaNaught) + scene.points[scene.arcs[arcIndex].c].y;

		j.x = x; j.y = y;

		var t = FindAngle(scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y,
				  i.x, i.y);

		if(scene.lines[lineIndex].BetweenEndpoints(i) && IsAngleOnArc(t, arcIndex))
			scene.arcLineInts.push(i);

		t = FindAngle(scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y,
				  j.x, j.y);

		if(scene.lines[lineIndex].BetweenEndpoints(j) && IsAngleOnArc(t, arcIndex))
			scene.arcLineInts.push(j);
	}

}

function PlaceCircleIntersections(circleIndex1, circleIndex2){
	var thetaNaught=FindAngle(scene.points[scene.circleC[circleIndex1]].x, scene.points[scene.circleC[circleIndex1]].y, scene.points[scene.circleC[circleIndex2]].x, scene.points[scene.circleC[circleIndex2]].y);

	var i = FindCircleIntersections(scene.circleR[circleIndex1], scene.circleR[circleIndex2],
		Distance(scene.points[scene.circleC[circleIndex1]].x, scene.points[scene.circleC[circleIndex1]].y,
			 scene.points[scene.circleC[circleIndex2]].x, scene.points[scene.circleC[circleIndex2]].y));


	if(i.number==1){

		var x = i.x1*Math.cos(thetaNaught) - i.y1*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex1]].x,
			y = i.x1*Math.sin(thetaNaught) + i.y1*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex1]].y;

		var f = new Intersection();

		f.x = x;
		f.y = y;
		f.indexA = circleIndex1;
		f.indexB = circleIndex2;

		scene.circleInts.push(f);
	}
	else if(i.number==2){
		var x = i.x1*Math.cos(thetaNaught) - i.y1*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex1]].x,
			y = i.x1*Math.sin(thetaNaught) + i.y1*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex1]].y;


		var f = new Intersection();

		f.x = x;
		f.y = y;
		f.indexA = circleIndex1;
		f.indexB = circleIndex2;

		scene.circleInts.push(f);
		f = new Intersection();

		x = i.x1*Math.cos(thetaNaught) - i.y2*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex1]].x;
		y = i.x1*Math.sin(thetaNaught) + i.y2*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex1]].y;

		f.x = x;
		f.y = y;
		f.indexA = circleIndex1;
		f.indexB = circleIndex2;
		scene.circleInts.push(f);
	}

	return thetaNaught / pi * 180;
}

function PlaceCircleArcIntersections(circleIndex, arcIndex){
	var thetaNaught=FindAngle(scene.points[scene.circleC[circleIndex]].x, scene.points[scene.circleC[circleIndex]].y,
				  scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y);

	var i = FindCircleIntersections(scene.circleR[circleIndex], scene.arcs[arcIndex].r,
		Distance(scene.points[scene.circleC[circleIndex]].x, scene.points[scene.circleC[circleIndex]].y,
			 scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y));

	if(i.number==1){
		var x = i.x1*Math.cos(thetaNaught) - i.y1*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex]].x,
			y = i.x1*Math.sin(thetaNaught) + i.y1*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex]].y;

		if(!IsAngleOnArc(FindAngle(scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y, x, y), arcIndex))
			return;

		scene.circleArcIntX.push(x);
		scene.circleArcIntY.push(y);

		scene.circleArcIntArcIdx.push(arcIndex);
			scene.circleArcIntCircleIdx.push(circleIndex);
	}
	else if(i.number==2){
		var x = i.x1*Math.cos(thetaNaught) - i.y1*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex]].x,
			y = i.x1*Math.sin(thetaNaught) + i.y1*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex]].y;


		if(IsAngleOnArc(FindAngle(scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y, x, y), arcIndex)){
			scene.circleArcIntX.push(x);
			scene.circleArcIntY.push(y);

			scene.circleArcIntArcIdx.push(arcIndex);
			scene.circleArcIntCircleIdx.push(circleIndex);
		}

		x = i.x1*Math.cos(thetaNaught) - i.y2*Math.sin(thetaNaught) + scene.points[scene.circleC[circleIndex]].x;
		y = i.x1*Math.sin(thetaNaught) + i.y2*Math.cos(thetaNaught) + scene.points[scene.circleC[circleIndex]].y;

		if(IsAngleOnArc(FindAngle(scene.points[scene.arcs[arcIndex].c].x, scene.points[scene.arcs[arcIndex].c].y, x, y), arcIndex)){
			scene.circleArcIntX.push(x);
			scene.circleArcIntY.push(y);

			scene.circleArcIntArcIdx.push(arcIndex);
			scene.circleArcIntCircleIdx.push(circleIndex);
		}
	}

	return thetaNaught / pi * 180;
}

function FindAngle(localOriginX, localOriginY, x, y){
	var theta = Math.atan((y-localOriginY)/(x-localOriginX));

	if(x<localOriginX)
		theta-=pi;
	else if(y>localOriginY)
		theta-=pi*2;

	if(x==localOriginX){
		theta=pi/2;
		if(y<localOriginY)
			theta=pi/2*3;
	}

	return theta;
}

function IsAngleOnArc(theta, arcIndex){
	var b = scene.arcs[arcIndex].b;

	if(b<-pi*2){
		if(theta>scene.arcs[arcIndex].a)
			theta-=pi*2;
	}

	if(theta<scene.arcs[arcIndex].a && theta>scene.arcs[arcIndex].b)
		return true;
	return false;
}

function RoundNumber(num, dec){return result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);}

function changecssproperty(target, prop, value, action){
    if (typeof prop!="undefined")
        target.style[prop]=(action=="remove")? "" : value
}
