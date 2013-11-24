var Player = function(options) {
	var me = this;
	me.createMesh = function(callback) {
		var loader	= new THREE.OBJMTLLoader();
		loader.addEventListener('load', function( event ){
			var object3d	= event.content
			// change emissive color of all object3d material - they are too dark
			object3d.traverse(function(object3d){
				if( object3d.material ){
					object3d.material.emissive.set('white')
				}
			})
			me.mesh = object3d;
			me.mesh.position = new THREE.Vector3(options.object.p.x, options.object.p.y, options.object.p.z);
			callback();
		});

		var objUrl	= 'js/models/SpaceFighter02/SpaceFighter02.obj';
		var mtlUrl	= 'js/models/SpaceFighter02/SpaceFighter02.mtl';
		loader.load(objUrl, mtlUrl);	
	};

	me.update = function(diff, o) {
		options = o;
		if (me.lastRendered == null || me.lastRendered < me.latestSync) {
			me.mesh.position = new THREE.Vector3(options.object.p.x, options.object.p.y, options.object.p.z);
		} else {
			var vel = new THREE.Vector3(options.object.v.x, options.object.v.y, options.object.v.z);
			vel = vel.multiplyScalar(diff);
			me.mesh.position = me.mesh.position.add(vel);
			me.mesh.rotation.x += 0.01;
			me.mesh.rotation.y += 0.01;
			me.mesh.rotation.z += 0.01;
		}
		me.lastRendered = new Date();
	}

	return me;
}