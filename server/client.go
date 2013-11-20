package server

import (
	"code.google.com/p/go.net/websocket"
	"github.com/julianduniec/game/utils"
	"log"
)

type Client struct {
	ws             *websocket.Conn
	server         *Server
	messageChannel chan *ServerMessage
	quitChannel    chan bool
	Id             string
	isWriting      bool
}

func NewClient(ws *websocket.Conn, server *Server) *Client {
	return &Client{
		ws,
		server,
		make(chan *ServerMessage),
		make(chan bool),
		utils.ID(),
		false,
	}
}

func (c *Client) Quit() {
	c.quitChannel <- true
}

func (c *Client) Write(msg *ServerMessage) {
	c.isWriting = true
	c.messageChannel <- msg
}

func (c *Client) WriteIfNotBusy(msg *ServerMessage) {
	if c.isWriting == true {
		log.Println("Can't write, busy")
		return
	}

	c.Write(msg)
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
			websocket.JSON.Send(c.ws, msg)
			c.isWriting = false
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
			if !c.receiveMessage() {
				//There was some error reading the message
				return
			}
		}
	}
}

func (c *Client) receiveMessage() bool {
	var msg ClientMessage
	err := websocket.JSON.Receive(c.ws, &msg)
	msg.Client = c
	if err != nil {
		log.Println("Client listen error", err.Error())
		c.Quit()
		return false
	}
	c.server.messages <- &msg
	return true
}
