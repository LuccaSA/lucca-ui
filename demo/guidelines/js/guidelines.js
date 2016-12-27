zoomOut = function() {
	$(".fade, .full-size").remove();
}
zoomExamples = function() {
	var thisImage = $(this).attr("src");
	$("body").append(
			"<div class='fade'></div>"
		+	"<img src='" + thisImage + "' class='full-size hidden'/>"	
		)
	var thisHeight = $(".full-size").height();
	var thisWidth = $(".full-size").width();
	$(".full-size").css({
		"margin-top": -thisHeight/2,
		"margin-left": -thisWidth/2
	}).removeClass("hidden");
	$(".fade, .full-size").click(zoomOut)
}

$(".example img").click(zoomExamples)