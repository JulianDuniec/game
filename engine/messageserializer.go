package engine

import (
	"encoding/json"
)

func GetChangeMessage(c []WorldObject) string {
	return "s" + serializeWorldSyncObjects(c)
}

func GetDeleteMessage(id string) string {
	return "d" + id
}

func GetSingleObjectMessage(o WorldObject) string {
	wo := make([]WorldObject, 1)
	wo[0] = o
	return "n" + serializeWorldObjects(wo)
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
