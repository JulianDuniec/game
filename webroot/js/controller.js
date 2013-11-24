var Controller = function(options) {
	var me = this;

	
	//Contains the current position of the mouse
	me.mouseX = window.innerWidth / 2;
	me.mouseY = window.innerWidth / 2;

	//Indicates whether the specified key was pressed
	me.spacePressed = false;

	

	me.init = function() {
		//Gather keyboard input
		window.onkeydown = function(e) {
			if(e.keyCode == 32) {
				me.spacePressed = true;
			}
		}; 

		//Reset key-controls
		window.onkeyup = function(e) {
			me.spacePressed = false;
		};

		window.onmousemove = function(e) {
			me.mouseX = e.clientX;
			me.mouseY = e.clientY;
		};
	};

	me.gather = function() {
		//Calculate X in relation to center of screen
		var dx = me.mouseX - (window.innerWidth / 2);
		var dy = me.mouseY - (window.innerHeight / 2);
		
		return {
			x : dx,
			y : dy,
			speedUp : me.spacePressed
		}
	};

	return me;
}