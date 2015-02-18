function modePoint( canvas, e )
{
  var point = new Point();
  var pos = getMousePos(canvas, e);
  point.x = pos.x;
  point.y = pos.y;

  return point;
}

function setPoint()
{
  mode.code = 1;

  mode.Do = function(e)
  {
    var point = new Point();
    var pos = getMousePos(canvas, e);
    point.x = pos.x;
    point.y = pos.y;
    point.Draw(context);
    objects.push(point);
  };
}

function setLine()
{
  mode.code = 1;
  var line = new Line();

  mode.Do = function(e)
  {
    if ( mode.code == 1 )
    {
      var pointA = new Point();
      var pos = getMousePos(canvas, e);
      pointA.x = pos.x;
      pointA.y = pos.y;

      line.pointA = pointA;
      pointA.Draw(context);

      canvas.onmousemove = function(e) {
        var pos = getMousePos(canvas, e);
        var pointB = new Point();
        pointB.x = pos.x;
        pointB.y = pos.y;

        line.pointB = pointB;
        $("#length").text(line.Length());

        canvasRedraw(line);
      };

      mode.code = 2;
    }else if ( mode.code == 2)
    {
      canvas.onmousemove = function(){};
      objects.push(line);
      line = new Line();
      mode.code = 1;
    }
  };
}

function setCircle()
{
  mode.code = 4;

  var circle = new Circle();

  mode.Do = function(e)
  {
    if ( mode.code == 4 )
    {
      var pointS = new Point();
      var pos = getMousePos(canvas, e);
      pointS.x = pos.x;
      pointS.y = pos.y;

      circle.pointS = pointS;
      pointS.Draw(context);

      canvas.onmousemove = function(e) {
        var pos = getMousePos(canvas, e);
        var pointR = new Point();
        pointR.x = pos.x;
        pointR.y = pos.y;

        circle.pointR = pointR;

        canvasRedraw(circle);
      };

      mode.code = 5;
    }else if ( mode.code == 5)
    {
      canvas.onmousemove = function(){};
      objects.push(circle);
      circle = new Circle();
      mode.code = 4;
    }
  };
}

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
        arc.chord = chord;
        canvasRedraw(arc);
      };
      mode.code = 2;
    } else if ( mode.code == 2 )
    {
      arrow.pointA = chord.centerPoint();
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

        var a = B / A;
        var b = - C / B;
        var pA = - Math.sqrt( B, 2 );
        var pB = A * B;
        var pC = C * A;

        arrow = t;
        arc.arrow = arrow;
        arc.calcCenterPoint( a, b );

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

$( document ).ready( function() {
  $(".createPoint").click(setPoint);
  $(".createLine").click(setLine);
  $(".createArc").click(setArc);
  $(".createCircle").click(setCircle);
});
