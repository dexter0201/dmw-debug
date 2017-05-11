var JsonNodeHtml = (function() {
    var htmlOptions = {
        "indent": 10,
        "characters": {
            "plus": "&#43;",
            "minus": "&#8722;",
            "downArrow": "&#9660;",
            "rightArrow": "&#9658;"
        }
    };

    var createHead = function(node) {
    	var template = _.template("<div class='head'><div class='controller collapse'></div><div class='title'><span class='key'><%= key %></span>: <span class='value <%= type %>'><%= value %></span></div></div>");
    	if(!node.parent && !node.children.length) {
    		template = _.template("<div class='head'><div class='controller collapse'></div><div class='title'><span class='value <%= type %>'><%= value %></span></div></div>");
    	}
    	var head = $(template(node));
        if(node.children.length) {
            $(".controller", head).click(function() {
                var body = $(head).next();
                var controller = $(this);
                if(controller.hasClass("collapse")) {
                    body.show();
                    controller.removeClass("collapse")
                            .addClass("expand")
                            .html(htmlOptions.characters.downArrow);
                }
                else {
                    body.hide();
                    controller.removeClass("expand")
                            .addClass("collapse")
                            .html(htmlOptions.characters.rightArrow);
                }
            });
        }
        return head;
    };
    
    var createBody = function(node) {      
        return $("<div class='body collapse'></div>"); 
    };

    var createNodeContainer = function(node) {
        var template = _.template("<div class='node' level='<%= level %>'></div>");
        var container = $(template(node));
        if(node.level) {           
            container.css({"left": node.level * htmlOptions.indent});            
        }
        return container;
    };    

    var createHtmlNode = function(node) {
        if(!node) return null;
        var container = createNodeContainer(node);
        var head = createHead(node);
        var body = createBody(node);
        container.append(head).append(body);
        $.each(node.children, function() {
            body.append(createHtmlNode(this));
        });
        if(node.children.length) {
            $(">.controller", head).html(htmlOptions.characters.rightArrow);
        }
        return container;
    };

    return {
        "generate": createHtmlNode
    };
})();