package engine

import (
	"github.com/julianduniec/game/utils"
	"time"
)

type WorldObject interface {
	/*
		Used for spatial indexing of objects (Not implemented though)
	*/
	GetPosition() utils.Vector3

	GetType() string

	/*
		Unique identifier of object
	*/
	GetId() string

	/*
		Updates the state of the object
		Supplies the state of the world and
		a number representing the change in time since
		last update

		Returns true if any change was made
	*/
	Update(*World, time.Duration) bool

	/*
		The object to be returned to client
		indicating changes, as we don't want to send the entire object
	*/
	SyncObject() interface{}
}
