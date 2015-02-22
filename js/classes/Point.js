function Point(x, y)
{
  this.x = 0;
  this.y = 0;

  this.color = "white";
  this.radius = 4;

  // this.Length = function()
  // {
  //   return Math.sqrt(this.x * this.x + this.y * this.y);
  // };
  //
  // this.Normalize = function()
  // {
  //   var l = this.Length();
  //   this.x /= l;
  //   this.y /= l;
  // };
  //
  // this.Draw = function(context)
  // {
  //   context.beginPath();
  //   context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  //   context.stroke();
  //   //var dim = new DimensionText();
  //   //dim.point = this;
  //   //dim.text = "(" + this.x + "," + this.y + ")";
  //   //dim.offset.y = -13;
  //   //dim.offset.x = 33;
  //   //dim.Draw(context);
  // };
}

// Point.prototype.Length = function()
// {
//   return Math.sqrt(this.x * this.x + this.y * this.y);
// };

Point.prototype.Draw = function( context )
{
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  context.stroke();
};
