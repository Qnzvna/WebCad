var snapDistance = 16, 
curveSnapDistance = 12, 
midpointSnapDistance = 14, 
circleIntSnapDistance = 14, 
gridIntersectionSnapDistance=10,
lineSnapDist=10;

function SnapRule(point, line, circle, arc, mid, intersection, gridPoint, gridLine){
	this.point = point;
	this.line = line;
	this.circle = circle;
	this.arc = arc;
	this.mid = mid;
	this.gridPoint = gridPoint;
	this.gridLine = gridLine;
	this.intersection = intersection;
	
	this.cRadius = 8;
	this.cColor = "#60A0FF";
}

//Snapping Rules

var SR_DrawPoint = 		new SnapRule(0,  15, 14, 14, 12, 13, 10, 8),
	SR_DrawLine = 		new SnapRule(16, 15, 14, 14, 12, 13, 10, 8),
	SR_DrawCircle = 	new SnapRule(16, 15, 14, 14, 12, 13, 10, 8),
	SR_DrawArc = 		new SnapRule(16, 15, 14, 14, 12, 13, 10, 8),
	SR_Delete = 		new SnapRule(16, 15, 14, 14, 0,  0,  0,  0),
	SR_Trim = 		new SnapRule(0,  15, 14, 14, 0,  0,  0,  0),
	SR_Measure = 		new SnapRule(16, 15, 14, 14, 12, 13, 10, 8),
	SR_AddParallelLine = 	new SnapRule(0,  12,  0,  0,  0,  0,  0, 0),
	SR_ChamferFillet = 	new SnapRule(0,  10,  0,  0,  0,  0,  0, 0),
	SR_Null = 		new SnapRule(16, 15, 14, 14, 12, 13, 10, 8);

SR_Delete.cColor="#FF1010";
SR_Trim.cColor = "#FFA0FF";
SR_Measure.cColor = "#EEEE00";
SR_Null.cColor = "#88BBFF";
SR_Null.cRadius = 6;

var cancledSnap = {'index':-1, 'delta': 0, 'location':new Point()};

function Snap(distance, ix, iy){
	var nearest = -1;
	var delta = distance;
	
	for(var q = scene.points.length-1; q>=0; q--){
		var k = Math.sqrt((scene.points[q].x-ix)*(scene.points[q].x-ix) + (scene.points[q].y-iy)*(scene.points[q].y-iy));
		if(k < delta){nearest=q; delta=k;}
	}
	
	if(nearest==-1)
		return cancledSnap;
	
	var location = new Point(scene.points[nearest].x, scene.points[nearest].y);
	
	return {'index':nearest, 'delta':delta, 'location':location};
}
;

function SnapToMidpoint(distance, ix, iy){
	var nearest = -1;
	var delta = distance;
	
	for(var q = scene.lines.length-1; q>=0; q--){
			if(scene.lines[q].type=='segment'){
			var k = Math.sqrt((scene.lines[q].mid.x-ix)*(scene.lines[q].mid.x-ix) + (scene.lines[q].mid.y-iy)*(scene.lines[q].mid.y-iy));
			if(k < delta){nearest=q; delta=k;}
		}
	}
	
	var loc = new Point();
	
	if(nearest>=0){
		loc.x = scene.lines[nearest].mid.x;
		loc.y = scene.lines[nearest].mid.y;
	}
	
	return {'index':nearest, 'delta':delta, 'location':loc};
}

var lastCircleIntSnapDelta = 0;

