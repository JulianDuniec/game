package engine

import (
	"github.com/julianduniec/game/utils"
)

type WorldObject interface {
	Position() utils.Vector3
	Type() string
	Id() string
	Update(*World)
}
