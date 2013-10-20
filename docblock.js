Array.prototype.insert = function(index) {
    this.splice.apply(this, [index, 0].concat(
        Array.prototype.slice.call(arguments, 1)));
    return this;
};

(function(window, document, $) {

	var DocBlocks = function(contain, c) {
		var config = {

		},
		container = contain,
		templateArray = [],
		compiledTemplate = '',
		templates = {
			addButton: '<div class="dcb-newline" on-click="addButton" data-index="{{i}}"><div class="dcb-plus">+</div></div>',
			label: '<div class="dcb-label {{cls}}">{{^value}}{{placeholder}}{{/value}}{{value}}</div>',
			input: '<input type="text" class="dcb-input {{cls}}" name="{{name}}" value="{{value}}" placeholder="{{placeholder}}"/>',
			textarea: '<textarea class="dcb-textarea {{cls}}" placeholder="{{placeholder}}">{{value}}</textarea>',
			select: '<select name="{{name}}" class="dcb-select {{cls}}">{{#options}}<option value="{{value}}">{{text}}</option>{{/options}}</select>'
		},
		hash = 'dcb',
		ractive = null,
		daterRender = [],
		dataCopy = [],
		flatData  = [],
		iterator = 0,
		line = 1,
		defaultTemplateClone = null;

		config = $.extend(config, c);

		function init(data) {
			templateArray = buildTemplate(config.blocks);
			iterator = 0;
			if (data && data.length) {
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
			}

			iterator = 0;
			dataCopy[0] = $.extend(true, {}, config.blocks);
			dataCopy[0] = addDataToBlocks(dataCopy[0], config.blocks, true);
			iterator = 0;
			dataCopy.forEach(function(dater) {
				defaultTemplateClone = flattenData([dater], false);
			});

			if (!data && data.length == 0) {
				flatData.push(defaultTemplateClone);
			}
			

			ractive = new Ractive( {
				el: container,
				template: '{{#items:i}}' + templates.addButton + compiledTemplate + '{{/items}}' + templates.addButton,
				data: {
					items: flatData
				}
			});
			ractive.on("addButton", function(e) {
				var item = e.keypath.split('.')[1];
				if (!item) {
					this.data.items.push(defaultTemplateClone);
				} else {
					this.data.items.insert(item, defaultTemplateClone);
				}
				this.update('items');
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

		function addDataToBlocks(daterContainer, daters, def) {
			daters.forEach(function(data, index) {
				if (data instanceof Array) {
					daterContainer[index] = addDataToBlocks(daterContainer[index], data, def);
				} else {
					if (def) {
						data = '';
					}
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