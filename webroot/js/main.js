/*
	Synopsis
	1) Create a connection to server
	2) Initialize game state and continously fetch data
	3) Initialize renderer and bind to game state
	4) Initialize input controller and bind to client and game state
	5) Run game loop
*/


/*
	Initializes a client and blocks until the connection is open
*/
var engine = new Engine({});
var messageParser = new MessageParser({});
var client = new Client({
	onmessage : function(client, s) {
		/*
			Game state sent to engine
		*/
		
		engine.receiveMessage(messageParser.parse(s));
	},
	onopen : function(client) {
		log("Connection open")
		engine.client = client;
	},
	onerror : function(client) {
		document.getElementsByTagName("body")[0].innerHTML = "THERE WAS AN ERROR THERE WAS!"
	}
});

client.init();






/******* DEBUGUTILS **********/
function log() {
	console.log(arguments)
}

function dumpWorld(o) {
	log(o)
	var c, r, t;
    t = document.createElement('table');
	for(k in o) {
		r = t.insertRow(0);
		c = r.insertCell(0)
		c.innerHTML = k;
		c = r.insertCell(1)
		c.innerHTML = JSON.stringify(o[k].object.p.x)
		c = r.insertCell(1)
		c.innerHTML = JSON.stringify(o[k].object.p.y)
		c = r.insertCell(1)
		c.innerHTML = JSON.stringify(o[k].object.p.z)
	}
	document.getElementsByTagName("body")[0].innerHTML = ""
	document.getElementsByTagName("body")[0].appendChild(t);
}