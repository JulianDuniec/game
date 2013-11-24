var TypeMap = {
	"001" : Player
};

var Renderer = function(options) {
	var me = this;

	me.init = function() {
		me.initScene();
		me.initRenderer();
		me.initSurroundings();
		me.initWorld();
		me.initCamera();
		me.animate();
	};

	me.initWorld = function() {
		for(key in me.world) {
			var o = me.world[key];
			me.add(o);
		}
	};

	me.initSurroundings = function() {
		// create the geometry sphere
		var geometry  = new THREE.SphereGeometry(999999, 32, 32)
		// create the material, using a texture of startfield
		var material  = new THREE.MeshBasicMaterial()
		material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
		material.side  = THREE.BackSide
		// create the mesh based on geometry and material
		var mesh  = new THREE.Mesh(geometry, material)
		me.scene.add(mesh);
		for(var i = 0; i < 100; i++) {
			cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
			cube.position.y = i * 250
			cube.position.z = i * 250
			cube.position.x = i * 250 * (i%2 == 0? -1 : 1)
			me.scene.add(cube);
		}
		
	};

	me.animate = function() {
		if(me.previousAnimateTime ==null)
			me.previousAnimateTime = new Date();
		var diff = (new Date().getTime() - me.previousAnimateTime.getTime()) / 1000;
		for(key in me.world) {
			var o = me.world[key];
			if(o.clientObject.mesh == null) {
				continue;
			}
			o.clientObject.update(diff, o);
			
		}
		me.previousAnimateTime = new Date();
		
		requestAnimationFrame(me.animate);

		me.updateCameraPosition();

		me.renderer.render( me.scene, me.camera );
	};

	me.delete = function(o) {
		me.scene.remove(o.clientObject.mesh)
	};

	me.add = function(o) {
		o.clientObject = new TypeMap[o.type](o);
		o.clientObject.createMesh(function() {
			console.log("Adding", o)
			me.scene.add( o.clientObject.mesh );
		});
		
	};


	me.initScene = function() {
		me.scene = new THREE.Scene();  		
	};

	me.initCamera = function() {
		me.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 99999999 );
		me.camera.position.set(
			me.player.object.p.x, 
			me.player.object.p.y, 
			me.player.object.p.z - 500);
	};

	me.updateCameraPosition = function() {
		if(me.player.clientObject.mesh == null) return;
		me.camera.position.set(
			me.player.clientObject.mesh.position.x, 
			me.player.clientObject.mesh.position.y, 
			me.player.clientObject.mesh.position.z - 500);
		me.camera.useQuaternion = true;
		me.camera.lookAt(me.player.clientObject.mesh.position);
	};

	me.initRenderer = function() {
		me.renderer = new THREE.CanvasRenderer();
		me.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( me.renderer.domElement );
    	me.renderer.setClearColorHex(0x333F47, 1);
	};

	return me;
};

