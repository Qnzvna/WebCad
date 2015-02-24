function calcArea()
{
  mode.Do = function ( e )
  {
    var point = new Point();
    var pos = getMousePos(canvas, e);
    point.x = pos.x;
    point.y = pos.y;
    point.Draw( context );
    for ( var i = 0; i < objects.length; i++ )
    {
      if ( objects[i] instanceof Polygon && objects[i].CheckPoint( point ))
      {
        console.log( objects[i].Area() );
      } else if ( objects[i] instanceof Circle && objects[i].CheckPoint( point ))
      {
        console.log( objects[i].Area() );
      }
    }

  };
}
