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

func (p *Player) Update(w *World) {
	p.position = p.position.Add(p.velocity)
}

func (p *Player) Position() utils.Vector3 {
	return p.position
}

func (p *Player) Id() string {
	return p.client.Id
}

func (p *Player) Type() string {
	return "player"
}
