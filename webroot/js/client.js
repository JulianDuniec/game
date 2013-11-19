var Client = function(options) {
	var me = this;
	me.url = "ws://localhost:1337/ws";
	me.WebSocket = window.WebSocket || window.MozWebSocket;
	me.init = function() {
		me.connection = new me.WebSocket(me.url);
		me.connection.onopen = me.connectionOpen;
		me.connection.onmessage = me.connectionMessage;
		me.connection.onerror = me.connectionError;
	};

	me.connectionOpen = function() {
		console.log("Connection open");
		me.send("Hello Server!")
	};

	me.connectionMessage = function(message) {
		console.log("Connection message", message)
	};

	me.connectionError = function() {
		console.log("Connection error")
	};

	me.send = function(s) {
		me.connection.send(JSON.stringify({body : s}));
	};

	return me;
};