function snap( point, e )
{

  // grid
  var pos = getMousePos(canvas, e);
  //console.log(objects[0].xes);
  for ( var i = 0; i < objects[0].xes.length; i++ )
  {
    if ( Math.abs( pos.x - objects[0].xes[i] ) < 5)
    {
      point.x = objects[0].xes[i];
    }
  }

  for ( i = 0; i < objects[0].yes.length; i++ )
  {
    if ( Math.abs( pos.y - objects[0].yes[i] ) < 5)
    {
      point.y = objects[0].yes[i];
    }
  }

  // elements
  for ( i = 0; i < points.length; i++ )
  {
    // points
    if ( axisOn )
    {
      if ( Math.abs( pos.x - points[i].x ) < 5)
      {
        point.x = points[i].x;
      }

      if ( Math.abs( pos.y - points[i].y ) < 5)
      {
        point.y = points[i].y;
      }
    } else
    {
      if ( Math.abs( pos.x - points[i].x ) < 5 && Math.abs( pos.y - points[i].y ) < 5)
      {
        point.x = points[i].x;
        point.y = points[i].y;
      }
    }
  }
}

function snaPoint(e) {
  var point = new Point();
  var pos = getMousePos(canvas, e);
  point.x = pos.x;
  point.y = pos.y;
  snap( point, e);
  point.Draw( context );
  axis( e );
  canvasRedraw( null );
}
