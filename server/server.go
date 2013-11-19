package server

import (
	"code.google.com/p/go.net/websocket"
	"log"
	"net/http"
)

type Server struct {
	//What pattern to listen to (ex. /entrypoint)
	pattern     string
	quitChannel chan bool
}

func NewServer(pattern string) *Server {
	return &Server{
		pattern,
		make(chan bool),
	}
}

func (s *Server) Listen() {
	log.Println("Staring websocket server")

	http.Handle(s.pattern, websocket.Handler(s.OnClientConnected))
	s.handleChannels()
}

func (s *Server) OnClientConnected(ws *websocket.Conn) {
	defer func() {
		err := ws.Close()
		if err != nil {
			log.Println("Error:", err.Error())
		}
	}()

	client := NewClient(ws, s)
	client.Listen()
}

func (s *Server) handleChannels() {
	for {
		select {
		case <-s.quitChannel:
			log.Println("Server got quit message")
			return
		}
	}
}

func (s *Server) ReceiveMessage(c *Client, m *ClientMessage) {
	log.Println("Got message", m, c)
}
