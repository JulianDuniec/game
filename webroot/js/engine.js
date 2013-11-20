var Engine = function(options) {
	var me = this;

	me.world = [];

	me.init = function(data) {
		//Initial world setup
		me.world = [];
		me.update(data);
	};

	me.update = function(data) {
		for(var i = 0; i < data.length; i++) {
			var o = data[i];
			me.world[o.id] = 0;
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