var Controller = function(options) {
	var me = this;

	me.player = options.player;
	me.engine = options.engine;
	
	me.spacePressed = false;

	window.onkeydown = function(e) {
		if(e.keyCode == 32) {
			me.spacePressed = true;
		}
	}; 

	window.onkeyup = function(e) {
		me.spacePressed = false;
	};

	window.onmousemove = function(e) {
		me.mouseX = e.clientX;
		me.mouseY = e.clientY;
	};

	me.init = function() {

	};

	me.gather = function() {
		if(me.player.clientObject.mesh == null) return;
		//Calculate X in relation to center of screen
		var dx = me.mouseX - (window.innerWidth / 2);
		var dy = me.mouseY - (window.innerHeight / 2);
		
		var playerPos = new THREE.Vector3(
			me.player.object.p.x,
			me.player.object.p.y,
			me.player.object.p.z);

		//Create a position in 3D where the mouse is 'pointing'
		var point = new THREE.Vector3(
			me.player.object.p.x - dx,
			me.player.object.p.y - dy,
			me.player.object.p.z + 500);

		me.player.clientObject.mesh.lookAt(point);
	};

	return me;
}