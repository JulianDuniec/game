/*

func (v Vector3) RotateX(angle float64) Vector3 {
	cosRY := math.Cos(angle)
	sinRY := math.Sin(angle)
	return Vector3{
		v.X,
		(v.Y * cosRY) - (v.Z * sinRY),
		(v.Y * sinRY) + (v.Z * cosRY),
	}
}

func (v Vector3) RotateY(angle float64) Vector3 {
	cosRY := math.Cos(angle)
	sinRY := math.Sin(angle)
	return Vector3{
		(v.X * cosRY) + (v.Z * sinRY),
		v.Y,
		(-v.X * sinRY) + (v.Z * cosRY),
	}
}

func (v Vector3) RotateZ(angle float64) Vector3 {
	cosRY := math.Cos(angle)
	sinRY := math.Sin(angle)
	return Vector3{
		(v.X * cosRY) - (v.Y * sinRY),
		(v.X * sinRY) + (v.Y * cosRY),
		v.Z,
	}
}

*/

var MathHelpers = {
	VectorRotateX : function(v, angle) {
		var cosRY = Math.cos(angle);
		var sinRY = Math.sin(angle);
		return new THREE.Vector3(
			v.x,
			(v.y * cosRY) - (v.z * sinRY),
			(v.y * sinRY) + (v.z * cosRY)
		);
	},

	VectorRotateY : function(v, angle) {
		var cosRY = Math.cos(angle);
		var sinRY = Math.sin(angle);
		return new THREE.Vector3(
			(v.x * cosRY) + (v.z * sinRY),
			v.y,
			(-v.x * sinRY) + (v.z * cosRY)
		);
	},

	VectorRotateZ : function(v, angle) {
		var cosRY = Math.cos(angle);
		var sinRY = Math.sin(angle);
		return new THREE.Vector3(
			(v.x * cosRY) - (v.y * sinRY),
			(v.x * sinRY) + (v.y * cosRY),
			v.z
		);
	}
};