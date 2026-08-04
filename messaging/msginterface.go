package messaging

import (
	"futebot/list"
)

type MsgI interface {
	SendMessage(m string) error
	ReceiveMessage() error

	SendList(l *list.List) error
}
