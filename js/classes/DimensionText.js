function DimensionText()
{
  this.point = new Point();

  this.offset = new Point();
  this.offset.x = 10;
  this.offset.y = 10;

  this.text = "";

  this.font = "15px Arial";

  this.Draw = function(context)
  {
    context.font = this.font;
    context.fillText(this.text, this.point.x - this.offset.x, this.point.y - this.offset.y);
  };
}
