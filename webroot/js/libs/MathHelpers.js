

var MathHelpers = {
	VectorRotateX : function(v, angle) {
		var cosry = Math.cos(angle);
		var sinry = Math.sin(angle);
		return new THREE.Vector3(
			v.x,
			(v.y * cosry) - (v.z * sinry),
			(v.y * sinry) + (v.z * cosry),
		);
	},

	VectorRotateY : function(v, angle) {
		var cosry = Math.cos(angle);
		var sinry = Math.sin(angle);
		return new THREE.Vector3(
			(v.x * cosry) + (v.z * sinry),
			v.y,
			(-v.x * sinry) + (v.z * cosry),
		);
	},

	VectorRotateZ : function(v, angle) {
		var cosry = Math.cos(angle);
		var sinry = Math.sin(angle);
		return new THREE.Vector3(
			(v.x * cosry) - (v.y * sinry),
			(v.x * sinry) + (v.y * cosry),
			v.z,
		);
	}
};