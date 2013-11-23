package engine

import (
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
	"math/rand"
	"time"
)

type Player struct {
	Position utils.Vector3 `json:"p"`
	Velocity utils.Vector3 `json:"v"`
	Active   bool
	client   *server.Client
}

/*
	A Subset of the fields that we use
	to sync updates to client
*/
type PlayerSync struct {
	Position utils.Vector3 `json:"p"`
	Velocity utils.Vector3 `json:"v"`
}

/*
	Handle any user input
*/
func (p *Player) ReactToMessage(s string) {

}

/*
	Implements interface WorldObject
*/
func (p *Player) Update(w *World, dt time.Duration) bool {
	if rand.Float64() > 0.99 {
		vx := (rand.Float64() * 100) - 50
		vy := (rand.Float64() * 100) - 50
		vz := (rand.Float64() * 100) - 50
		p.Velocity = utils.Vector3{vx, vy, vz}
	}

	//We calculate the velocity in relation to the
	//difference in time to make it accurate independent on
	//different update frequencies
	effectiveVelocity := p.Velocity.ScalarMultiply(dt.Seconds())

	p.Position = p.Position.Add(effectiveVelocity)

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
	return "001"
}

func (p *Player) SyncObject() interface{} {
	return PlayerSync{
		p.Position,
		p.Velocity,
	}
}
