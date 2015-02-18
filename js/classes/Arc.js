function Arc()
{
  /**
   * cięciwa opisująca łuk
   */
  this.chord = -1;

  /**
   * strzałka łuku
   */
  this.arrow = -1;

  this.Radius = function(context)
  {
    var r = 0;
    return r;
  };


  this.Draw = function(context)
  {
    if (this.chord != -1)
      this.chord.Draw(context);

    if (this.arrow != -1)
      this.arrow.Draw(context);
  };
}
