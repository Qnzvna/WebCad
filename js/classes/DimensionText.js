function DimensionText()
{
  this.point = new Point();

  this.offset = new Point();
  this.offset.x = 10;
  this.offset.y = 10;

  this.text = "";

  this.size = 15;

  this.font = "Arial";

  this.Draw = function(context)
  {
    var fullFont = Math.floor(this.size / scale) + 'px ' + this.font;
    context.font = fullFont;
    context.fillText(this.text, this.point.x - this.offset.x, this.point.y - this.offset.y);
  };
}
