package engine

import (
	"time"
)

var (
	maxObjects = 100000
)

type World struct {
	objects map[string]WorldObject
}

func CreateWorld() *World {
	return &World{
		make(map[string]WorldObject),
	}
}

func (w *World) Add(o WorldObject) {
	w.objects[o.GetId()] = o
}

func (w *World) Delete(o WorldObject) {
	delete(w.objects, o.GetId())
}

func (w *World) Update(dt time.Duration) []WorldObject {
	changes := make([]WorldObject, 0)
	for k := range w.objects {
		if w.objects[k].Update(w, dt) {
			changes = append(changes, w.objects[k])
		}
	}
	return changes
}
