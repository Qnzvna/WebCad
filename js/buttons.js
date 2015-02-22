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
  canvas.onmousemove = snaPoint;

  mode.Do = function(e)
  {
    var point = new Point();
    var pos = getMousePos(canvas, e);
    point.x = pos.x;
    point.y = pos.y;
    snap( point, e);
    point.Draw( context );
    objects.push(point);
    points.push( point );
    canvasRedraw( null );
  };
}

function setLine()
{
  mode.code = 1;
  var line = new Line();

  canvas.onmousemove = snaPoint;

  mode.Do = function(e)
  {
    if ( mode.code == 1 )
    {
      var pointA = new Point();
      var pos = getMousePos(canvas, e);
      pointA.x = pos.x;
      pointA.y = pos.y;

      snap( pointA, e);

      points.push( pointA );
      line.pointA = pointA;
      pointA.Draw( context );

      canvas.onmousemove = function(e) {
        var pos = getMousePos(canvas, e);
        var pointB = new Point();
        pointB.x = pos.x;
        pointB.y = pos.y;

        snap( pointB, e );

        line.pointB = pointB;

        axis( e );
        canvasRedraw(line);
      };

      mode.code = 2;
    }else if ( mode.code == 2)
    {
      canvas.onmousemove = snaPoint;

      points.push( line.pointB );
      objects.push( line );
      line = new Line();
      mode.code = 1;
      canvasRedraw( null );
    }
  };
}

function setPoly()
{
  mode.code = 1;
  var line = new Line();
  var poly = new Polygon();

  canvas.onmousemove = snaPoint;

  mode.Do = function(e)
  {
    if ( mode.code == 1 )
    {
      var pointA = new Point();
      var pos = getMousePos(canvas, e);
      pointA.x = pos.x;
      pointA.y = pos.y;

      snap( pointA, e );

      line.pointA = pointA;
      //objects.push( pointA );
      points.push( pointA );

      canvas.onmousemove = function(e) {
        var pos = getMousePos(canvas, e);
        var pointB = new Point();
        pointB.x = pos.x;
        pointB.y = pos.y;

        snap( pointB, e );

        poly.Remove( line );
        line.pointB = pointB;
        poly.Add( line );

        axis( e );
        canvasRedraw( poly );
      };

      mode.code = 2;
    }else if ( mode.code == 2)
    {
      if ( poly.IsClosed() )
      {
        //objects.pop();
        objects.push(poly);
        mode.code = 1;
        canvas.onmousemove = snaPoint;
        poly = new Polygon();
        canvasRedraw( null );
        line = new Line();
      } else {
        poly.Add( line );
        var point = line.pointB;
        points.push( point );
        line = new Line();
        line.pointA = point;
      }
    }
  };
}

