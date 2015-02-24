var zoomerP = 1.2;

function zoomPlus()
{
  context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
  context.scale( zoomerP, zoomerP );
  scale *= zoomerP;
  canvasRedraw( null );
}

function zoomMinus()
{
  context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
  context.scale( 1 / zoomerP, 1 / zoomerP );
  scale /= zoomerP;
  canvasRedraw( null );
}
