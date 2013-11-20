package engine

import (
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
	"log"
	"time"
)

var (
	maxNumPlayers = 10000
	//Minimum nanoseconds between updates
	updateFrequencyNs = int64(1000 * 1e6)
	//Used to calculate difference in
	//time between each loop, in order to
	//make the updates more correct, as we
	//use dynamic sleeps between cycles
	lastLoop = time.Now()
)

type GameEngine struct {
	server  *server.Server
	players map[string]*Player
	world   *World
}

/*
	Factory for GameEngine
	Initializes world and player-lists

	Binds the game-engine to server events (client connect/disconnect and messages)
*/
func CreateGameEngine(server *server.Server) *GameEngine {
	ge := &GameEngine{
		server,
		make(map[string]*Player),
		CreateWorld(),
	}
	ge.server.AddListener(ge)
	return ge
}

/*
	Main game cycle
*/
func (ge *GameEngine) Loop() {
	dt := time.Now().Sub(lastLoop)
	//Update the state of the world
	ge.world.Update(dt)

	//Send the delta to all players
	for k := range ge.players {
		p := ge.players[k]
		log.Println(p)
		go p.client.Write(&server.ServerMessage{"Poop"})
	}
	lastLoop = time.Now()
}

func (ge *GameEngine) Run() {
	for {
		//'Friendly' interval based execution,
		//where we allow the update to take longer than the updateFrequency
		//by dynamic sleep
		start := time.Now()

		//Executes the game-loop
		ge.Loop()

		executionTime := time.Now().Sub(start).Nanoseconds()
		diff := time.Duration(updateFrequencyNs - executionTime)
		//Sleep if there is time... otherwise, 
		//Continue to try to keep up :P
		if diff > 0 {
			time.Sleep(diff)
		}
	}
}

/*
	Implements interface ServerListener
*/
func (ge *GameEngine) ClientConnected(c *server.Client) {
	p := &Player{
		utils.Vector3{0, 0, 0},
		utils.Vector3{0.1, 0, 0},
		c,
	}
	ge.players[p.client.Id] = p
	ge.world.Add(p)
	log.Println("Added player", p)
}

/*
	Implements interface ServerListener
*/
func (ge *GameEngine) ClientDisconnected(c *server.Client) {
	p := ge.players[c.Id]
	log.Println("Removing player")
	delete(ge.players, c.Id)
	ge.world.Delete(p)
}

/*
	Implements interface ServerListener
*/
func (ge *GameEngine) MessageReceived(m *server.ClientMessage) {
	log.Println("Got message from player", ge.players[m.Client.Id])
	ge.players[m.Client.Id].ReactToMessage(m)
}
