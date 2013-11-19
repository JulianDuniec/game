
function log(s) {
	s = s + "<br />" + document.getElementById("log").innerHTML;
	s = s.substring(0, 200);
	document.getElementById("log").innerHTML = s;
}

var client = new Client({
	onmessage : function(client, s) {
		log(s);
	},
	onopen : function(client) {
		client.send("Hello")
	},
	onerror : function(client) {
		alert("THERE WAS ERROR AND SERIOUS IS WAS!")
	}

});
client.init();

/*
	Send anything to server...
*/
document.getElementById("send").addEventListener("click", function() {
	client.send(document.getElementById("message").value)
})