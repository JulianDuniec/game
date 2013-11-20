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
	updateFrequencyMs = 1000
	updateFrequencyNs = int64(updateFrequencyMs * 1e6)
	//Used to calculate difference in
	//time between each loop, in order to
	//make the updates more correct, as we
	//use dynamic sleeps between cycles
	lastLoop = time.Now()

	//Used to print statistics about average
	//execution times
	totalExecutionTime = int64(0)
	totalCount         = int64(0)
	//Sample 'roughly' enaught samples for what should be
	//one second
	sampleRate = 1000 / updateFrequencyMs
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
	defer func() { lastLoop = time.Now() }()
	//Update the state of the world
	changes := ge.world.Update(dt)

	//Nothing changed...?
	if len(changes) == 0 {
		return
	}

	message := GetChangeMessage(changes)

	//Send the delta to all players
	for k := range ge.players {
		p := ge.players[k]
		if p.Active == true {
			p.client.WriteIfNotBusy(&server.ServerMessage{message})
		}
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
		diff := time.Duration(updateFrequencyNs - executionTime)
		//Sleep if there is time... otherwise,
		//Continue to try to keep up :P
		if diff > 0 {
			time.Sleep(diff)
		}
		ge.PrintRunStats(executionTime)
	}
}

func (ge *GameEngine) PrintRunStats(t int64) {
	totalExecutionTime += t
	totalCount++
	if totalCount%int64(sampleRate) == 0 {
		avg := totalExecutionTime / totalCount
		log.Println("AVGEX:",
			time.Duration(avg),
			"\tAVGSLEEP:",
			time.Duration(updateFrequencyNs-avg))
		totalExecutionTime = 0
		totalCount = 0
	}
}

/*
	Implements interface ServerListener
*/
func (ge *GameEngine) ClientConnected(c *server.Client) {
	p := ge.AddNewPlayer(c)
	log.Println("Added player", p, "sending state")
	ge.SendWorldState(p)
	p.Active = true
}

func (ge *GameEngine) SendWorldState(p *Player) {
	message := GetInitMessage(ge.world)
	p.client.WriteIfNotBusy(&server.ServerMessage{message})
}

func (ge *GameEngine) AddNewPlayer(c *server.Client) *Player {
	p := &Player{
		utils.Vector3{0, 0, 0},
		utils.Vector3{0.1, 0, 0},
		"Guest",
		false, //Inactive at first
		c,
	}
	ge.players[p.client.Id] = p
	ge.world.Add(p)
	return p
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
