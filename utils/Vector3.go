package utils

import (
	"math"
)

type Vector3 struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

func (v Vector3) Magnitude() float64 {
	return math.Sqrt(
		math.Pow(v.X, 2) + math.Pow(v.Y, 2) + math.Pow(v.Z, 2))
}

func (v Vector3) Add(other Vector3) Vector3 {
	return Vector3{
		v.X + other.X,
		v.Y + other.Y,
		v.Z + other.Z,
	}
}

func (v Vector3) Subtract(other Vector3) Vector3 {
	return Vector3{
		v.X - other.X,
		v.Y - other.Y,
		v.Z - other.Z,
	}
}

func (v Vector3) Multiply(other Vector3) Vector3 {
	return Vector3{
		v.X * other.X,
		v.Y * other.Y,
		v.Z * other.Z,
	}
}

func (v Vector3) Dot(other Vector3) float64 {
	return v.X*other.X + v.Y*other.Y + v.Z*other.Z
}

func (v Vector3) DistanceTo(other Vector3) float64 {
	return v.Subtract(other).Magnitude()
}

func (v Vector3) Normalize() Vector3 {
	length := v.Magnitude()
	if length == 0 {
		return v
	}
	return Vector3{
		v.X / length,
		v.Y / length,
		v.Z / length,
	}
}

func (v Vector3) ScalarMultiply(x float64) Vector3 {
	return Vector3{
		v.X * x,
		v.Y * x,
		v.Z * x,
	}
}

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
