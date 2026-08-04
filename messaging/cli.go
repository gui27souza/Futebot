package messaging

import (
	"log/slog"
)

type CLI struct {}

func (c *CLI) SendMessage(m string) {
	slog.Info(m)
}
