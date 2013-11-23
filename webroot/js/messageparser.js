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
			case 'd':
				return me.parseDeleteMessage(body);
			default:
				log("E: Unparsable message " + s);
		}
	};

	me.parseDeleteMessage = function(s) {
		return {
			type : 'delete',
			data : s
		}
	};

	me.parseReInitObject = function(s) {
		return {
			type : 'reinit',
			data : me.parseObject(s)
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
			objects.push(me.parseObject(objectStrings[i]));
		}

		return objects;
	};

	me.parseObject = function(s) {
		var id = s.substring(0, 12);
		var type = s.substring(12, 15);
		var body = JSON.parse(s.substring(15))
		return {
			id : id,
			type : type,
			data : body
		};
	};

	return me;
}