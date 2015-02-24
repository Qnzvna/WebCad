function Line()
{
  this.pointA = -1;
  this.pointB = -1;
}

Line.prototype.Length = function()
{
  var length = Math.sqrt(Math.pow(this.pointA.x - this.pointB.x, 2) + Math.pow(this.pointA.y - this.pointB.y, 2));
  return length;
};

Line.prototype.centerPoint = function()
{
  var s = new Point();
  s.x = ( this.pointA.x + this.pointB.x ) / 2;
  s.y = ( this.pointA.y + this.pointB.y ) / 2;
  return s;
};

Line.prototype.Draw = function( context )
{
  if (this.pointA != -1 && this.pointB != -1)
  {
    this.pointA.Draw(context);
    this.pointB.Draw(context);
    context.beginPath();
    context.moveTo(this.pointA.x, this.pointA.y);
    context.lineTo(this.pointB.x, this.pointB.y);
    context.stroke();
    var dim = new DimensionText();
    dim.point = this.centerPoint();
    dim.text = Math.round( this.Length() * 1000) / 1000;
    dim.Draw(context);
  }
};
