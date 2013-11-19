package server

import (
	"code.google.com/p/go.net/websocket"
	"io"
	"log"
)

type Client struct {
	ws             *websocket.Conn
	server         *Server
	messageChannel chan *Message
	quitChannel    chan bool
}

func NewClient(ws *websocket.Conn, server *Server) *Client {
	return &Client{
		ws,
		server,
		make(chan *Message),
		make(chan bool),
	}
}

func (c *Client) Quit() {
	c.quitChannel <- true
}

func (c *Client) Write(msg *Message) {
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
		case msg := <-c.messageChannel:
			log.Println("Sending message to client")
			websocket.JSON.Send(c.ws, msg)
		case <-c.quitChannel:
			return
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
			var msg Message
			err := websocket.JSON.Receive(c.ws, &msg)
			if err == io.EOF {
				log.Println("Client listen eof")
				c.Quit()
			} else if err != nil {
				log.Println("Client listen error", err.Error())
				c.Quit()
			} else {
				c.server.ReceiveMessage(c, &msg)
				c.Write(&Message{"Hello Client!"})
			}
		}
	}
}
