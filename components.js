function Arc(){
	this.c = -1;
	this.a = 0;
	this.aIdx = -1;
	this.b = 0;
	this.bIdx = -1;
	this.r = 0;


}

function Intersection(){
	this.x = 0;
	this.y = 0;

	this.indexA = -1;
	this.indexB = -1;
}

function LineFromEndpoints(pA, pB){
	var rv = TwoPointLine(scene.points[pA], scene.points[pB]);

	rv.pointA = pA;
	rv.pointB = pB;

	return rv;
}

function TwoPointLine(pA, pB){
	var rv = new Line();

	rv.pointA = -1;
	rv.pointB = -1;

	var m = (pB.y - pA.y)/-(pB.x - pA.x);
	rv.a = m;
	rv.c = pB.y + m * pB.x;

	rv.mid.x = (pA.x + pB.x)/2;
	rv.mid.y = (pA.y + pB.y)/2;

	if(pA.x == pB.x){
		rv.a = 1; rv.b = 0; rv.c = pA.x;
	}

	return rv;
}

function InfiniteLineFromPoints(pointA, pointB, place){
	var rv = new Line();
	rv.type='infinite';

	var m = (pointB.y - pointA.y)/-(pointB.x - pointA.x);
	rv.a = m;
	rv.c = pointB.y + m * pointB.x;

	var k = scene.lines.length;

	if(pointA.x == pointB.x){
		rv.a = 1; rv.b = 0; rv.c = pointA.x;
	}

	if(place==false)
		return rv;

	scene.lines.push(rv);

	for(var q = scene.circleC.length-1; q >=0; q--){
		PlaceCircleLineIntersections(q, k);
	}

	for(var q = scene.lines.length-2; q>=0; q--){
		var j = scene.lines[q].IntersectWithLine(rv)
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

	return rv;
}

function InfiniteLineThroughPoint(p, a, b, place){
	var k = scene.lines.length;

	var rv = new Line();
	rv.type='infinite';
	rv.a = a;
	rv.b = b;
	rv.c = a*p.x + b*p.y;

	if(place==false)
		return rv;

	console.log("hi");

	scene.lines.push(rv);

	for(var q = scene.circleC.length-1; q >=0; q--){
		PlaceCircleLineIntersections(q, k);
	}

	for(var q = scene.lines.length-2; q>=0; q--){
		var j = scene.lines[q].IntersectWithLine(rv)
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

	return rv;
}

function ClearUnusedPoints(){
	for(var q = scene.points.length-1; q>=0; q--){
		ClearPointIfUnused(q);
	}
}

function ClearPointIfUnused(index){
	if(index<0)
		return;

	var used=false;

	for(var k = scene.lines.length-1; k>=0; k--){
		if(scene.lines[k].pointA==index || scene.lines[k].pointB==index)
			used=true;
	}

	for(var k = scene.circleC.length-1; k>=0; k--){
		if(scene.circleC[k]==index)
			used=true;
	}

	for(var k = scene.arcs.length-1; k>=0; k--){
		if(scene.arcs[k].c==index || scene.arcs[k].aIdx==index || scene.arcs[k].bIdx==index)
			used=true;
	}

	if(!used){
		NukePoint(index);
	}

	return used;
}