function SnapToCircleInt(distance, ix, iy){
	if(distance==0)
		return cancledSnap;
	
	var nearest = -1;
	var delta = distance;
	
	for(var q = scene.circleInts.length-1; q>=0; q--){
		var k = Math.sqrt((scene.circleInts[q].x-ix)*(scene.circleInts[q].x-ix) + (scene.circleInts[q].y-iy)*(scene.circleInts[q].y-iy));
		if(k < delta){nearest=q; delta=k;}
	}
	
	if(nearest==-1)
		return cancledSnap;
	
	lastCircleIntSnapDelta = delta;
	
	
	var location = new Point();
	
	if(nearest>=0){
		location.x = scene.circleInts[nearest].x;
		location.y = scene.circleInts[nearest].y;
	}
	
	
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function SnapToCircleArcInt(distance, ix, iy){
	if(distance==0)
		return cancledSnap;
	
	var nearest = -1;
	var delta = distance;
	
	for(var q = scene.circleArcIntX.length-1; q>=0; q--){
		var k = Math.sqrt((scene.circleArcIntX[q]-ix)*(scene.circleArcIntX[q]-ix) + (scene.circleArcIntY[q]-iy)*(scene.circleArcIntY[q]-iy));
		if(k < delta){nearest=q; delta=k;}
	}
	
	if(nearest==-1)
		return cancledSnap;
	
	var location = new Point(scene.circleArcIntX[nearest], scene.circleArcIntY[nearest]);
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function SnapToArc(distance, ix, iy){
	if(distance==0)
		return cancledSnap;
	
	var nearest = -1;
	var delta = distance;

	for(var q = scene.arcs.length-1; q>=0; q--){
		var k = Distance(scene.points[scene.arcs[q].c].x, scene.points[scene.arcs[q].c].y, ix, iy) - scene.arcs[q].r;
		
		var theta = FindAngle(scene.points[scene.arcs[q].c].x, scene.points[scene.arcs[q].c].y, ix, iy);
		
		arcTheta=theta;
		
		if(Math.abs(k) < delta && IsAngleOnArc(theta, q)){
			delta=k; nearest=q; }
	}
	
	if(nearest==-1)
		return cancledSnap;
	
	var mult = scene.arcs[nearest].r / Distance(scene.points[scene.arcs[nearest].c].x, scene.points[scene.arcs[nearest].c].y, 
		mouseState.cursorXLocal(), mouseState.cursorYLocal());
	var x = scene.points[scene.arcs[nearest].c].x - mouseState.cursorXLocal();
	var y = scene.points[scene.arcs[nearest].c].y - mouseState.cursorYLocal();
	
	x *= -mult;
	y*= -mult;
	
	x += scene.points[scene.arcs[nearest].c].x;
	y += scene.points[scene.arcs[nearest].c].y;
	
	var location = new Point(x, y);
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function Rail(distance, ix, iy){
	if(distance==0)
		return cancledSnap;
	
	var nearest = -1;
	var delta = distance;
	
	for (var q = scene.circleC.length-1; q>=0; q--){
		var k = Distance(scene.points[scene.circleC[q]].x, scene.points[scene.circleC[q]].y, ix, iy) - scene.circleR[q];
		if(Math.abs(k) < delta){delta = k; nearest = q;}
	}
	
	if(nearest==-1)
		return cancledSnap;
	
	var mult = scene.circleR[nearest] / Distance(scene.points[scene.circleC[nearest]].x, scene.points[scene.circleC[nearest]].y, 
		mouseState.cursorXLocal(), mouseState.cursorYLocal());
	
	var location = new Point();
	
	location.x = scene.points[scene.circleC[nearest]].x - mouseState.cursorXLocal();
	location.y = scene.points[scene.circleC[nearest]].y - mouseState.cursorYLocal();
	
	location.x *= -mult;
	location.y*= -mult;
	
	location.x += scene.points[scene.circleC[nearest]].x;
	location.y += scene.points[scene.circleC[nearest]].y;
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function GenericSnapToLine(distance, ix, iy, line){
	if(distance==0)
		return cancledSnap;
	
	var delta=distance, location=new Point();
	
	var k = line.PointDistance(new Point(ix, iy));
	
	if(Math.abs(k) < delta){
		if(line.b==0){
			location.x = ix - k;
			location.y = iy;
		}
		if(line.a==0){
			location.x = ix;
			location.y = iy-k;
		}
		else{
			var moveVec = {'x' : 1, 'y' : 0};
			
			var m = line.b / -line.a;
			
			if(m>0)
				k*=-1;
			
			var n = Math.sqrt(1 + m*m);
			
			moveVec = {'x' : 1/n, 'y' : m/n};
			
			location.x = ix - moveVec.x * k;
			location.y = iy + moveVec.y * k;
		}
		
		if(line.BetweenEndpoints(location))
			delta=Math.abs(k);
	}
	
	return {'delta':delta, 'location':location};
}

function SnapToLine(distance, ix, iy){
	if(distance==0)
		return cancledSnap;
	var nearest = -1;
	var delta = distance;
	var location = new Point();
	
	for(var q = scene.lines.length-1; q>=0; q--){
		var k = GenericSnapToLine(delta, ix, iy, scene.lines[q]);
		if(k.delta<delta){
			delta=k.delta;
			nearest=q;
			location=k.location;
		}
	}
	
	return {'index':nearest, 'delta':delta, 'location':location};
}

function MultiSnap(snapRule, rix, riy){
	
	var ix = rix, iy = riy;
	
	var snapType = 'failed';
	
	var pointSnapOut = Snap(snapRule.point/zoom, ix, iy);
	
	var circleSnapOut = Rail(snapRule.circle/zoom, ix, iy);
	
	var midSnapOut = SnapToMidpoint(snapRule.mid/zoom, ix, iy);
	
	var circleIntOut = SnapToCircleInt(snapRule.intersection/zoom, ix, iy);
	
	var circleArcIntOut = SnapToCircleArcInt(snapRule.intersection/zoom, ix, iy);
	
	var arcSnapOut = SnapToArc(snapRule.arc/zoom, ix, iy);
	
	var lineSnapOut = SnapToLine(snapRule.line/zoom, ix, iy);
	
	var latestDelta = 100;
	
	var x = ix, y = iy;
	var idx = -1;
	
	if (pointSnapOut.index >= 0 && latestDelta > pointSnapOut.delta){
		snapType = 'point';
		
		x = pointSnapOut.location.x;
		y = pointSnapOut.location.y;
		
		idx = pointSnapOut.index;
		
		latestDelta = pointSnapOut.delta;
	}
	
	else if(circleIntOut.index >=0 && circleIntOut.delta < latestDelta)
	{
		snapType = 'circleInt';
		idx = circleIntOut.index;
		
		x = circleIntOut.location.x;
		y = circleIntOut.location.y;
		
		latestDelta = circleIntOut.delta;
	}
	else if(circleArcIntOut.index >=0 && circleArcIntOut.delta < latestDelta)
	{
		snapType = 'circleArcInt';
		idx = circleArcIntOut.index;
		x = circleArcIntOut.location.x; y = circleArcIntOut.location.y;
		latestDelta = circleArcIntOut.delta;
	}
	else if(circleSnapOut.index >=0 && circleSnapOut.delta < latestDelta)
	{
		snapType = 'circle';
		idx = circleSnapOut.index;
		x = circleSnapOut.location.x, y = circleSnapOut.location.y;
		latestDelta = circleSnapOut.delta;
	}
	else if(arcSnapOut.index>=0 && arcSnapOut.delta < latestDelta){
		snapType='arc';
		idx = arcSnapOut.index;
		x = arcSnapOut.location.x; y = arcSnapOut.location.y;
		
		latestDelta = arcSnapOut.delta;
	}
	else if(midSnapOut.index >=0 && midSnapOut.delta < latestDelta){
		snapType = 'midpoint';
		idx = midSnapOut.index;
		
		x = midSnapOut.location.x;
		y = midSnapOut.location.y;
		
		latestDelta = midSnapOut.delta;
	}
	else if(lineSnapOut.index>=0 && lineSnapOut.delta < latestDelta){
		snapType='line';
		idx = lineSnapOut.index;
		x = lineSnapOut.location.x, y = lineSnapOut.location.y;
		latestDelta=lineSnapOut.delta;
	}
	
	
	var dx = Math.abs(x-lastUsedPoint.x), dy = Math.abs(y-lastUsedPoint.y);
	
	if(axisSnap){
		
		if(!axisSnapXLock && !axisSnapYLock){
			if(dx<dy)
				x = lastUsedPoint.x;
			else
				y = lastUsedPoint.y;
		}
		else{
			if(axisSnapXLock)
				y = lastUsedPoint.y;
			else if(axisSnapYLock)
				x = lastUsedPoint.x;
		}
		
		if(dx != 0 && dy != 0)
			snapType='failed';
	}
	
	if(snapType=='failed' && snapToGrid && showGrid){
		var tx = Math.abs(x) % gridSpacing;
		
		if(tx>=gridSpacing/2)
			tx-=gridSpacing;
		
		var ty = Math.abs(y) % gridSpacing;
		
		if(ty>=gridSpacing/2){
			ty-=gridSpacing;}
		
		if(Distance(tx, ty, 0, 0)<gridIntersectionSnapDistance){
			
			var xMult = 1, yMult = 1;
			if(x<0)
				xMult=-1;
			if(y<0)
				yMult=-1;
			
			x = x - tx * xMult;
			y = y - ty * yMult;
		}
	}
	
	return {'type' : snapType, 'x' : x, 'y' : y, 'index' : idx};
}

function MultiSnapNoGrid(distance, rix, riy){
	if(snapToGrid)
	{
		snapToGrid=false;
		var s = MultiSnap(distance, rix, riy);
		snapToGrid=true;
		return s;
	}
	return MultiSnap(distance, rix, riy);
}