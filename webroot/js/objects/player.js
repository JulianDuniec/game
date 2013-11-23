var Player = function(options) {
	var me = this;
	me.createMesh = function() {
		var geometry = new THREE.CubeGeometry( 200, 200, 200 );
      	var material = new THREE.MeshLambertMaterial({color: 0x55B663});
		cube = new THREE.Mesh( geometry, material );
		cube.position = options.object.p;
		me.mesh = cube;
	};

	me.update = function(diff, o) {
		options = o;
		if (me.lastRendered == null || me.lastRendered < me.latestSync) {
			me.mesh.position = new THREE.Vector3(options.object.p.x, options.object.p.y, options.object.p.z);
		} else {
			var vel = new THREE.Vector3(options.object.v.x, options.object.v.y, options.object.v.z);
			vel = vel.multiplyScalar(diff);
			me.mesh.position = me.mesh.position.add(vel)
		}
		me.lastRendered = new Date();
	}

	return me;
}