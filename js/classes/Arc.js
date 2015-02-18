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
    var r =  - ( Math.pow( this.chord.Length() / 2, 2 ) - Math.pow( Math.abs( this.arrow ), 2 ) ) / 2 * this.arrow;
    return r;
  };

  this.Alfa = function( t )
  {
    var alfa = -4 * Math.atan( t / (c - 1) );

    return alfa;
  };

  this.calcCenterPoint = function( a, b )
  {
    var arrowPoint = new Point();
    var chordPoint = this.chord.centerPoint();
    var l = this.Radius() - this.arrow;

    arrowPoint.x =  Math.abs( ( chordPoint.x - a * b + Math.sqrt( Math.pow( a, 2 ) * Math.pow( l, 2 ) -
    Math.pow( a, 2 ) * Math.pow( chordPoint.x, 2 ) - 2 * a * b * chordPoint.x +
    2 * a * chordPoint.x * chordPoint.y - Math.pow( b, 2 ) + 2 * b * Math.pow( chordPoint.y, 2 ) +
    Math.pow( l, 2 ) - Math.pow( chordPoint.y, 2 ) ) + a * chordPoint.y ) /
    ( Math.pow( chordPoint.y, 2 ) + 1 ) );

    arrowPoint.y = a * arrowPoint.x + b;

    this.centerPoint = arrowPoint;
  };


  this.Draw = function( context )
  {
    if (this.chord != -1)
      this.chord.Draw(context);

    if (this.arrow != -1)
    {
      context.beginPath();
      //console.log(this.centerPoint);
      context.arc(this.centerPoint.x, this.centerPoint.y, this.Radius(), 0, 2 * Math.PI);
      context.stroke();
    }
  };
}
