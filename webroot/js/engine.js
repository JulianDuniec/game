var Engine = function(options) {
	var me = this;

	/*
		Handles a message from the server
	*/	
	me.receiveMessage = function(s) {
		if(s.length == 0) return;

		message = me.parseMessage(s);
		console.log(message);
		log("Parsed " + message.type)
	};

	me.parseMessage = function(s) {
		var typeIndicator = s[0];
		var body = s.substring(1);
		switch(typeIndicator) {
			case 's':
				return me.parseStateChangeMessage(body);
			case 'i':
				return me.parseObjectDatabase(body);
			default:
				log("E: Unparsable message " + s);
		}
	};

	me.parseObjectDatabase = function() {
		return {
			type : 'init',
			changes : me.parseObjects(s)
		};
	};

	me.parseStateChangeMessage = function(s) {
		return {
			type : 'change',
			changes : me.parseObjects(s)
		};
	};

	me.parseObjects = function(s) {
		//Split and remove empty entries
		var objectStrings = s.split('|').filter(function(n) {return n;});

		var objects = [];

		for(var i = 0; i < objectStrings.length; i++) {
			var data = objectStrings[i];
			var id = data.substring(0, 12);
			var body = JSON.parse(data.substring(12))
			objects.push({
				id : id,
				data : body
			});
		}

		return objects;
	}

	return me;
}