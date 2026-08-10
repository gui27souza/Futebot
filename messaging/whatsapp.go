// TODO - Implement Whatsapp I/O methods
package messaging

import (
	"fmt"
	"futebot/list"
)

type Wpp struct{}

func NewWpp() MsgI {
	return &Wpp{}
}

func (w *Wpp) Send(m string) error {
	return fmt.Errorf("method not implemented yet")
}

func (w *Wpp) Receive() (string, error) {
	return "", fmt.Errorf("method not implemented yet")
}

func (w *Wpp) SendList(l *list.List) error {
	return fmt.Errorf("method not implemented yet")
}
