function Grid()
{
  this.density = -1;

  this.xes = [];

  this.yes = [];

  this.color = "#888888";

  this.width = 0.5;

}

Grid.prototype.Draw = function( context ) {
  if ( this.density != -1 )
  {
    this.xes = [];
    var num = Math.ceil( canvas.width / scale / this.density ) + 1;
    for ( var x = 1; x < num; x++ )
    {
      context.moveTo(x * this.density, 0);
      context.lineTo(x * this.density, canvas.height / scale );
      this.xes.push( x * this.density );
    }

    this.yes = [];
    num = Math.ceil( canvas.height / scale / this.density ) + 1;
    for ( var y = 1; y < num; y++ )
    {
      context.moveTo(0, y * this.density);
      context.lineTo(canvas.width / scale, y * this.density);
      this.yes.push( y * this.density );
    }

    context.strokeStyle = this.color;
    //var oldWidth = context.lineWidth;
    //context.lineWidth = this.width;
    context.stroke();
    //context.lineWidth = oldWidth;
    context.strokeStyle = "#000000";
  }
};
