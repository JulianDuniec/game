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
			me.mesh.rotation.x = options.object.r.x;
			me.mesh.rotation.y = options.object.r.y;
			me.mesh.rotation.z = options.object.r.z;
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
			me.mesh.rotation.x = options.object.r.x;
			me.mesh.rotation.y = options.object.r.y;
			me.mesh.rotation.z = options.object.r.z;
		} else {
			//Calculate change in position
			var vel = new THREE.Vector3(options.object.v.x, options.object.v.y, options.object.v.z).multiplyScalar(diff);
			me.mesh.position = me.mesh.position.add(vel);
			
			//Calculate change in rotation
			var rotationVel = 
				new THREE.Vector3(options.object.rv.x, options.object.rv.y, options.object.rv.z).multiplyScalar(diff);
			var rotation = new THREE.Vector3(me.mesh.rotation.x, me.mesh.rotation.y, me.mesh.rotation.z);
			
			//Calculate the change in rotation
			var dr = rotation.add(rotationVel);
			me.mesh.rotation.x = dr.x;
			me.mesh.rotation.y = dr.y;
			me.mesh.rotation.z = dr.z;
		}
		me.lastRendered = new Date();
	}

	return me;
}