var camX = 0;
var camY = 0;

var zoom = 1;

function Zoom(zoomFactor){
	zoom*=zoomFactor;
	/*camX-=zoomFactor;
	camY-=zoomFactor;*/
}

var camMoving = false;

var xCNaught = 0, yCNaught = 0;