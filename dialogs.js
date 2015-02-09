$(function() {
		$( "#fileSaveNoCancel" ).dialog({
		resizable: false,
		height:230,
		width:320,
		modal: true,
		autoOpen: false,
		buttons: {
			"Yes": function() {SaveScene(); NewScene();  $(this).dialog("close");},
			"No": function() {NewScene(); $(this).dialog("close");},
			Cancel: function() {$( this ).dialog( "close" );}
			}
		});
	});

$(function() {
	$( "#gridSettingsDialog" ).dialog({
	resizable: false,
	height:230,
	width:500,
	modal: true,
	autoOpen: false,
	buttons: {
		"Apply": function() {
			//todo
			
		},
		"OK": function() {NewScene(); $(this).dialog("close");},
		Cancel: function() {$( this ).dialog( "close" );}
		}
	});
});

function OpenGridSettingsDialog(){
	$("#gridSettingsDialog" ).dialog("open");
}