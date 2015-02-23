var zoomerP = 1.2;
var zoomerM = 0.8;

function zoomPlus()
{
  context.scale( zoomerP, zoomerP );
  matrix[0] *= zoomerP;
  matrix[1] *= zoomerP;
  matrix[2] *= zoomerP;
  matrix[3] *= zoomerP;
  canvasRedraw( null );
  //canvas.height = document.body.offsetHeight - 5;
  //canvas.width = document.body.clientWidth;
}

function zoomMinus()
{
  context.scale( zoomerM, zoomerM );
  matrix[0] *= zoomerM;
  matrix[1] *= zoomerM;
  matrix[2] *= zoomerM;
  matrix[3] *= zoomerM;
  canvasRedraw( null );
  //canvas.height = document.body.offsetHeight - 5;
  //canvas.width = document.body.clientWidth;
}
