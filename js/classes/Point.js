function Point(x, y)
{
  this.x = 0;
  this.y = 0;

  this.color = "white";
  this.radius = 4;

}

Point.prototype.Draw = function( context )
{
  context.beginPath();
  context.arc(this.x, this.y, this.radius / scale, 0, 2 * Math.PI, false);
  context.stroke();
  var dim = new DimensionText();
  dim.point = this;
  dim.text = "(" + this.x + "," + this.y + ")";
  dim.Draw(context);
};
