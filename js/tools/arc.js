function setArc()
{
  mode.code = 1;
  var arc = new Arc();
  var chord = new Line();
  var arrow = 0;

  mode.Do = function( e )
  {
    if ( mode.code == 1 )
    {
      var pointA = modePoint( canvas, e);
      chord.pointA = pointA;
      canvasRedraw(pointA);
      canvas.onmousemove = function( e )
      {
        var pointB = modePoint( canvas, e );
        chord.pointB = pointB;
        canvasRedraw(chord);
      };
      arc.chord = chord;
      mode.code = 2;
    } else if ( mode.code == 2 )
    {
      var helpPoint = new Point();
      canvas.onmousemove = function( e )
      {
        helpPoint = modePoint( canvas, e );
        var t = 0; // dlugosc strzalki
        var centerPoint = chord.centerPoint();

        var A = chord.pointA.y - chord.pointB.y;
        var B = chord.pointB.x - chord.pointA.x;
        var C = chord.pointA.x * chord.pointB.y - chord.pointA.y * chord.pointB.x;
        t = ( A * helpPoint.x + B * helpPoint.y + C ) / Math.sqrt( Math.pow( A, 2 ) + Math.pow ( B, 2 ) );

        //console.log(arc.chord);
        arrow = Math.abs( t );
        arc.arrow = arrow;
        arc.calcCenterPoint();

        canvasRedraw(arc);
      };
      mode.code = 3;
    } else if ( mode.code == 3)
    {
      canvas.onmousemove = function(){};
      mode.code = 1;
    }
  };
}
