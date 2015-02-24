function castGrid( object )
{
  var new_grid = new Grid();
  new_grid.density = object.density;
  new_grid.xes = object.xes;
  new_grid.yes = object.yes;
  new_grid.color = object.color;
  new_grid.width = object.width;
  return new_grid;
}

function castPoint( object )
{
  var point = new Point();
  point.x = object.x;
  point.y = object.y;
  point.color = object.color;
  point.radius = object.radius;
  return point;
}

function castLine( object )
{
  var line = new Line();
  line.pointA = castPoint( object.pointA );
  line.pointB = castPoint( object.pointB );
  return line;
}

function castCircle( object )
{
  var circle = new Circle();
  circle.pointS = castPoint( object.pointS );
  circle.pointR = castPoint( object.pointR );
  return circle;
}

function castPoly( object )
{
  var poly = new Polygon();
  for ( var i = 0; i < object.lines.length; i++ )
  {
    poly.lines.push( castLine( object.lines[i] ) );
  }
  return poly;
}

function deserialize( object )
{
  if ( object instanceof Grid )
  {
    return castGrid( object );
  } else if ( object instanceof Point )
  {
    return castPoint( object );
  } else if ( object instanceof Line )
  {
    return castLine( object );
  } else if ( object instanceof Circle )
  {
    return castCircle( object );
  } else if ( object instanceof Polygon )
  {
    return castPoly( object );
  }
}
