/*!
 * Dongxi.js v0.0.1
 * (c) 2021 Mo Norman
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Dongxi = factory());
}(this, function(){
	
	/**
     * helpers	
	 */
	 
	var helpers = {};
	
	helpers.qn2s = function(qn){
		return '' + qn[0] + 'px ' + qn[1] + 'px ' 
			+ qn[2] + 'px ' + qn[3] + 'px';
	}
	
	/**
	 * Builder class
	 */
	 
	function Builder(name, options){
		this._name = name;
		builders[name] = this;
		this._window = options.window;
		if(!this._window){
			this._window = window;
		}
		this.units = Object.create(this.constructor.prototype.units);
	}
	
	Builder.prototype.units = {};  // units
	
	Builder.prototype.prefab = function(tagName, info){
		var node = this._window.document.createElement(tagName);
		//console.log(a, type, info);
		if(info == null){
			node.innerHTML = '';
			return;
		}
		if(info.inter != null){
			node.style.padding = helpers.qn2s(info.inter);
		}
		if(info.outer != null){
			node.style.margin = helpers.qn2s(info.outer);
		}
		if(info.width != null){
			if(info.width.constructor != Array){
				node.style.width = info.width + 'px';
			} else if(info.width.length == 3){
				if( info.width[0] != null ){
					node.style.width = info.width[0] + 'px';
				}
				if(info.width[1] != null ){
					node.style.minWidth = info.width[1] + 'px';
				}
				if(info.width[2] != null ){
					node.style.maxWidth = info.width[2] + 'px';
				}				
			}
		}
		if(info.height != null){
			if(info.height.constructor != Array){
				node.style.height = info.height + 'px';
			} else if(info.height.length == 3){
				if( info.height[0] != null ){
					node.style.height = info.height[0] + 'px';
				}
				if(info.height[1] != null ){
					node.style.minWidth = info.height[1] + 'px';
				}
				if(info.height[2] != null ){
					node.style.maxWidth = info.height[2] + 'px';
				}
			}
		}
		if(info.stroke != null){
			if(info.stroke.length == 4){
				node.style.borderWidth = helpers.qn2s(info.stroke);
			} else {
				node.style.borderWidth = info.stroke + "px";
			}
		}
		if(info.types){
			var types = info.types;
			for(var i=0; i<types.length; ++i){
				node.setAttribute(types[i], "");
			}
		}
		if(info.identifiers){
			node.setAttribute('identifiers', info.identifiers);
		}
		return node;
	}
	
	Builder.prototype.make = function(sort, info){
		return this.units[sort].call(this, info);
	}
	
	Builder.prototype.makeMany = function(infos, f){
		if(infos == null){
			return;
		}
		for(var i=0; i<infos.length; ++i){
			var node = this.make(infos[i].sort, infos[i].info);
			f(node, i);
		}
	}
	
	/**
	 * default units
	 */
	 
	var units = Builder.prototype.units;
	
	units.text = function(info){
		var node = this.prefab('span', info);
		node.innerText = info.text;
		return node;
	}

	units.image = function(info){
		var node = this.prefab('img', info);
		node.src = info.src;
		return node;
	}

	units.button = function(info){
		var node = this.prefab('button', info);
		node.text = info.text;
		return node;
	}

	units.input = function(info){
		var node = this.prefab('textarea', info);
		node.innerHTML = info.value;
		return node;
	}
	
	units.connection = function(info){
		var node = this.prefab('connection', info);
		this.makeMany(info.ports, function(_node, index){
			_node.setAttribute('index', index);
			node.appendChild(_node);
		});
		return node;
	}
	
	units.stage = function(info){
		var stage = this.prefab('stage', info);
		var created = info.created || (+ new Date());
		stage.setAttribute("created", created);
		return stage;
	}

	/**
	 * builder api
	 */
	 
	var builders = {};
	
	function builder(name, options){
		if(arguments.length < 1){
			name = 'main';
		}
		if(name in builders){
			// not pass options if the builder is created
			if(options){
				throw 'not understanding arguments';
			}
			return builders[name];
		} else {
			if(!options){
				options = {};
			}
			var builder = new Builder(name, options);
			return builder;
		}
	}
	
	/**
	 * manage api
	 */
	 
	var manage = {};
		
	manage.runOptions = {};
	
	manage.run = function(){
		var _builder = builder();
		var stage = _builder.make('stage', {});
		var message = _builder.make('text', 
			{ text: 'Hello, world!' }
		);
		stage.appendChild(message);
		window.document.body.prepend(stage);
	}
		
	manage.main = function(runOptions){
		if(runOptions != null){
			for(var k in runOptions){
				manage.runOptions[k] = runOptions[k];
			}
		}
		this.run();
	}
	
	/**
	 * exports
	 */
	 
	var Dongxi = {};
	
	/*  */
	
	Dongxi.helpers = helpers;	
	
	/*  */
	
	Dongxi.builder = builder;
	
	/*  */
	
	Dongxi.manage = manage;
	
	return Dongxi;
	
}));
	