function Grid()
{
  this.density = -1;

  this.xes = [];

  this.yes = [];

  this.color = "#000000";

  this.width = 0.5;

  // this.Draw = function ( context )
  // {
  //   if ( this.density != -1 )
  //   {
  //     this.xes = [];
  //     var num = Math.ceil( canvas.width / this.density ) + 1;
  //     for ( var x = 1; x < num; x++ )
  //     {
  //       context.moveTo(x * this.density, 0);
  //       context.lineTo(x * this.density, canvas.height);
  //       this.xes.push( x * this.density );
  //     }
  //
  //     this.yes = [];
  //     num = Math.ceil( canvas.height / this.density ) + 1;
  //     for ( var y = 1; y < num; y++ )
  //     {
  //       context.moveTo(0, y * this.density);
  //       context.lineTo(canvas.width, y * this.density);
  //       this.yes.push( y * this.density );
  //     }
  //
  //     //context.strokeStyle = this.color;
  //     var oldWidth = context.lineWidth;
  //     context.lineWidth = this.width;
  //     context.stroke();
  //     context.lineWidth = oldWidth;
  //   }
  // };
}

Grid.prototype.Draw = function( context ) {
  if ( this.density != -1 )
  {
    this.xes = [];
    var num = Math.ceil( canvas.width / this.density ) + 1;
    for ( var x = 1; x < num; x++ )
    {
      context.moveTo(x * this.density, 0);
      context.lineTo(x * this.density, canvas.height);
      this.xes.push( x * this.density );
    }

    this.yes = [];
    num = Math.ceil( canvas.height / this.density ) + 1;
    for ( var y = 1; y < num; y++ )
    {
      context.moveTo(0, y * this.density);
      context.lineTo(canvas.width, y * this.density);
      this.yes.push( y * this.density );
    }

    //context.strokeStyle = this.color;
    var oldWidth = context.lineWidth;
    context.lineWidth = this.width;
    context.stroke();
    context.lineWidth = oldWidth;
  }
};
