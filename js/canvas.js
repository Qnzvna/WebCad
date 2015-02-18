var canvas = document.getElementById("display");
var context = canvas.getContext("2d");
var objects = [];
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

$("#display").click( function( e ) {
  mode.Do( e );
});

function canvasRedraw( object )
{
  context.clearRect ( 0, 0, canvas.width, canvas.height );
  for ( var i = 0; i < objects.length; i++ )
  {
    objects[i].Draw(context);
  }
  object.Draw(context);
}
