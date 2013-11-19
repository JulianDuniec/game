package server

type ClientMessage struct {
	Client *Client
	Body   string `json:"body"`
}

func (m *ClientMessage) String() string {
	return m.Client.Id + " -> " + m.Body
}

type ServerMessage struct {
	Body string `json:"body"`
}

func (m *ServerMessage) String() string {
	return m.Body
}
