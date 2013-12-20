var CameraHelper = function() {

	var me = this;


	me.init = function(player) {

		me.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 999999 );
		
		//Set the position relative to the player
		me.camera.position.set(
			player.object.p.x, 
			player.object.p.y + 200, 
			player.object.p.z - 2000);
		me.camera.lookAt(player.object.p);
	};
	var i = 0;
	me.update = function(player) {
		if(player.clientObject.mesh == null) return;

		var pos = new THREE.Vector3(0, 200, -2000);
		pos = player.clientObject.mesh.localToWorld(pos);
		me.camera.position.set(pos.x , pos.y, pos.z);

		me.camera.lookAt(player.object.p);

	}

	return me;

};