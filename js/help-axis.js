function axis( e )
{
  if (axisOn === true )
  {
    var pos = getMousePos(canvas, e);

    pos = snap( pos, e );

    context.moveTo(pos.x, 0);
    context.lineTo(pos.x, canvas.height);

    context.moveTo(0, pos.y);
    context.lineTo(canvas.width, pos.y);

    var oldWidth = context.lineWidth;
    context.lineWidth = 0.5;
    context.stroke();
    context.lineWidth = oldWidth;
  }
}
