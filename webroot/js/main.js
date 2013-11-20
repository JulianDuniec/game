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
	},
	onerror : function(client) {
		document.getElementsByTagName("body")[0].innerHTML = "THERE WAS AN ERROR THERE WAS!"
	}
});

client.init();






/******* DEBUGUTILS **********/
/*
	Send anything to server...
*/
document.getElementById("send").addEventListener("click", function() {
	client.send(document.getElementById("message").value)
})


function log(s) {
	s = s + "<br />" + document.getElementById("log").innerHTML;
	s = s.substring(0, 200);
	document.getElementById("log").innerHTML = s;
}