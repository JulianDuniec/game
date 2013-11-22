var Engine = function(options) {
	var me = this;

	me.world = [];

	me.init = function(data) {
		//Initial world setup
		me.world = [];
		me.initItems(data);
		options.onInitialized();
	};

	/*
		Add all objects to the world
	*/
	me.initItems = function(data) {
		for(var i = 0; i < data.length; i++) {
			var o = data[i];
			me.world[o.id] = {
				object : o.data,
				//Mark as updated
				latestSync : new Date()
			};
		}
	};

	/*
		An unseen object is added
		to the world
	*/
	me.reInitItem = function(data) {
		var o = {
			object : data.data,
			latestSync : new Date()
		}; 

		me.world[data.id] = o;
		options.onAdd(o)
	}

	me.deleteObject = function(id) {
		log("Delete", id)
		var o = me.world[id];
		delete me.world[id];
		options.onDelete(o);
	}

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
				//Mark as changed
				wo.latestSync = new Date();
			}
			else {
				log("Not seen", o.id)
				me.client.send("n"+o.id)
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
				me.client.send("a");
				break;
			case "reinit":
				me.reInitItem(s.data);
				break;
			case "change": 
				me.update(s.data);
				break;
			case "delete":
				me.deleteObject(s.data);
				break;
		}

		options.onUpdate();
	};

	

	return me;
}