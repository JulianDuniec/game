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

var messageParser = new MessageParser({});

var renderer = new Renderer({});

//Init game-engine.
//Game engine will be initialized once
//the client has sent the initial world state
var engine = new Engine({
	onInitialized : function() {
		renderer.world = engine.world;
		renderer.init();
	},

	onUpdate : function() {
		renderer.world = engine.world;
	},

	onDelete : function(id) {
		renderer.deleteMesh(id);
	}
});

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
