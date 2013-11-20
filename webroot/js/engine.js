var Engine = function(options) {
	var me = this;

	me.world = [];

	me.init = function(data) {
		//Initial world setup
		me.world = [];
		for(var i = 0; i < data.length; i++) {
			var o = data[i];
			me.world[o.id] = {
				object : o
				//TODO: Mesh goes HERE!
			};
			console.log("init", o)
		}
	};

	me.update = function(data) {
		for(var i = 0; i < data.length; i++) {
			var o = data[i];
			var wo = me.world[o.id];
			
			//We synchronize the properties on the object
			//sent by the server
			if(wo != null) {
				for (key in o) {
					wo[key] = o[key];
				}
				console.log("update", o)
			}
			else {
				//TODO: Object has not been seen before
				//request the object from server
			}
		}
	};

	/*
		Handles a message from the server
	*/	
	me.receiveMessage = function(s) {
		if(s.length == 0) return;
		log("Got " + s.type)
		switch(s.type) {
			case "change": 
				me.update(s.data);
				break;
			case "init":
				me.init(s.data);
				break;
		}
	};

	

	return me;
}