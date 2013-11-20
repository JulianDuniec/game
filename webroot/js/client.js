var Client = function(options) {
	var me = this;
	me.url = "ws://localhost:1337/ws";
	me.WebSocket = window.WebSocket || window.MozWebSocket;
	me.init = function() {
		me.connection = new me.WebSocket(me.url);
		me.connection.onopen = me.connectionOpen;
		me.connection.onmessage = me.connectionMessage;
		me.connection.onerror = me.connectionError;
		me.connection.onclose = me.connectionClosed;
	};

	me.connectionOpen = function() {
		options.onopen(me);
	};

	me.connectionMessage = function(message) {
		options.onmessage(me, message.data);
	};

	me.connectionError = function() {
		options.onerror(me);
	};

	me.connectionClosed = function() {
		options.onerror(me);
	};

	me.send = function(s) {
		me.connection.send(JSON.stringify({b : s}));
	};

	return me;
};