function setCircle()
{
  mode.code = 4;

  var circle = new Circle();
  canvas.onmousemove = snaPoint;

  mode.Do = function(e)
  {
    if ( mode.code == 4 )
    {
      var pointS = new Point();
      var pos = getMousePos(canvas, e);
      pointS.x = pos.x;
      pointS.y = pos.y;

      snap( pointS, e );

      points.push( pointS );

      circle.pointS = pointS;
      pointS.Draw(context);

      canvas.onmousemove = function(e) {
        var pos = getMousePos(canvas, e);
        var pointR = new Point();
        pointR.x = pos.x;
        pointR.y = pos.y;

        snap( pointR, e);
        pointR.Draw( context );

        circle.pointR = pointR;

        axis( e );
        canvasRedraw(circle);
      };

      mode.code = 5;
    }else if ( mode.code == 5)
    {
      canvas.onmousemove = snaPoint;
      objects.push(circle);
      circle = new Circle();
      mode.code = 4;
      canvasRedraw( null );
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

function fill()
{
  mode.Do = function ( e )
  {
    var point = new Point();
    var pos = getMousePos(canvas, e);
    point.x = pos.x;
    point.y = pos.y;
    point.Draw( context );
    var poly = new Polygon();
    for ( var i = 0; i < objects.length; i++ )
    {
      if ( objects[i] instanceof Polygon && objects[i].CheckPoint( point ))
      {
        poly = objects[i];
      }
    }

    console.log( poly );

  };
}

function back()
{
  if (objects.length > 1)
  {
    deleted.push( objects.pop() );
  }

  canvasRedraw( null );
}

function forward()
{
  if ( deleted.length > 0 )
  {
    objects.push( deleted.pop() );
  }

  canvasRedraw( null );
}

function grid()
{
  var div = '<div class="grid box"><div>Podaj szerokość siatki:</div><input name="grid-size" type="text"/><button>OK</button></div>';
  if ( $("#box .box").length === 0 )
  {
    $("#box").append(div);
  } else {
    if ( $("#box .grid").length === 0)
    {
      $("#box").empty();
      $("#box").append(div);
    } else
    {
      $("#box").empty();
    }
  }

  $("#box .grid button").click(function(){
    var grid = new Grid();
    grid.density = $("#box .grid input").val();
    objects[0] = grid;
    canvasRedraw( null );
    $("#box").empty();
  });
}

function redraw()
{
  canvasRedraw( null );
}

function helpAxis()
{
  if ( axisOn === true )
  {
    $(".help-axis").html("Włącz linie pomocnicze");
    axisOn = false;
  } else
  {
    axisOn = true;
    $(".help-axis").html("Wyłącz linie pomocnicze");
  }
}

function saveFile()
{
  var json_str = hydrate.stringify( objects );
  console.log( json_str );
  var blob = new Blob([json_str], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "projekt.json");
}

function readFile()
{
  var div = '<div class="file box"><div>Podaj plik do wczytania:</div><input type="file" /></div>';
  if ( $("#box .box").length === 0 )
  {
    $("#box").append(div);
  } else {
    if ( $("#box .file").length === 0)
    {
      $("#box").empty();
      $("#box").append(div);
    } else
    {
      $("#box").empty();
    }
  }

  $("#box .file input").change(function( evt ){
    var f = evt.target.files[0];

    if (f) {
      var r = new FileReader();
      r.onload = function( e )
      {
        var contents = e.target.result;
        objects = hydrate.parse( contents );
        canvasRedraw( null );
      };
      r.readAsText(f);
      $("#box").empty();
    } else {
      alert("Failed to load file");
    }
  });
}

function tape()
{
  mode.code = 1;
  var line = new Line();

  canvas.onmousemove = snaPoint;

  mode.Do = function(e)
  {
    if ( mode.code == 1 )
    {
      var pointA = new Point();
      var pos = getMousePos(canvas, e);
      pointA.x = pos.x;
      pointA.y = pos.y;

      snap( pointA, e);

      line.pointA = pointA;
      pointA.Draw( context );

      canvas.onmousemove = function(e) {
        var pos = getMousePos(canvas, e);
        var pointB = new Point();
        pointB.x = pos.x;
        pointB.y = pos.y;

        snap( pointB, e );

        line.pointB = pointB;

        axis( e );
        canvasRedraw(line);
      };

      mode.code = 2;
    }else if ( mode.code == 2)
    {
      canvas.onmousemove = snaPoint;

      //objects.push( line );
      line = new Line();
      mode.code = 1;
      canvasRedraw( null );
    }
  };
}

$( document ).ready( function() {
  $(".createPoint").click(setPoint);
  $(".createLine").click(setLine);
  $(".createPoly").click(setPoly);
  $(".createArc").click(setArc);
  $(".createCircle").click(setCircle);
  $(".tape").click(tape);
  $(".fill").click(fill);
  $(".back").click(back);
  $(".forward").click(forward);
  $(".grid").click(grid);
  $(".redraw").click(redraw);
  $(".help-axis").click(helpAxis);
  $(".saveFile").click(saveFile);
  $(".readFile").click(readFile);
});
