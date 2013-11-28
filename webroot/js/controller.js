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
			//A
			if(e.keyCode == 65) {
				me.leftPressed = true;
			} 
			//D
			else if(e.keyCode == 68) {
				me.rightPressed = true;
			} 
			//Space
			else if(e.keyCode == 32) {
				me.spacePressed = true;
			}
		}; 

		//Reset key-controls
		window.onkeyup = function(e) {
			if(e.keyCode == 65) {
				me.leftPressed = false;
			} else if(e.keyCode == 68) {
				me.rightPressed = false;
			} else if(e.keyCode == 32) {
				me.spacePressed = false;
			}
		};

		window.onmousemove = function(e) {
			me.mouseX = Math.round(e.clientX/5) * 5;
			me.mouseY = Math.round(e.clientY/5) * 5;
		};
	};

	me.gather = function() {
		//Calculate X in relation to center of screen
		var dx = me.mouseX - (window.innerWidth / 2);
		var dy = me.mouseY - (window.innerHeight / 2);
		
		return {
			x : dx,
			y : dy,
			l : me.leftPressed,
			r : me.rightPressed,
			s : me.spacePressed
		};
	};

	return me;
}