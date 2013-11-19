package utils

import (
	"math"
)

type Vector3 struct {
	x, y, z float64
}

func (v Vector3) magnitude() float64 {
	return math.Sqrt(
		math.Pow(v.x, 2) + math.Pow(v.y, 2) + math.Pow(v.z, 2))
}

func (v Vector3) add(other Vector3) Vector3 {
	return Vector3{
		v.x + other.x,
		v.y + other.y,
		v.z + other.z,
	}
}

func (v Vector3) subtract(other Vector3) Vector3 {
	return Vector3{
		v.x - other.x,
		v.y - other.y,
		v.z - other.z,
	}
}

func (v Vector3) multiply(other Vector3) Vector3 {
	return Vector3{
		v.x * other.x,
		v.y * other.y,
		v.z * other.z,
	}
}

func (v Vector3) dot(other Vector3) float64 {
	return v.x*other.x + v.y*other.y + v.z*other.z
}

func (v Vector3) distanceTo(other Vector3) float64 {
	return v.subtract(other).magnitude()
}

func (v Vector3) normalize() Vector3 {
	length := v.magnitude()
	if length == 0 {
		return v
	}
	return Vector3{
		v.x / length,
		v.y / length,
		v.z / length,
	}
}

func (v Vector3) rotateX(angle float64) Vector3 {
	cosRY := math.Cos(angle)
	sinRY := math.Sin(angle)
	return Vector3{
		v.x,
		(v.y * cosRY) + (v.z * sinRY),
		(v.z * -sinRY) + (v.z * cosRY),
	}
}

func (v Vector3) rotateY(angle float64) Vector3 {
	cosRY := math.Cos(angle)
	sinRY := math.Sin(angle)
	return Vector3{
		(v.x * cosRY) + (v.z * sinRY),
		v.y,
		(v.z * -sinRY) + (v.z * cosRY),
	}
}
