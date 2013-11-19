package server

type ClientMessage struct {
	ClientId string
	Body     string `json:"body"`
}

func (m *ClientMessage) String() string {
	return m.ClientId + " -> " + m.Body
}

type ServerMessage struct {
	Body string `json:"body"`
}

func (m *ServerMessage) String() string {
	return m.Body
}
