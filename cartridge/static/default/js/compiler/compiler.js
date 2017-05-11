(function ($, cdm){
	$(document).on("keydown", function(e) {
		if (e.keyCode == 13 && e.ctrlKey) {
			$("#btn-compile").trigger("click");
		} else if (e.keyCode == 27) {
			$("#btn-clear").trigger("click");
		}
	});

	$("#btn-compile").on("click", function(){
		$(".ajaxImg").show();
		myCodeMirror.setValue($.trim(myCodeMirror.getValue()));
		$.ajax({
			url: $(this).data("compile-url"),
			type : "POST",
			data : {"compileString":$("#compiled-string").val()},
			dataType: "json",
			success: function (response) {				
				var panel = $("#compile-output-panel-text");
				
				for(var i = response.length - 1; i >= 0; --i) {
					var r = response[i];
					if(r.compileError) {
						panel.prepend("<div class='result'><span class='error'>" + r.message + "</span></div>");
					} 
					else if(r.compileLogObject) {
						var d = $("<div class='result'></div>");
						d.append("<span class='log'>[" + r.lineNumber + "]</span>");
						var node = JsonNode.createNode("", r.loggedObject, 0);
						var html = JsonNodeHtml.generate(node);
						d.append(html);
						panel.prepend(d);
					}
					else {
						var node = JsonNode.createNode("", r, 0);
						var html = JsonNodeHtml.generate(node);
						$(">.head .controller", html).click();
						panel.prepend(html);
					}
				}
				
				$(".ajaxImg").hide();
			}
		});
	});
	
	$("#btn-clear").on("click", function(){
		$(".compile-output-panel-text").html("");
	});
	
	var textArea = document.getElementById("compiled-string");
	var myCodeMirror = cdm.fromTextArea(textArea,{
		lineNumbers: true
	});

	myCodeMirror.on("change", function (cm) { 
		textArea.value = cm.getValue();
	});
	
}(jQuery, CodeMirror));