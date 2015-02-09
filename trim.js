function TrimCircle(multisnap, keep){
	if(multisnap.type!='circle')
		return;
	
	var index=multisnap.index;
	
	var thetas = new Array(), thetaIn=FindAngle(scene.points[scene.circleC[index]].x, 
				    scene.points[scene.circleC[index]].y,
				    multisnap.x, multisnap.y);
	
	for(var q = scene.circleInts.length-1; q>=0; q--){
		if(scene.circleInts[q].indexA==index || scene.circleInts[q].indexB==index)
			thetas.push(FindAngle(scene.points[scene.circleC[index]].x, 
				    scene.points[scene.circleC[index]].y, 
					scene.circleInts[q].x, scene.circleInts[q].y));
	}
	
	for(var q = scene.circleArcIntCircleIdx.length-1; q>=0; q--){
		if(scene.circleArcIntCircleIdx[q]==index)
			thetas.push(FindAngle(scene.points[scene.circleC[index]].x, 
				    scene.points[scene.circleC[index]].y, 
					scene.circleArcIntX[q], scene.circleArcIntY[q]));
	}
	
	for(var q = scene.circleLineInt.length-1; q>=0; q--){
		if(scene.circleLineInt[q].indexA==index)
			thetas.push(FindAngle(scene.points[scene.circleC[index]].x, 
				    scene.points[scene.circleC[index]].y, 
					scene.circleLineInt[q].x, scene.circleLineInt[q].y));
	}
	
	for(var q = scene.points.length-1; q>=0; q--){
		if(RoundNumber(Distance(scene.points[q].x, scene.points[q].y, 
			scene.points[scene.circleC[index]].x, scene.points[scene.circleC[index]].y), 10)==RoundNumber(scene.circleR[index], 10)){
			thetas.push(FindAngle(scene.points[scene.circleC[index]].x, scene.points[scene.circleC[index]].y, scene.points[q].x, scene.points[q].y));
		}
	}
	
	var endTheta = pi*-2, startTheta = 0, endIndex = -1, startIndex = -1;
	
	for(var q = thetas.length-1; q>=0; q--){
		if(thetas[q] > endTheta && thetas[q] < thetaIn){
			endTheta = thetas[q];
			endIndex=q;
		}
		
		if(thetas[q] < startTheta && thetas[q] > thetaIn){
			startTheta = thetas[q];
			startIndex=q;
		}
	}
	
	if(startIndex==-1){
		startTheta = 0;
		
		for(var k = thetas.length-1; k>=0; k--){
			if(thetas[k]<startTheta){
				startTheta = thetas[k];
				startIndex=k;
			}
		}
	}
	
	if(endIndex==-1){
		endTheta = pi*-2;
		
		for(var k = thetas.length-1; k>=0; k--){
			if(thetas[k]>endTheta){
				endTheta = thetas[k];
				endIndex = k;
			}
		}
	}
	
	if(endIndex==-1 || startIndex==-1 || startIndex==endIndex)
		return;
	
	if(keep){
		var rva = new Arc();
		
		rva.c = scene.circleC[multisnap.index];
		
		//AddPoint(scene.circleIntX[startIndex], scene.circleIntY[startIndex]);
		//AddPoint(scene.circleIntX[endIndex], scene.circleIntY[endIndex]);
		
		AddPoint(scene.points[scene.circleC[multisnap.index]].x + scene.circleR[multisnap.index] * Math.cos(startTheta),
			 scene.points[scene.circleC[multisnap.index]].y + scene.circleR[multisnap.index] * Math.sin(startTheta));
		
		AddPoint(scene.points[scene.circleC[multisnap.index]].x + scene.circleR[multisnap.index] * Math.cos(endTheta),
			 scene.points[scene.circleC[multisnap.index]].y + scene.circleR[multisnap.index] * Math.sin(endTheta));
		
		rva.aIdx = scene.points.length-2;
		rva.bIdx = scene.points.length-1;
		
		if(endTheta>startTheta)
			endTheta-=2*pi;
		
		rva.a=startTheta;
		rva.b=endTheta;
		
		rva.r = scene.circleR[multisnap.index];
		
		NukeCircle(index);
		
		AddArc(rva);
	}
	else{
		var rva = new Arc();
		
		rva.c = scene.circleC[multisnap.index];
		
		AddPoint(scene.points[scene.circleC[multisnap.index]].x + scene.circleR[multisnap.index] * Math.cos(startTheta),
			 scene.points[scene.circleC[multisnap.index]].y + scene.circleR[multisnap.index] * Math.sin(startTheta));
		
		AddPoint(scene.points[scene.circleC[multisnap.index]].x + scene.circleR[multisnap.index] * Math.cos(endTheta),
			 scene.points[scene.circleC[multisnap.index]].y + scene.circleR[multisnap.index] * Math.sin(endTheta));
		
		rva.aIdx = scene.points.length-2;
		rva.bIdx = scene.points.length-1;
		
		if(endTheta<startTheta)
			startTheta-=2*pi;
		
		rva.b=startTheta;
		rva.a=endTheta;
		
		rva.r = scene.circleR[multisnap.index];
		
		NukeCircle(index);
		
		AddArc(rva);
	}
}

