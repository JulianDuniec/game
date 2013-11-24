package engine

import (
	"encoding/json"
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
	"log"
	"time"
)

type Input struct {
	TargetX float64 `json:"x"`
	TargetY float64 `json:"y"`
	SpeedUp bool    `json:"speedUp"`
}

type Player struct {
	Position         utils.Vector3 `json:"p"`
	Velocity         utils.Vector3 `json:"v"`
	Rotation         utils.Vector3 `json:"r"`
	RotationVelocity utils.Vector3 `json:"rv"`
	Active           bool
	client           *server.Client
	input            Input
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
	var input Input
	err := json.Unmarshal([]byte(s), &input)
	if err != nil {
		log.Println("Error message " + s)
		return
	}
	p.input = input
}

/*
	Implements interface WorldObject
*/
func (p *Player) Update(w *World, dt time.Duration) bool {
	if !p.Active {
		return false
	}
	if p.input.SpeedUp {
		log.Println("Speeding up")
		p.Velocity.Z += 5
	} else if p.Velocity.Z >= 0 {
		p.Velocity.Z -= 5
	}
	//We calculate the velocity in relation to the
	//difference in time to make it accurate independent on
	//different update frequencies
	effectiveVelocity := p.Velocity.ScalarMultiply(dt.Seconds())

	p.Position = p.Position.Add(effectiveVelocity)

	effectiveRotationVelocity := p.RotationVelocity.ScalarMultiply(dt.Seconds())
	p.Rotation = p.Rotation.Add(effectiveRotationVelocity)

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
