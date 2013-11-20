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

func (w *World) GetObjects() []WorldObject {
	o := make([]WorldObject, len(w.objects))
	i := 0
	for _, v := range w.objects {
		o[i] = v
		i++
	}
	return o
}

func (w *World) Get(id string) WorldObject {
	return w.objects[id]
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
