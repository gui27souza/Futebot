package messaging

import (
	"futebot/list"
)

type MsgI interface {
	Send(m string)
	Receive() error

	SendList(l *list.List) error
}
