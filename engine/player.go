package engine

import (
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
	"time"
)

type Player struct {
	position utils.Vector3
	velocity utils.Vector3
	client   *server.Client
}

/*
	Handle any user input
*/
func (p *Player) ReactToMessage(m *server.ClientMessage) {

}

/*
	Implements interface WorldObject
*/
func (p *Player) Update(w *World, dt time.Duration) {
	p.position = p.position.Add(p.velocity)
}

/*
	Implements interface WorldObject
*/
func (p *Player) Position() utils.Vector3 {
	return p.position
}

/*
	Implements interface WorldObject
*/
func (p *Player) Id() string {
	return p.client.Id
}

/*
	Implements interface WorldObject
*/
func (p *Player) Type() string {
	return "player"
}
