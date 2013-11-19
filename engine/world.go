package engine

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
	w.objects[o.Id()] = o
}

func (w *World) Delete(o WorldObject) {
	delete(w.objects, o.Id())
}

func (w *World) Update() {
	for k := range w.objects {
		w.objects[k].Update(w)
	}
}
