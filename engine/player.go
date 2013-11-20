package engine

import (
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
	"time"
)

type Player struct {
	Position utils.Vector3 `json:"p"`
	Velocity utils.Vector3 `json:"v"`
	Active   bool
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
func (p *Player) Update(w *World, dt time.Duration) bool {
	p.Position = p.Position.Add(p.Velocity)
	return true
}

/*
	Implements interface WorldObject
*/
func (p *Player) GetPosition() utils.Vector3 {
	return p.Position
}

/*
	Implements interface WorldObject
*/
func (p *Player) GetId() string {
	return p.client.Id
}

/*
	Implements interface WorldObject
*/
func (p *Player) GetType() string {
	return "player"
}
