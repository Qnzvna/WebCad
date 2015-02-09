function Point(x, y)
{
	this.x = 0; this.y = 0;
	if(x!=undefined){
		this.x=x; this.y=y;}
	
	
	this.color = "white"
	this.radius = 2;
	
	this.Length=function(){return Math.sqrt(this.x*this.x + this.y*this.y);}
	
	this.Normalize=function(){var l = this.Length(); this.x/=l; this.y/=l}
}

function Line(base){
	//ax + by = c
	
	this.a = 0;
	this.b = 1;
	this.c = 1;
	
	this.type = 'segment';
	
	this.positive=true;
	
	this.pointA = -1;
	this.pointB = -1;
	
	this.mid = new Point();
	
	if(base!=undefined){
		if(base.positive!=undefined){
			this.a = base.a;
			this.b = base.b;
			this.c = base.c;
			this.type = base.type;
			this.pointA = base.pointA;
			this.pointB = base.pointB;
			this.mid = base.mid;
		}
	}
	
	this.RecalculateLineFromEndpoints = function(pA, pB){
		this.pointA = pA;
		this.pointB = pB;
		
		var m = (scene.points[pB].y - scene.points[pA].y)/-(scene.points[pB].x - scene.points[pA].x);
		this.a = m;
		this.c = scene.points[pB].y + m * scene.points[pB].x;
		
		this.mid.x = (scene.points[this.pointA].x + scene.points[this.pointB].x)/2;
		this.mid.y = (scene.points[this.pointA].y + scene.points[this.pointB].y)/2;
	}
	
	this.BetweenEndpoints = function(point){
		if(this.type=='infinite')
			return true;
		
		var gx = 0, sx = 0, gy = 0, sy = 0;
		
		var vert = false, horiz = false;
		
		if(this.type=='ray'){
			if(this.a==0)
				horiz=true;
			if(this.b==0)
				vert=true;
			if(vert&&horiz)
				return false;
			
			if(this.positive){
				if(vert && point.y > scene.points[this.pointA].y)
					return true;
				else if(point.x > scene.points[this.pointA].x)
					return true;
				return false;
			}else{
				if(vert && point.y < scene.points[this.pointA].y)
					return true;
				else if(point.x < scene.points[this.pointA].x)
					return true;
				return false;
			}
		}
		
		if(scene.points[this.pointA].x==scene.points[this.pointB].x)
			vert=true;
		else if(scene.points[this.pointA].x>scene.points[this.pointB].x){
			gx = this.pointA; sx = this.pointB;
		}
		else{
			sx = this.pointA; gx = this.pointB;
		}
		
		if(scene.points[this.pointA].y==scene.points[this.pointB].y)
			horiz=true;
		else if(scene.points[this.pointA].y>scene.points[this.pointB].y){
			gy = this.pointA; sy = this.pointB;
		}
		else{
			sy = this.pointA; gy = this.pointB;
		}
		
		if(horiz&&vert)
			return false;
		
		
		
		if(horiz && point.x > scene.points[sx].x && point.x < scene.points[gx].x)
			return true;
		else if(vert && point.y > scene.points[sy].y && point.y < scene.points[gy].y)
			return true;
		else if(point.x > scene.points[sx].x && point.x < scene.points[gx].x && 
			point.y > scene.points[sy].y && point.y < scene.points[gy].y)
			return true;
		
		return false;
	}
	
	this.IntersectWithLine = function(line){
		var rv = new Intersection();
		
		/*
		
		[a b  * [x = [u
		c d]    y]   v]
		
		*/
		
		var a = this.a, b = this.b, 
			c = line.a, d = line.b,
			u = this.c, v = line.c;
		
		// k->this q->line
			
		if(this.a*line.b - line.a*this.b !=0){
			var j = 0;
			
			var rE=false;
			
			if(a==0){ //row exchange
				j = c;
				c = a;
				a = j;
				
				j = d;
				d = b;
				b = j;
				rE=true;
			}
			
			//elimination
			var j = c/a;
			c=0;
			d-=b*j;
			v-=u*j;
			
			//solution
			j=v/d;
			if(!rE){
				rv.y=j;
				rv.x=(u-b*j)/a;
			}
			else{
				rv.x=j;
				rv.y=(u-b*j)/a;
			}
			
			if(this.BetweenEndpoints(rv) && line.BetweenEndpoints(rv))
				return rv;
		}
		
		return 0;
	}
	
	this.PointDistance = function(point, rounding){
		if(rounding!=undefined)
			return RoundNumber((this.a*point.x + this.b*point.y - this.c)/ Math.sqrt(this.a*this.a + this.b*this.b), rounding);
		else
			return (this.a*point.x + this.b*point.y - this.c)/ Math.sqrt(this.a*this.a + this.b*this.b)
	}
}

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













