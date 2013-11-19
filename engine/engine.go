package engine

var (
	maxNumPlayers = 10000
)

type GameEngine struct {
	players []*Player
}

func CreateGameEngine() *GameEngine {
	return &GameEngine{
		make([]*Player, 0, maxNumPlayers),
	}
}
