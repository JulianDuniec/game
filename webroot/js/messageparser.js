var MessageParser = function(options) {

	var me = this;

	me.parse = function(s) {

		s = JSON.parse(s).b
		var typeIndicator = s[0];
		var body = s.substring(1);
		switch(typeIndicator) {
			case 's':
				return me.parseStateChangeMessage(body);
			case 'i':
				return me.parseObjectDatabase(body);
			case 'n':
				return me.parseReInitObject(body);
			default:
				log("E: Unparsable message " + s);
		}
	};

	me.parseReInitObject = function(s) {
		return {
			type : 'reinit',
			data : me.parseObjects(s)
		};
	};

	me.parseObjectDatabase = function(s) {
		return {
			type : 'init',
			data : me.parseObjects(s)
		};
	};

	me.parseStateChangeMessage = function(s) {
		return {
			type : 'change',
			data : me.parseObjects(s)
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