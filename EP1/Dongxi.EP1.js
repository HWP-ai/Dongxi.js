
(function(){
	
	var builder = Dongxi.builder('main');
	
	var Builder = builder.constructor;
	
	var units = Builder.prototype.units;
	
	units["environment"] = function(info){
		var node = this.prefab('environment', info);
		var events = info.events;
		var onComponentEvent = info.onComponentEvent;
		if(typeof events == "string"){
			events = [events];
		}
		if(events){
			var _w = function(ev){
				if((ev.target != node) &&
					(ev.target.hasAttribute("component"))){
					onComponentEvent(ev, ev.target, node);
				}
			}
			for(var i=0; i<events.length; ++i){
				node.addEventListener(
					events[i],
					_w
				);
			}
		}
		//console.log(info.ports);
		if(info.ports != null){
			this.makeMany(info.ports, function(_node, index){
				_node.setAttribute('index', index);
				node.appendChild(_node);
			});
		}
		return node;
	}
	
})();