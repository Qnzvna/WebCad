function Arc()
{
  /**
   * cięciwa opisująca łuk
   */
  this.chord = -1;

  /**
   * strzałka łuku
   */
  this.arrow = -1;

  this.centerPoint = -1;

  this.Radius = function( )
  {
    var r =  ( Math.pow( this.chord.Length() / 2, 2 ) + Math.pow( this.arrow, 2 ) ) / 2 * this.arrow;
    return r;
  };

  this.Alfa = function( t )
  {
    var alfa = -4 * Math.atan( t / (this.chord.Length() / 2 - 1) );

    return alfa;
  };

  this.calcCenterPoint = function()
  {
    var arrowPoint = new Point();

    var d = this.Radius() - this.arrow;
    console.log(this.arrow);

    var A = this.chord.pointA.y - this.chord.pointB.y;
    var B = this.chord.pointB.x - this.chord.pointA.x;
    var C = this.chord.pointA.x * this.chord.pointB.y - this.chord.pointA.y * this.chord.pointB.x;

    arrowPoint.x =  ( C * ( -A / B ) + B * this.chord.centerPoint().x - ( A / B ) * d *
    Math.sqrt( Math.pow( A, 2 ) + Math.pow( B, 2 ) ) - A * this.chord.centerPoint().y ) /
    ( B + ( Math.pow( A , 2 ) / B ) );

    arrowPoint.y = ( B / A ) * arrowPoint.x + this.chord.centerPoint().y - ( B / A ) * this.chord.centerPoint().x;

    this.centerPoint = arrowPoint;
  };


  this.Draw = function( context )
  {
    if (this.chord != -1)
      this.chord.Draw(context);

    if (this.arrow != -1 && this.Radius() > this.arrow)
    {
      context.beginPath();
      //console.log(this.centerPoint);
      this.centerPoint.Draw( context );
      context.arc(this.centerPoint.x, this.centerPoint.y, this.Radius(), 0, 2 * Math.PI);
      context.stroke();
    }
  };
}
