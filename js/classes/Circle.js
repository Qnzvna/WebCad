function Circle()
{
  /**
   * punkt opisujący srodek kola
   */
  this.pointS = -1;

  /**
   * punkt opisujący promień koła
   */
  this.pointR = -1;

}

Circle.prototype.Radius = function( context )
{
  var r = Math.sqrt(Math.pow(this.pointS.x - this.pointR.x, 2) + Math.pow(this.pointS.y - this.pointR.y, 2));
  return r;
};

Circle.prototype.Draw = function( context )
{
  if (this.pointS != -1)
    this.pointS.Draw(context);

  if (this.pointS != -1 && this.pointR != -1)
  {
    context.beginPath();
    context.arc(this.pointS.x, this.pointS.y, this.Radius(), 0, 2 * Math.PI);
    context.stroke();
    var dim = new DimensionText();
    dim.point = this.pointS;
    dim.offset.x = 20;
    dim.text = Math.round( this.Radius() * 1000 ) / 1000;
    dim.Draw(context);
  }
};
