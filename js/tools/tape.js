function tape()
{
  mode.code = 1;
  var line = new Line();

  canvas.onmousemove = snaPoint;

  mode.Do = function( e )
  {
    if ( mode.code == 1 )
    {
      var pointA = new Point();
      var pos = getMousePos(canvas, e);
      pointA.x = pos.x;
      pointA.y = pos.y;

      snap( pointA, e);

      points.push(pointA);

      line.pointA = pointA;
      pointA.Draw( context );

      canvas.onmousemove = function(e) {
        pos = getMousePos(canvas, e);
        var pointB = new Point();
        pointB.x = pos.x;
        pointB.y = pos.y;

        snap( pointB, e );

        line.pointB = pointB;

        canvasRedraw( line );
        axis( e );
      };

      document.onkeydown = function(e) {
        if ( e.keyCode == 80 )
        {
          var point = new Point();
          point.x = pos.x;
          point.y = pos.y;

          snap( point, e );

          points.push( point );
          objects.push( point );
        }
      };

      mode.code = 2;
    }else if ( mode.code == 2)
    {
      canvas.onmousemove = snaPoint;

      points.pop();
      line = new Line();
      mode.code = 1;
      canvasRedraw( null );
    }
  };
}
