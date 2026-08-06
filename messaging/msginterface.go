package messaging

import (
	"futebot/list"
)

type MsgI interface {
	Send(m string) error
	Receive() (string, error)

	SendList(l *list.List) error
}
