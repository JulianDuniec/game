var Renderer = function(options) {
	var me = this;

	me.init = function() {
		me.initCamera();
		me.initScene();
		me.initRenderer();
		me.initWorld();
		me.animate();
	};

	me.initWorld = function() {
		for(key in me.world) {
			var o = me.world[key];
			me.add(o);
		}
	}

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

	me.delete = function(o) {
		me.scene.remove(o.mesh)
	};

	me.add = function(o) {
		var geometry = new THREE.CubeGeometry( 200, 200, 200 );

		for ( var i = 0; i < geometry.faces.length; i += 2 ) {

			var hex = Math.random() * 0xffffff;
			geometry.faces[ i ].color.setHex( hex );
			geometry.faces[ i + 1 ].color.setHex( hex );

		}

		var material = new THREE.MeshBasicMaterial({color: 0x000000});
		cube = new THREE.Mesh( geometry, material );
		cube.position = o.object.p;
		me.scene.add( cube );
		o.mesh = cube;
	};

	me.initScene = function() {
		me.scene = new THREE.Scene();		
	};

	me.initCamera = function() {
		me.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
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

