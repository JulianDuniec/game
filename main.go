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

/*
	Main game server
*/
func webSocketServer() *server.Server {
	server := server.NewServer("/ws")
	go server.Listen()
	return server
}

/*
	Serves web-content (html/js-files)
*/
func fileServer() {
	http.Handle("/", http.FileServer(http.Dir("webroot")))

	log.Fatal(http.ListenAndServe(":1337", nil))

}
