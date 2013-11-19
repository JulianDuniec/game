package server

import (
	"code.google.com/p/go.net/websocket"
	"log"
	"net/http"
)

type ServerListener interface {
	ClientConnected(*Client)
	ClientDisconnected(*Client)
	MessageReceived(*ClientMessage)
}

type Server struct {
	//What pattern to listen to (ex. /entrypoint)
	pattern     string
	quitChannel chan bool
	messages    chan *ClientMessage
	listeners   []ServerListener
}

func NewServer(pattern string) *Server {
	return &Server{
		pattern,
		make(chan bool),
		make(chan *ClientMessage),
		make([]ServerListener, 0, 1000),
	}
}

func (s *Server) Listen() {
	http.Handle(s.pattern, websocket.Handler(s.OnClientConnected))
	s.handleChannels()
}

func (s *Server) AddListener(l ServerListener) {
	s.listeners = append(s.listeners, l)
}

func (s *Server) OnClientConnected(ws *websocket.Conn) {
	defer func() {
		err := ws.Close()
		if err != nil {
			log.Println("Error:", err.Error())
		}
	}()

	client := NewClient(ws, s)
	/*
		Publish event -> a client has connected
	*/
	for _, l := range s.listeners {
		go l.ClientConnected(client)
	}

	client.Listen()

	/*
		Publish event -> a client has disconnected
	*/
	for _, l := range s.listeners {
		go l.ClientDisconnected(client)
	}
}

func (s *Server) handleChannels() {
	for {
		select {
		case <-s.quitChannel:
			return
		case m := <-s.messages:
			s.handleMessage(m)
		}
	}
}

func (s *Server) handleMessage(m *ClientMessage) {
	for _, l := range s.listeners {
		go l.MessageReceived(m)
	}
}
