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

        canvasRedraw(line);
        axis( e );
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

        canvasRedraw( poly );
        axis( e );
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

        canvasRedraw( circle );
        axis( e );
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

  var div = "<div class=\"grid box panel panel-primary\">\
  <div class=\"panel-heading\">Grid density</div>\
  <div class=\"panel-body\">\
    <div class=\"input-group\">\
      <input type=\"text\" class=\"form-control\">\
      <span class=\"input-group-btn\">\
        <button class=\"btn btn-default ok\" type=\"button\">OK</button>\
        </span>\
    </div>\
    <div style=\"margin-top: 20px;\" class=\"input-group\">\
      <button type=\"button\" class=\"btn btn-default off\">Turn off</button>\
    </div>\
  </div>\
  </div>";

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

  $("#box .grid button.ok").click(function(){
    var grid = new Grid();
    grid.density = $("#box .grid input").val();
    objects[0] = grid;
    canvasRedraw( null );
    $("#box").empty();
  });

  $("#box .grid button.off").click(function(){
    var grid = new Grid();
    grid.density = -1;
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
    //$(".help-axis").html("Włącz linie pomocnicze");
    axisOn = false;
  } else
  {
    axisOn = true;
    //$(".help-axis").html("Wyłącz linie pomocnicze");
  }
}

function saveFile()
{
  var div = "<div class=\"file box panel panel-primary\">\
  <div class=\"panel-heading\">Save project</div>\
  <div class=\"panel-body\">\
    <div class=\"input-group\">\
      <input type=\"text\" class=\"form-control\" placeholder=\"filename\">\
      <span class=\"input-group-btn\">\
        <button class=\"btn btn-default ok\" type=\"button\">OK</button>\
        </span>\
    </div>\
  </div>\
  </div>";

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

  $("#box .file button.ok").click(function()
  {
    var json_str = hydrate.stringify( [objects, points] );
    var blob = new Blob([json_str], {type: "text/plain;charset=utf-8"});
    var filename = $("#box .file input").val() + '.webcad';
    saveAs(blob, filename);
    $("#box").empty();
  });
}

function readFile()
{
  var div = "<div class=\"file box panel panel-primary\">\
  <div class=\"panel-heading\">Load project</div>\
  <div class=\"panel-body\">\
    <div class=\"input-group\">\
      <input type=\"file\" class=\"form-control\">\
    </div>\
  </div>\
  </div>";

  //var div = '<div class="file box"><div>Podaj plik do wczytania:</div><input type="file" /></div>';
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
        var array = hydrate.parse( contents );
        objects = array[0];
        points = array[1];
        for( var i = 0; i < objects.length; i++ )
        {
          objects[i] = deserialize( objects[i] );
        }
        for( var i = 0; i < points.length; i++ )
        {
          points[i] = deserialize( points[i] );
        }
        canvasRedraw( null );
      };
      r.readAsText(f);
      $("#box").empty();
    } else {
      alert("Failed to load file");
    }
  });
}

$( document ).ready( function() {
  $(".createPoint").click(setPoint);
  $(".createLine").click(setLine);
  $(".createPoly").click(setPoly);
  $(".createArc").click(setArc);
  $(".createCircle").click(setCircle);
  $(".tape").click(tape);
  $(".fill").click(calcArea);
  $(".back").click(back);
  $(".forward").click(forward);
  $(".grid").click(grid);
  $(".redraw").click(redraw);
  $(".help-axis").click(helpAxis);
  $(".saveFile").click(saveFile);
  $(".readFile").click(readFile);
  $(".zoomPlus").click(zoomPlus);
  $(".zoomMinus").click(zoomMinus);
});
