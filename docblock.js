

(function(window, document, $) {

	var DocBlocks = function(contain, c) {
		var config = {

		},
		container = contain,
		templateArray = [],
		templates = {
			label: '<div class="dcb-label {{cls}}">{{value}}</div>',
			input: '<input type="text" class="dcb-input {{cls}}" name="{{name}}" value="{{value}}" />',
			textarea: '<textarea class="dcb-textarea {{cls}}">{{value}}</textarea>',
			select: '<select name="{{name}}" class="dcb-select {{cls}}">{{#options}}<option value="{{value}}">{{text}}</option>{{/options}}</select>'
		},
		ractive = null,
		daterRender = [];

		config = $.extend(config, c);

		function init(data) {
			templateArray = buildTemplate(config.blocks);
			console.log(templateArray);
			// data.forEach(function(d,i) {
			// 	daterRender[i] = $.extend(true, {}, config.blocks);
			// 	daterRender[i] = addDataToBlocks(daterRender[i], d);
			// });

			// ractive = new Ractive( {
			// 	el: container,
			// 	template: '{{#items}}' + templateString + '{{/items}}',
			// 	data: {
			// 		items: daterRender
			// 	}
			// });
			// console.log(ractive)
		}

		function addDataToBlocks(daterContainer, daters) {
			daters.forEach(function(data, index) {
				daterContainer[index].value = data;
			});
			return daterContainer
		}

		function buildTemplate(blocks) {
			var pushTo = [];
			blocks.forEach(function(block, index) {
				var templateString = '';
				if (block instanceof Array) {
					pushTo.push(buildTemplate(block));
				} else {
					pushTo.push(templates[block.blockType]);
				}
			});

			return pushTo;
		}

		function toJson() {
			//read through all nodes
			//return array in correct order with same structure as defined block
		}
	
		return {
			init: init,
			toJson: toJson
		};
	}

if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	module.exports = DocBlocks;
} else {
	if ( typeof define === "function" && define.amd ) {
		define( "DocBlocks", [], function () { return DocBlocks; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.DocBlocks = window.$ = DocBlocks;
}
}(window, document, $))