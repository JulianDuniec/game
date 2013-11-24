var TypeMap = {
	"001" : Player
};

var Renderer = function(options) {
	var me = this;

	me.init = function() {
		me.initCamera();
		me.initScene();
		me.initRenderer();
		me.initSurroundings();
		me.initWorld();
		me.animate();
	};

	me.initWorld = function() {
		for(key in me.world) {
			var o = me.world[key];
			me.add(o);
		}
	};

	me.initSurroundings = function() {
		var light = new THREE.PointLight(0xffffff);
		light.position.set(0,0,100);
		me.scene.add(light);
		var ambientLight	= new THREE.AmbientLight( 0xff0000 )
		me.scene.add( ambientLight )

		// create the geometry sphere
		var geometry  = new THREE.SphereGeometry(99999, 32, 32)
		// create the material, using a texture of startfield
		var material  = new THREE.MeshBasicMaterial()
		material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
		material.side  = THREE.BackSide
		// create the mesh based on geometry and material
		var mesh  = new THREE.Mesh(geometry, material)
		me.scene.add(mesh);
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
		me.camera.position.y = 150;
		me.camera.position.z = 500;
	};

	me.initRenderer = function() {
		me.renderer = new THREE.CanvasRenderer();
		me.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( me.renderer.domElement );
    	me.renderer.setClearColorHex(0x333F47, 1);
	};

	return me;
};

