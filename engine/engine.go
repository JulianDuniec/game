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
	updateFrequencyMs = 100
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
}

/*
	Sends the entire world state to a player,
	used to initialize world
*/
func (ge *GameEngine) SendWorldState(p *Player) {
	message := GetInitMessage(ge.world)
	p.client.Write(&server.ServerMessage{message})
}

/*
	Sends a single world object to a player,
	used when a sync is sent to a player, that the
	player has not seen before (ex. when new objects appear)
*/
func (ge *GameEngine) SendSingle(p *Player, id string) {
	o := ge.world.Get(id)
	if o == nil {
		//Object does not exist
		return
	}
	message := GetSingleObjectMessage(o)
	p.client.Write(&server.ServerMessage{message})
}

func (ge *GameEngine) AddNewPlayer(c *server.Client) *Player {
	p := &Player{
		utils.Vector3{0, 0, 0},
		utils.Vector3{10, 0, 0.1},
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
	ge.Delete(p.GetId())

}

func (ge *GameEngine) Delete(id string) {
	delete(ge.players, id)
	ge.world.Delete(id)
	message := GetDeleteMessage(id)
	for k := range ge.players {
		p := ge.players[k]
		p.client.Write(&server.ServerMessage{message})
	}
}

/*
	Implements interface ServerListener
*/
func (ge *GameEngine) MessageReceived(m *server.ClientMessage) {
	p := ge.players[m.Client.Id]
	if len(m.Body) < 1 {
		log.Println("Got invalid message from ", p.GetId())
		return
	}
	log.Println("Got message from player", p.GetId())
	t := m.Body[0:1]
	b := m.Body[1:]

	//Client want's to be active
	if t == "a" {
		p.Active = true
		log.Println("Activating player", p.GetId())
	}
	//Client requests an object that
	//it has not seen
	if t == "n" {
		ge.SendSingle(p, b)
		return
	}
	//Client sends input
	if t == "i" {
		p.ReactToMessage(b)
		return
	}
}
