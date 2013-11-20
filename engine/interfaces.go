package engine

import (
	"github.com/julianduniec/game/utils"
	"time"
)

type WorldObject interface {
	GetPosition() utils.Vector3
	GetType() string
	GetId() string
	/*
		Updates the state of the object
		Supplies the state of the world and
		a number representing the change in time since
		last update

		Returns true if any change was made
	*/
	Update(*World, time.Duration) bool
	SyncObject() interface{}
}