function TrimArc(multisnap, keep){
	if(multisnap.type!='arc')
		return;
	
	var index=multisnap.index;
	
	var thetas = new Array(), thetaIn=FindAngle(scene.points[scene.arcs[index].c].x, 
				    scene.points[scene.arcs[index].c].y,
				    multisnap.x, multisnap.y);
	
	
	for(var q = scene.circleArcIntCircleIdx.length-1; q>=0; q--){
		if(scene.circleArcIntArcIdx[q]==index)
			thetas.push(FindAngle(scene.points[scene.arcs[index].c].x, 
				    scene.points[scene.arcs[index].c].y, 
					scene.circleArcIntX[q], scene.circleArcIntY[q]));
	}
	
	for(var q = scene.points.length-1; q>=0; q--){
		if(RoundNumber(Distance(scene.points[q].x, scene.points[q].y, 
			scene.points[scene.arcs[index].c].x, scene.points[scene.arcs[index].c].y), 10)==RoundNumber(scene.arcs[index].r, 10) &&
				IsAngleOnArc(FindAngle(scene.points[q].x, scene.points[q].y, 
			scene.points[scene.arcs[index].c].x, scene.points[scene.arcs[index].c].y), index)){
				thetas.push(FindAngle(scene.points[scene.arcs[index].c].x, scene.points[scene.arcs[index].c].y, scene.points[q].x, scene.points[q].y));
		}
	}
	
	for(var q = scene.arcLineInts.length-1; q>=0; q--){
		if(scene.arcLineInts[q].indexA==multisnap.index){
			thetas.push(FindAngle(scene.points[scene.arcs[index].c].x, scene.points[scene.arcs[index].c].y, 
				scene.arcLineInts[q].x, scene.arcLineInts[q].y));
		}
	}
	
	thetas.push(scene.arcs[index].a);
	thetas.push(scene.arcs[index].b);
	
	var endTheta = pi*-2, startTheta = 0, endIndex = -1, startIndex = -1;
	
	for(var q = thetas.length-1; q>=0; q--){
		if(thetas[q] > endTheta && thetas[q] < thetaIn){
			endTheta = thetas[q];
			endIndex=q;
		}
		
		if(thetas[q] < startTheta && thetas[q] > thetaIn){
			startTheta = thetas[q];
			startIndex=q;
		}
	}
	
	if(startIndex==-1){
		startTheta = 0;
		
		for(var k = thetas.length-1; k>=0; k--){
			if(thetas[k]<startTheta){
				startTheta = thetas[k];
				startIndex=k;
			}
		}
	}
	
	if(endIndex==-1){
		endTheta = pi*-2;
		
		for(var k = thetas.length-1; k>=0; k--){
			if(thetas[k]>endTheta){
				endTheta = thetas[k];
				endIndex = k;
			}
		}
	}
	
	if(endIndex==-1 || startIndex==-1 || startIndex==endIndex)
		return;
	
	if(keep){
		var rva = new Arc();
		
		rva.c = scene.arcs[multisnap.index].c;
		
		AddPoint(scene.points[scene.arcs[multisnap.index].c].x + scene.arcs[multisnap.index].r * Math.cos(startTheta),
			 scene.points[scene.arcs[multisnap.index].c].y + scene.arcs[multisnap.index].r * Math.sin(startTheta));
		
		AddPoint(scene.points[scene.arcs[multisnap.index].c].x + scene.arcs[multisnap.index].r * Math.cos(endTheta),
			 scene.points[scene.arcs[multisnap.index].c].y + scene.arcs[multisnap.index].r * Math.sin(endTheta));
		
		rva.aIdx = scene.points.length-2;
		rva.bIdx = scene.points.length-1;
		
		if(endTheta>startTheta)
			endTheta-=2*pi;
		
		rva.a=startTheta;
		rva.b=endTheta;
		
		rva.r = scene.arcs[multisnap.index].r;
		
		NukeArc(index);
		
		AddArc(rva);
	}
	else{
		var rva = new Arc();
		
		rva.c = scene.arcs[multisnap.index].c;
		
		AddPoint(scene.points[scene.arcs[multisnap.index].c].x + scene.arcs[multisnap.index].r * Math.cos(startTheta),
			 scene.points[scene.arcs[multisnap.index].c].y + scene.arcs[multisnap.index].r * Math.sin(startTheta));
		
		AddPoint(scene.points[scene.arcs[multisnap.index].c].x + scene.arcs[multisnap.index].r * Math.cos(endTheta),
			 scene.points[scene.arcs[multisnap.index].c].y + scene.arcs[multisnap.index].r * Math.sin(endTheta));
		
		rva.aIdx = scene.points.length-2;
		rva.bIdx = scene.points.length-1;
		
		if(endTheta>startTheta)
			endTheta-=2*pi;
		
		rva.b=scene.arcs[index].b;
		rva.a=endTheta;
		rva.bIdx=scene.arcs[index].bIdx;
		rva.aIdx=scene.points.length-1;
		
		rva.r = scene.arcs[multisnap.index].r;
		
		AddArc(rva);
		
		var rvb = new Arc();
		
		rvb.c = rva.c;
		rvb.r = rva.r;
		
		rvb.a = scene.arcs[index].a;
		rvb.b = startTheta;
		rvb.aIdx = scene.arcs[index].aIdx;
		rvb.bIdx = scene.points.length-2;
		AddArc(rvb);
		NukeArc(index);
	}
	
	ClearUnusedPoints();
}

