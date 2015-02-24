function Polygon()
{
  this.lines = [];
}

Polygon.prototype.Add = function( line )
{
  this.lines.push(line);
};

Polygon.prototype.Remove = function( line )
{
  var index = this.lines.indexOf( line );
  this.lines.splice( index, 1 );
};

Polygon.prototype.IsClosed = function()
{
  var startPoint = this.lines[0].pointA;
  var endPoint = this.lines[this.lines.length - 1].pointB;
  if ( startPoint.x == endPoint.x && startPoint.y == endPoint.y)
  {
    return true;
  } else
  {
    return false;
  }
};

Polygon.prototype.CheckPoint = function( point )
{
  var nvert = this.lines.length;
  var j = nvert - 1;
  var inside = false;
  for( var i = 0; i < nvert; j = i++)
  {
    if ( ( ( this.lines[i].pointA.y > point.y ) != (this.lines[j].pointA.y >
      point.y) ) && ( point.x < ( this.lines[j].pointA.x - this.lines[i].pointA.x ) *
    ( point.y - this.lines[i].pointA.y ) / ( this.lines[j].pointA.y -
      this.lines[i].pointA.y ) + this.lines[i].pointA.x ) )
    {
      inside = !inside;
    }
  }
  return inside;
};

Polygon.prototype.Draw = function( context )
{
  for( var i = 0; i < this.lines.length; i++ )
  {
    this.lines[i].Draw( context );
  }
};

Polygon.prototype.Area = function()
{
  if ( this.IsClosed() )
  {
    var area = 0;
    for ( var i = 0; i < this.lines.length; i++ )
    {
      area = area + ( this.lines[i].pointA.x * this.lines[i].pointB.y -
      this.lines[i].pointB.x * this.lines[i].pointA.y );
    }
    return Math.abs( area / 2 );
  } else
  {
    return 0;
  }
};
