var JsonNode = (function JsonNode() {
    
    var escapseHtml = function(text) {
        return $('<div/>').text(text).html();
    };

    var isPrimitive = function(obj) {
    	return obj === null || _.contains(["string", "number", "undefined", "boolean"], typeof obj);
   	};
    
    var isFunction = function(obj) {
    	return typeof obj === "function";
    };
    
    var isArray = function(obj) {
    	return Array.isArray(obj);
    };
    
    var isObject = function(obj) {
        return typeof obj === "object";
    };
    
    var createPrimitiveNode = function(key, value, level, type) {
        var node = {
            "level": level,
            "key": key,
            "value": value,
            "children": [],
            "type": type         
        };

        if(value === null) {
            node.value = "null";
            node.type = "null";         
        }

        if(typeof value === "undefined")
            node.value = "undefined";
        node.value = escapseHtml(node.value.toString());
        return node;
    };
    
    var createNode = function(name, obj, level) {
        if(isPrimitive(obj)) {
            return createPrimitiveNode(name, obj, level, typeof obj);
        }
        if(isArray(obj)) {
            return createArrayNode(name, obj, level);
        }
        if(isObject(obj)) {
        	return createObjectNode(name, obj, level);
        }
        return null;
    };    
    
    var createArrayNode = function(name, array, level) {
        var node = createPrimitiveNode(name || "Array", ["[", array.length,"]"].join(""), level, "");
        _.each(array, function(element, index) {
        	var child = createNode(index.toString(), element, level + 1);
        	node.children.push(child);
        	child.parent = node;
        });
        return node;
    };
    
    var createObjectNode = function(name, obj, level) {        
        var node = createPrimitiveNode(name || "Object", ["{", Object.keys(obj).length, "}"].join(""), level, "");
        _.each(obj, function(value, key) {
        	var child = createNode(key, value, level + 1);
            node.children.push(child);
            child.parent = node;
        });
        return node;
    };
    
    return {
        "createNode": createNode       
    };    
})();