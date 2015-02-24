function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    newX = (evt.clientX - rect.left) / scale ;
    newY =  (evt.clientY - rect.top) / scale;
    return {
      x: newX,
      y: newY
    };
}
