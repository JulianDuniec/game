package main

import (
	"github.com/julianduniec/game/engine"
	"github.com/julianduniec/game/server"
	"log"
	"net/http"
)

func main() {
	gameEngine()
	webSocketServer()
	fileServer()
}

func gameEngine() {
	engine.CreateGameEngine()
}

func webSocketServer() {
	server := server.NewServer("/ws")
	go server.Listen()
}

func fileServer() {
	log.Println("Starting file server")

	//Setup file-server
	http.Handle("/", http.FileServer(http.Dir("webroot")))

	log.Fatal(http.ListenAndServe(":1337", nil))

}
