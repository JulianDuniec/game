package engine

import (
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
)

type Player struct {
	position utils.Vector3
	velocity utils.Vector3
	client   *server.Client
}

func (p *Player) Update() {
	p.position = p.position.Add(p.velocity)
}
