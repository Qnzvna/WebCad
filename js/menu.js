function restoreMenu()
{
  $("button.drawTools").html( "Draw Tools" + ' <span class="caret"></span>');
  $("button.drawTools").removeClass("btn-primary");
  $("button.drawTools").addClass("btn-default");
  $("button.file").html( "File" + ' <span class="caret"></span>');
  $("button.file").removeClass("btn-primary");
  $("button.file").addClass("btn-default");
  $("button.edit").html( "Edit" + ' <span class="caret"></span>');
  $("button.edit").removeClass("btn-primary");
  $("button.edit").addClass("btn-default");
}

$("a.drawToolsLink").click(function()
{
  restoreMenu();
  $("button.drawTools").html( $(this).html() + ' <span class="caret"></span>');
  $("button.drawTools").removeClass("btn-default");
  $("button.drawTools").addClass("btn-primary");
});

$("a.editLink").click(function()
{
  restoreMenu();
  $("button.edit").html( $(this).html() + ' <span class="caret"></span>');
  $("button.edit").removeClass("btn-default");
  $("button.edit").addClass("btn-primary");
});

$("a.fileLink").click(function()
{
  restoreMenu();
  $("button.file").html( $(this).html() + ' <span class="caret"></span>');
  $("button.file").removeClass("btn-default");
  $("button.file").addClass("btn-primary");
});
