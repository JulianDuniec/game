var Map = function() {
	var me = this;
	me.generate = function() {
		var meshes = [];
		
		me.createSkySphere(meshes)
		me.createCubes(meshes)
		return meshes;
	};

	me.createCubes = function(meshes) {
		for(var i = 1; i < 20; i++) {
	            for(var j = 0; j < 5; j++) {
	                    for(var k = 0; k < 5; k++) {
	                            cube = new THREE.Mesh( new THREE.CubeGeometry( 30+i, 30+i, 30+i ), new THREE.MeshNormalMaterial() );
	                            cube.position.y = k * 950 - 1000
	                            cube.position.z = i * 950 - 1000
	                            cube.position.x = j * 950 - 1000
	                            meshes.push(cube);
	                    }
	            
	            }
	            
	    }
	}

	me.createSkySphere = function(meshes) {
		// create the geometry sphere
		var geometry  = new THREE.SphereGeometry(99999, 32, 32)
		// create the material, using a texture of startfield
		var material  = new THREE.MeshBasicMaterial()
		material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
		material.side  = THREE.BackSide
		// create the mesh based on geometry and material
		var mesh  = new THREE.Mesh(geometry, material)
		meshes.push(mesh);
	}

	return me;
}