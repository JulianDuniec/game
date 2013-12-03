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
		var geometry  = new THREE.SphereGeometry(99999, 32, 32)
		// create the material, using a texture of startfield
		var material  = new THREE.MeshBasicMaterial()
		material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
		material.side  = THREE.BackSide
		// create the mesh based on geometry and material
		var mesh  = new THREE.Mesh(geometry, material)
		me.scene.add(mesh);
		for(var i = 1; i < 20; i++) {
			for(var j = 0; j < 5; j++) {
				for(var k = 0; k < 5; k++) {
					cube = new THREE.Mesh( new THREE.CubeGeometry( 30+i, 30+i, 30+i ), new THREE.MeshNormalMaterial() );
					cube.position.y = k * 950 - 1000
					cube.position.z = i * 950 - 1000
					cube.position.x = j * 950 - 1000
					me.scene.add(cube);
				}
			
			}
			
		}
		
	};

	me.animate = function() {
		if(me.previousAnimateTime ==null)
			me.previousAnimateTime = new Date();
		var diff = (new Date().getTime() - me.previousAnimateTime.getTime()) / 1000;
		
		me.onAnimate && me.onAnimate();

		//Update all objects in world
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
			me.player.object.p.y + 100, 
			me.player.object.p.z - 1000);
		var pr = new THREE.Euler(
			me.player.object.r.x, 
			me.player.object.r.y + Math.PI, 
			-me.player.object.r.z, 
			"XYZ");
		var pq = new THREE.Quaternion();
		pq.setFromEuler(pr)
        me.camera.quaternion = pq; 
	};

	me.updateCameraPosition = function() {
		if(me.player.clientObject.mesh == null) return;

		var pos = new THREE.Vector3(0, 0, -2000);
		pos = me.player.clientObject.mesh.localToWorld(pos);
		me.camera.position.set(pos.x, pos.y, pos.z);

		var pr = new THREE.Euler(
			me.player.clientObject.mesh.rotation.x, 
			me.player.clientObject.mesh.rotation.y + Math.PI, 
			-me.player.clientObject.mesh.rotation.z, 
			me.player.clientObject.mesh.rotation.order);

		
		var pq = new THREE.Quaternion();
		pq.setFromEuler(pr)
		var newQuaternion = new THREE.Quaternion();
        THREE.Quaternion.slerp(me.camera.quaternion, pq, newQuaternion, 0.1);
        newQuaternion.normalize()
        me.camera.quaternion = newQuaternion; 
	};

	me.initRenderer = function() {
		me.renderer = new THREE.CanvasRenderer();
		me.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( me.renderer.domElement );
    	me.renderer.setClearColorHex(0x333F47, 1);
	};

	return me;
};

