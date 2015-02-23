var canvas = document.getElementById("display");
var context = canvas.getContext("2d");
var objects = [];
var points = [];
var deleted = [];
var grid = new Grid();
var axisOn = true;
var hydrate = new Hydrate();
var matrix=[1,0,0,1,0,0];
canvas.height = document.body.offsetHeight - 5;
canvas.width = document.body.clientWidth;
canvas.onmousemove = snaPoint;
document.onkeydown = function(){};

$("#display").click( function( e ) {
  mode.Do( e );
});

$('#display').contextmenu( function() {
    canvasRedraw( null );
    canvas.onmousemove = snaPoint;
    mode.Do = function(){};
    return false;
});

objects.push( grid );
grid.Draw( context );

function canvasRedraw( object )
{
  context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
  for ( var i = 0; i < objects.length; i++ )
  {
    objects[i].Draw(context);
  }
  if ( object !== null )
  {
    object.Draw(context);
  }
}
