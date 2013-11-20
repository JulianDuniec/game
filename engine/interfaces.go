package engine

import (
	"github.com/julianduniec/game/utils"
	"time"
)

type WorldObject interface {
	Position() utils.Vector3
	Type() string
	Id() string
	/*
		Updates the state of the object
		Supplies the state of the world and 
		a number representing the change in time since
		last update
	*/
	Update(*World, time.Duration)
}
