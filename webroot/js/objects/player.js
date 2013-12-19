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
		var name = "SpaceFighter02";
		var objUrl	= 'js/models/'+name+'/'+name+'.obj';
		var mtlUrl	= 'js/models/'+name+'/'+name+'.mtl';
		loader.load(objUrl, mtlUrl);	
	};

	me.update = function(diff, o) {
		options = o;
		if (me.lastRendered == null || me.previousSync == null || me.previousSync < me.latestSync) {
			me.mesh.position = new THREE.Vector3(options.object.p.x, options.object.p.y, options.object.p.z);
			
			me.previousSync = me.latestSync;
		} else {
			//Calculate change in position
			var vel = new THREE.Vector3(options.object.v.x, options.object.v.y, options.object.v.z).multiplyScalar(diff);
			vel.x = MathHelpers.VectorRotateX(vel.x, me.mesh.rotation.x);
			vel.x = MathHelpers.VectorRotateY(vel.y, me.mesh.rotation.y);
			vel.x = MathHelpers.VectorRotateZ(vel.z, me.mesh.rotation.z);
			me.mesh.position = me.mesh.position.add(vel);
		}
		me.lastRendered = new Date();
	};

	return me;
}