function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    newX = (evt.clientX - rect.left) * matrix[0] + (evt.clientY - rect.top) * matrix[2] + matrix[4];
    newY = (evt.clientX - rect.left) * matrix[1] + (evt.clientY - rect.top) * matrix[3] + matrix[5];
    return {
      x: newX,
      y: newY
    };
}
