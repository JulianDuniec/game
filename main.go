package main

import (
	"github.com/julianduniec/game/engine"
	"github.com/julianduniec/game/server"
	"log"
	"net/http"
)

func main() {

	gameEngine(
		webSocketServer())
	fileServer()
}

func gameEngine(s *server.Server) {
	e := engine.CreateGameEngine(s)
	go e.Run()
}

func webSocketServer() *server.Server {
	server := server.NewServer("/ws")
	go server.Listen()
	return server
}

func fileServer() {
	//Setup file-server
	http.Handle("/", http.FileServer(http.Dir("webroot")))

	log.Fatal(http.ListenAndServe(":1337", nil))

}
