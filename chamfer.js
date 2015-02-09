function Chamfer_Line_Raw(line, XX, aDX, multisnap){
	alpha = new Line(line);
	
	if(alpha.type=='segment'){
		var connLineA = 0;
		
		if(Distance(XX.x, XX.y, scene.points[alpha.pointA].x, scene.points[alpha.pointA].y) < 
		Distance(multisnap.x, multisnap.y, scene.points[alpha.pointA].x, scene.points[alpha.pointA].y)){
			alpha.pointA = scene.points.length;
			connLineA = alpha.pointA;
			scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
			AddLine(alpha.pointA, alpha.pointB);
		}else{
			alpha.pointB = scene.points.length;
			connLineA = alpha.pointB;
			scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
			AddLine(alpha.pointA, alpha.pointB);
		}
		
		return connLineA;
	}else if(alpha.type=='infinite'){
		alpha.pointA = scene.points.length;
		scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
		console.log(alpha.pointA, XX);
		AddRay(scene.points[alpha.pointA], XX, true);
		return scene.points.length-1;
	}else if(alpha.type=='ray'){
		if(Distance(XX.x, XX.y, scene.points[alpha.pointA].x, scene.points[alpha.pointA].y) < 
		Distance(multisnap.x, multisnap.y, scene.points[alpha.pointA].x, scene.points[alpha.pointA].y)){
			alpha.pointA = scene.points.length;
			connLineA = alpha.pointA;
			scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
			AddRay(scene.points[alpha.pointA], XX, true);
		}else{
			alpha.pointB = scene.points.length;
			connLineA = alpha.pointB;
			scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
			AddLine(alpha.pointA, alpha.pointB);
		}
		
		return connLineA;
	}
}

function Chamfer(multisnapA, multisnapB, dA, dB){
	var ena = scene.lines[multisnapA.index].pointA,
		enb = scene.lines[multisnapA.index].pointB,
		enc = scene.lines[multisnapB.index].pointA,
		end = scene.lines[multisnapB.index].pointB;
	
	if(multisnapA.type=='point'){
	}else if(multisnapA.type=='line' && multisnapB.type=='line'){
		var alpha = new Line(scene.lines[multisnapA.index]), beta = new Line(scene.lines[multisnapB.index]);
		
		alpha.type='infinite';
		beta.type='infinite';
		
		var XX = alpha.IntersectWithLine(beta);
		
		var aDX = new Point((multisnapA.x - XX.x), multisnapA.y - XX.y);
		aDX.Normalize();
		aDX.x *= dA; aDX.y *= dA;
		
		var bDX = new Point((multisnapB.x - XX.x), multisnapB.y - XX.y);
		
		bDX.Normalize();
		bDX.x *= dB; bDX.y *= dB;
		
		alpha.type=scene.lines[multisnapA.index].type;
		beta.type=scene.lines[multisnapB.index].type;
		
		var nLA = new Line(scene.lines[multisnapA.index]), nLB = new Line(scene.lines[multisnapB.index]);
		
		var connLineA = -1, connLineB = -1;
		
		connLineA = Chamfer_Line_Raw(nLA, XX, aDX, multisnapA);
		connLineB = Chamfer_Line_Raw(nLB, XX, bDX, multisnapB);
		
		/*if(alpha.type=='segment'){
			if(Distance(XX.x, XX.y, scene.points[alpha.pointA].x, scene.points[alpha.pointA].y) < 
			Distance(multisnapA.x, multisnapA.y, scene.points[alpha.pointA].x, scene.points[alpha.pointA].y)){
				nLA.pointA = scene.points.length;
				connLineA = nLA.pointA;
				scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
				AddLine(nLA.pointA, nLA.pointB);
			}else{
				nLA.pointB = scene.points.length;
				connLineA = nLA.pointB;
				scene.points.push(new Point(XX.x + aDX.x, XX.y + aDX.y));
				AddLine(nLA.pointA, nLA.pointB);
			}
		}
		
		if(beta.type=='segment'){
			if(Distance(XX.x, XX.y, scene.points[beta.pointA].x, scene.points[beta.pointA].y) < 
			Distance(multisnapB.x, multisnapB.y, scene.points[beta.pointA].x, scene.points[beta.pointA].y)){
				nLB.pointA = scene.points.length;
				connLineB = nLB.pointA;
				scene.points.push(new Point(XX.x + bDX.x, XX.y + bDX.y));
				AddLine(nLB.pointA, nLB.pointB);
			}else{
				nLB.pointB = scene.points.length;
				connLineB = nLB.pointB;
				scene.points.push(new Point(XX.x + bDX.x, XX.y + bDX.y));
				AddLine(nLB.pointA, nLB.pointB);
			}
		}*/
		
		if(multisnapA.index>multisnapB.index){
			NukeLineByIndex(multisnapA.index);
			NukeLineByIndex(multisnapB.index);
		}else{
			NukeLineByIndex(multisnapB.index);
			NukeLineByIndex(multisnapA.index);
		}
		
		AddLine(connLineA, connLineB);
		
		var pau = ClearPointIfUnused(ena);
		
		if(!pau){
			if(enb>ena)
				enb--;
			if(enc>ena)
				enc--;
			if(end>ena)
				end--;
		}
		var pbu = ClearPointIfUnused(enb);
		if(!pbu){
			if(enc>enb)
				enc--;
			if(end>enb)
				end--;
		}
		var pcu = ClearPointIfUnused(enc);
		if(!pcu){
			if(end>enc)
				end--;
		}
		ClearPointIfUnused(end);
	}
}