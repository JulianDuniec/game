var Controller = function(options) {
	var me = this;

	
	//Indicates whether the specified key was pressed
	me.spacePressed 	= false;
	me.upPressed 		= false;
	me.downPressed 		= false;
	me.leftPressed 		= false;
	me.rightPressed	 	= false;

	

	me.init = function() {
		//Gather keyboard input
		window.onkeydown = function(e) {
			if(e.keyCode == 38) {
				me.upPressed = true;
			} else if(e.keyCode == 40) {
				me.downPressed = true;
			} else if(e.keyCode == 37) {
				me.leftPressed = true;
			} else if(e.keyCode == 39) {
				me.rightPressed = true;
			} else if(e.keyCode == 32) {
				me.spacePressed = true;
			}
		}; 

		//Reset key-controls
		window.onkeyup = function(e) {
			if(e.keyCode == 38) {
				me.upPressed = false;
			} else if(e.keyCode == 40) {
				me.downPressed = false;
			} else if(e.keyCode == 37) {
				me.leftPressed = false;
			} else if(e.keyCode == 39) {
				me.rightPressed = false;
			} else if(e.keyCode == 32) {
				me.spacePressed = false;
			}
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
			u : me.upPressed,
			d : me.downPressed,
			l : me.leftPressed,
			r : me.rightPressed,
			s : me.spacePressed
		};
	};

	return me;
}