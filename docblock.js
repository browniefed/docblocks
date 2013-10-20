

(function(window, document, $) {

	var DocBlocks = function(contain, c) {
		var config = {

		},
		container = contain,
		templateArray = [],
		compiledTemplate = '',
		templates = {
			addButton: '<div class="dcb-newline"><div class="dcb-plus">+</div></div>',
			label: '<div class="dcb-label {{cls}}">{{value}}</div>',
			input: '<input type="text" class="dcb-input {{cls}}" name="{{name}}" value="{{value}}" />',
			textarea: '<textarea class="dcb-textarea {{cls}}">{{value}}</textarea>',
			select: '<select name="{{name}}" class="dcb-select {{cls}}">{{#options}}<option value="{{value}}">{{text}}</option>{{/options}}</select>'
		},
		hash = 'dcb',
		ractive = null,
		daterRender = [],
		flatData  = [],
		iterator = 0,
		line = 1;

		config = $.extend(config, c);

		function init(data) {
			templateArray = buildTemplate(config.blocks);
			iterator = 0;
			data.forEach(function(d,i) {
			 	 daterRender[i] = $.extend(true, {}, config.blocks);
			 	 daterRender[i] = addDataToBlocks(daterRender[i], d);
			 	 iterator = 0;
			 });
			iterator = 0;
			compiledTemplate = compileTemplate(templateArray, true);
			daterRender.forEach(function(dater) {
				flatData.push(flattenData([dater], false));
			});

			ractive = new Ractive( {
				el: container,
				template: '{{#items}}' + templates.addButton + compiledTemplate + templates.addButton + '{{/items}}',
				data: {
					items: flatData
				}
			});
		}

		function compileTemplate(templates, inline) {
			var templateString = '';
			templates.forEach(function(template, index) {
				if (template instanceof Array) {
					templateString +=  '<div class="dcb-newline">' + compileTemplate(template, false) + '</div>';
				} else {
					templateString += (inline ? '<div class="dcb-newline">' : '');
					templateString += '{{# ' + hash + iterator + '}}' + template + '{{/ ' + hash + iterator + '}}';
					templateString += (inline ? '</div>' : '');
					iterator++;
				}
			});
			return templateString;
		}

		function flattenData(daters, passedLine) {
			var flatterData = {};
			for (dater in daters[0]) {
				var currentDater = daters[0][dater];
				if (currentDater instanceof Array) {
					flatterData = $.extend(flatterData, flattenData([currentDater], line));
					line++;
				} else {
					flatterData[currentDater.hash] = currentDater;
					flatterData[currentDater.hash].line = passedLine || line;
					if (!passedLine) {
						line++;
					}
					
				}
			}
			return flatterData;
		}

		function addDataToBlocks(daterContainer, daters) {
			daters.forEach(function(data, index) {
				if (data instanceof Array) {
					daterContainer[index] = addDataToBlocks(daterContainer[index], data);
				} else {
					daterContainer[index].value = data;
					daterContainer[index].hash = hash + iterator;
					iterator++;
				}
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
			return ractive.get();
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