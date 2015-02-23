$("a.drawToolsLink").click(function()
{
  $("button.drawTools").html( $(this).html() + ' <span class="caret"></span>');
  $("button.drawTools").removeClass("btn-default");
  $("button.drawTools").addClass("btn-primary");
});
