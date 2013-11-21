var Renderer = function(options) {
	var me = this;

	me.init = function() {
		me.initCamera();
		me.initScene();
		me.cubeDebug();
		me.initRenderer();
		me.animate();
	};

	me.animate = function() {
		//TODO: Only if update, otherwise do 'prediction'
		for(key in me.world) {
			if(me.world[key].mesh == null) {
				continue;
			}
			me.world[key].mesh.position = me.world[key].object.p;
		}
		
		requestAnimationFrame(me.animate);
		me.renderer.render( me.scene, me.camera );
	};

	me.deleteMesh = function(id) {
		me.scene.remove(me.world[id].mesh)
	}

	me.cubeDebug = function() {
		// Cube
		for(key in me.world) {
			var geometry = new THREE.CubeGeometry( 200, 200, 200 );

			for ( var i = 0; i < geometry.faces.length; i += 2 ) {

				var hex = Math.random() * 0xffffff;
				geometry.faces[ i ].color.setHex( hex );
				geometry.faces[ i + 1 ].color.setHex( hex );

			}

			var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );

			cube = new THREE.Mesh( geometry, material );
			cube.position = me.world[key].object.p;
			me.scene.add( cube );
			me.world[key].mesh = cube;
		}
		
	};

	me.initScene = function() {
		me.scene = new THREE.Scene();		
	};

	me.initCamera = function() {
		me.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
		me.camera.position.y = 150;
		me.camera.position.z = 500;

	};

	me.initRenderer = function() {
		me.renderer = new THREE.CanvasRenderer();
		me.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( me.renderer.domElement );
	};

	return me;
};