function TrimLine(multiSnap, keep){
	if(multiSnap.type!='line')
		return;
	
	var line = scene.lines[multiSnap.index];
	
	var points = new Array(), pointIndices = new Array();
	
	var minEndpoint = new Point(), maxEndpoint = new Point();
	
	var minIndex = -1, maxIndex = -1;
	
	var a = false;  //line a to b is neg to pos
	
	for(var q = scene.points.length-1; q>=0; q--){
		if(line.PointDistance(new Point(scene.points[q].x, scene.points[q].y), 5)==0 && 
			line.pointA != q && line.pointB != q){
			points.push(new Point(scene.points[q].x, scene.points[q].y));
			pointIndices.push(q);
		}
	}
	
	for(var q = scene.lineInts.length-1; q>=0; q--){
		if(scene.lineInts[q].indexA==multiSnap.index || scene.lineInts[q].indexB==multiSnap.index)
			points.push(new Point(scene.lineInts[q].x, scene.lineInts[q].y));
	}
	
	for(var q = scene.circleLineInt.length-1; q>=0; q--){
		if(scene.circleLineInt[q].indexB==multiSnap.index)
			points.push(new Point(scene.circleLineInt[q].x, scene.circleLineInt[q].y));
	}
	
	for(var q = scene.arcLineInts.length-1; q>=0; q--){
		if(scene.arcLineInts[q].indexB==multiSnap.index)
			points.push(new Point(scene.arcLineInts[q].x, scene.arcLineInts[q].y));
	}
	
	if(line.type=='ray')
		points.push(scene.points[line.pointA]);
	
	if(scene.lines[multiSnap.index].b==0){
		if(line.type=='segment'){
			if(scene.points[line.pointA].y<scene.points[line.pointB].y){
				minEndpoint.x = scene.points[line.pointA].x;
				minEndpoint.y = scene.points[line.pointA].y;
				maxEndpoint.x = scene.points[line.pointB].x;
				maxEndpoint.y = scene.points[line.pointB].y;
				a=true;
			}else{
				minEndpoint.x = scene.points[line.pointB].x;
				minEndpoint.y = scene.points[line.pointB].y;
				maxEndpoint.x = scene.points[line.pointA].x;
				maxEndpoint.y = scene.points[line.pointA].y;
			}
			
			points.push(minEndpoint);
			points.push(maxEndpoint);
			
			minIndex=points.length-2; maxIndex=points.length-1;
		}
		
		for(var q = points.length-1; q>=0; q--){
			if(minIndex>=0 && points[q].y > points[minIndex].y && points[q].y < multiSnap.y)
				minIndex=q;
			else if(maxIndex>=0 && points[q].y < points[maxIndex].y && points[q].y > multiSnap.y)
				maxIndex=q;
			if(minIndex<0 && points[q].y<multiSnap.y)
				minIndex=q;
			if(maxIndex<0 && points[q].y>multiSnap.y)
				maxIndex=q;
		}
	}else{
		if(line.type=='segment'){
			if(scene.points[line.pointA].x<scene.points[line.pointB].x){
				minEndpoint.x = scene.points[line.pointA].x;
				minEndpoint.y = scene.points[line.pointA].y;
				maxEndpoint.x = scene.points[line.pointB].x;
				maxEndpoint.y = scene.points[line.pointB].y;
				a=true;
			}else{
				minEndpoint.x = scene.points[line.pointB].x;
				minEndpoint.y = scene.points[line.pointB].y;
				maxEndpoint.x = scene.points[line.pointA].x;
				maxEndpoint.y = scene.points[line.pointA].y;
			}
			
			points.push(minEndpoint);
			points.push(maxEndpoint);
			
			minIndex=points.length-2; maxIndex=points.length-1;
		}
		
		for(var q = points.length-1; q>=0; q--){
			if(minIndex>=0 && points[q].x > points[minIndex].x && points[q].x < multiSnap.x)
				minIndex=q;
			else if(maxIndex>=0 && points[q].x < points[maxIndex].x && points[q].x > multiSnap.x)
				maxIndex=q;
			if(minIndex<0 && points[q].x<multiSnap.x)
				minIndex=q;
			if(maxIndex<0 && points[q].x>multiSnap.x)
				maxIndex=q;
		}
	}
	
	if(keep){
		NukeLineByIndex(multiSnap.index);
		var k1 = scene.points.length;
		
		if(minIndex==points.length-2){
			if(line.type=='infinite')
				AddPoint(points[minIndex].x, points[minIndex].y);
			else{
				k1=line.pointB;
				
				if(a)
					k1=line.pointA;
			}
		}
		else if(minIndex>=0)
			AddPoint(points[minIndex].x, points[minIndex].y);
		
		var k2 = scene.points.length;
		
		if(maxIndex==points.length-1){
			if(line.type=='infinite')
				AddPoint(points[maxIndex].x, points[maxIndex].y);
			else{
				k2=line.pointA;
				
				if(a)
					k2=line.pointB;
			}
		}
		else if(maxIndex!=-1)
			AddPoint(points[maxIndex].x, points[maxIndex].y);
		
		if(minIndex != -1 && maxIndex != -1)
			AddLine(k1, k2);
		else{
			if(maxIndex==-1){
				if(line.b!=0)
					AddRay(points[minIndex], 
						new Point(points[minIndex].x+1, points[minIndex].y - line.a/line.b), false);
				else
					AddRay(points[minIndex], new Point(points[minIndex].x, points[minIndex].y-1), true);
			}
			else if(minIndex==-1){
				console.log("hi");
				if(line.b!=0)
					AddRay(points[maxIndex], 
						new Point(points[maxIndex].x+1, points[maxIndex].y - line.a/line.b), true);
				else
					AddRay(points[maxIndex], new Point(points[maxIndex].x, points[maxIndex].y-1), false);
			}
		}
	}else{
		NukeLineByIndex(multiSnap.index);
		
		if(line.type=='segment' && minIndex!=points.length-2){
			var k = scene.points.length;
			if(minIndex<pointIndices.length)
				k = pointIndices[minIndex];
			else
				AddPoint(points[minIndex].x, points[minIndex].y);
			
			if(a)
				AddLine(line.pointA, k);
			else
				AddLine(line.pointB, k);
		}
		
		if(line.type=='segment' && maxIndex!=points.length-1){
			var k = scene.points.length;
			
			if(maxIndex<pointIndices.length)
				k = pointIndices[maxIndex];
			else
				AddPoint(points[maxIndex].x, points[maxIndex].y);
			
			if(a)
				AddLine(line.pointB, k);
			else
				AddLine(line.pointA, k);
		}
		
		if(line.type=='infinite'){
			
		}
	}
	
	ClearPointIfUnused(line.pointB);
	ClearPointIfUnused(line.pointA);
}
