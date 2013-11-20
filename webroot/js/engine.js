var Engine = function(options) {
	var me = this;

	me.world = [];

	me.init = function(data) {
		//Initial world setup
		me.world = [];
		me.initItems(data)
	};

	me.initItems = function(data) {
		for(var i = 0; i < data.length; i++) {
			var o = data[i];
			me.world[o.id] = {
				object : o.data
				//TODO: Mesh goes HERE!
			};
		}
	};

	me.update = function(data) {
		for(var i = 0; i < data.length; i++) {
			var o = data[i];
			var wo = me.world[o.id];
			
			//We synchronize the properties on the object
			//sent by the server
			if(wo != null) {
				for (key in o.data) {
					wo.object[key] = o.data[key];
				}
			}
			else {
				log("Not seen", o.id)
				me.client.send("n"+o.id)
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
		switch(s.type) {
			case "init":
				me.init(s.data);
				break;
			case "reinit":
				me.initItems(s.data);
				break;
			case "change": 
				me.update(s.data);
				break;
		}
		dumpWorld(me.world);
	};

	

	return me;
}