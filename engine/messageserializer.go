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
	return "n" + serializeWorldObject(o)
}

func GetInitMessage(w *World) string {
	return "i" + serializeWorldObjects(w.GetObjects())
}

func serializeWorldSyncObjects(c []WorldObject) string {
	s := ""
	for _, o := range c {
		//TODO: Handle error
		b, _ := json.Marshal(o.SyncObject())
		s += o.GetId() + o.GetType() + string(b[:]) + "|"
	}
	return s
}

func serializeWorldObjects(c []WorldObject) string {
	s := ""
	for _, o := range c {
		//TODO: Handle error
		s += serializeWorldObject(o) + "|"
	}
	return s
}

func serializeWorldObject(wo WorldObject) string {
	b, _ := json.Marshal(&wo)
	return wo.GetId() + wo.GetType() + string(b[:])
}
