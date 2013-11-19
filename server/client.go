package server

import (
	"code.google.com/p/go.net/websocket"
	"github.com/julianduniec/game/utils"
	"io"
	"log"
)

type Client struct {
	ws             *websocket.Conn
	server         *Server
	messageChannel chan *ServerMessage
	quitChannel    chan bool
	id             string
}

func NewClient(ws *websocket.Conn, server *Server) *Client {
	return &Client{
		ws,
		server,
		make(chan *ServerMessage),
		make(chan bool),
		utils.UUID(),
	}
}

func (c *Client) Quit() {
	c.quitChannel <- true
}

func (c *Client) Write(msg *ServerMessage) {
	c.messageChannel <- msg
}

func (c *Client) Listen() {
	go c.listenWrite()
	c.listenRead()
}

func (c *Client) listenWrite() {
	log.Println("Listening to write to client")
	for {
		select {
		case <-c.quitChannel:
			return
		case msg := <-c.messageChannel:
			log.Println("Sending message to client")
			websocket.JSON.Send(c.ws, msg)
		}
	}
}

func (c *Client) listenRead() {
	log.Println("Listening to read from client")
	for {
		select {
		case <-c.quitChannel:
			return
		default:
			c.receiveMessage()
		}
	}
}

func (c *Client) receiveMessage() {
	var msg ClientMessage
	err := websocket.JSON.Receive(c.ws, &msg)
	msg.ClientId = c.id
	if err == io.EOF {
		log.Println("Client listen eof")
		c.Quit()
	} else if err != nil {
		log.Println("Client listen error", err.Error())
		c.Quit()
	} else {
		c.server.ReceiveMessage(c, &msg)
		c.Write(&ServerMessage{"Hello Client!"})
	}
}
