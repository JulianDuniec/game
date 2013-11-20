package engine

import (
	"encoding/json"
)

func GetChangeMessage(c []WorldObject) string {
	return "s" + serializeWorldSyncObjects(c)
}

func GetInitMessage(w *World) string {
	return "i" + serializeWorldObjects(w.GetObjects())
}

func serializeWorldSyncObjects(c []WorldObject) string {
	s := ""
	for _, o := range c {
		//TODO: Handle error
		b, _ := json.Marshal(o.SyncObject())
		s += o.GetId() + string(b[:]) + "|"
	}
	return s
}

func serializeWorldObjects(c []WorldObject) string {
	s := ""
	for _, o := range c {
		//TODO: Handle error
		b, _ := json.Marshal(&o)
		s += o.GetId() + string(b[:]) + "|"
	}
	return s
}
