package engine

import (
	"github.com/julianduniec/game/server"
	"github.com/julianduniec/game/utils"
	"log"
	"time"
)

var (
	maxNumPlayers     = 10000
	updateFrequencyNs = int64(1000 * 1e6)
)

type GameEngine struct {
	server  *server.Server
	players map[string]*Player
	world   *World
}

func CreateGameEngine(server *server.Server) *GameEngine {
	ge := &GameEngine{
		server,
		make(map[string]*Player),
		CreateWorld(),
	}
	ge.Init()
	return ge
}

func (ge *GameEngine) Init() {
	ge.server.AddListener(ge)
}

/*
	Main game cycle
*/
func (ge *GameEngine) Loop() {
	ge.world.Update()

	//Send the delta to all players
	for k := range ge.players {
		p := ge.players[k]
		log.Println(p)
		go p.client.Write(&server.ServerMessage{"Poop"})
	}
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
		time.Sleep(
			time.Duration(updateFrequencyNs - executionTime))
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

func (ge *GameEngine) ClientDisconnected(c *server.Client) {
	p := ge.players[c.Id]
	log.Println("Removing player")
	delete(ge.players, c.Id)
	ge.world.Delete(p)
}

func (ge *GameEngine) MessageReceived(m *server.ClientMessage) {
	log.Println("Got message from player", ge.players[m.Client.Id])
}
