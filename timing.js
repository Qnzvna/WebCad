function Timer()
{
	var startTime = new Date().getTime();
	var offset = 0;	
	var paused = false;
	
	this.GetElapsedTime = function(){
		if(paused)
			return offset;
		return  new Date().getTime() - startTime + offset;
	}
	
	this.Pause = function(){
		offset = GetElapsedTime();
		paused = true;
	}
	
	this.Resume = function(){
		paused = false;
		startTime = new Date().getTime();
	}
	
	this.Reset = function(){
		startTime = new Date().getTime();
		offset = 0;
	}
	
	this.DrawElapsedTime = function(){
		context.fillStyle = "black"
		context.strokeStyle = "yellow";
		
		context.font = "16px sans-serif";
		context.textAlign = "left";
		var t = this.GetElapsedTime();
		context.fillText(t, 5, 16);
		context.strokeText(t, 5, 16);
	}
}