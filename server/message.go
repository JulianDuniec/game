package server

type Message struct {
	Body string `json:"body"`
}

func (m *Message) String() string {
	return m.Body
}
