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
  for ( i = 0; i < objects.length; i++ )
  {
    // points
    if( objects[i] instanceof Point)
    {
      if ( Math.abs( pos.x - objects[i].x ) < 5)
      {
        point.x = objects[i].x;
      }

      if ( Math.abs( pos.y - objects[i].y ) < 5)
      {
        point.y = objects[i].y;
      }
    } else if( objects[i] instanceof Line) // linie
    {
      if ( Math.abs( pos.x - objects[i].pointA.x ) < 5)
      {
        point.x = objects[i].pointA.x;
      }

      if ( Math.abs( pos.y - objects[i].pointB.y ) < 5)
      {
        point.y = objects[i].pointB.y;
      }

      if ( Math.abs( pos.x - objects[i].pointA.x ) < 5)
      {
        point.x = objects[i].pointA.x;
      }

      if ( Math.abs( pos.y - objects[i].pointB.y ) < 5)
      {
        point.y = objects[i].pointB.y;
      }
    } else if( objects[i] instanceof Polygon) // polygony
    {
      for( var j = 0; j < objects[i].lines; i++ )
      {
        var line = objects[i].lines[j];
        if ( Math.abs( pos.x - line.pointA.x ) < 5)
        {
          point.x = line.pointA.x;
        }

        if ( Math.abs( pos.y - line.pointB.y ) < 5)
        {
          point.y = line.pointB.y;
        }

        if ( Math.abs( pos.x - line.pointA.x ) < 5)
        {
          point.x = line.pointA.x;
        }

        if ( Math.abs( pos.y - line.pointB.y ) < 5)
        {
          point.y = line.pointB.y;
        }
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
