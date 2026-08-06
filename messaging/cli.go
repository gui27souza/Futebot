package messaging

import (
	"log/slog"
)

type CLI struct {}

func (c *CLI) Send(m string) {
	slog.Info(m)
}
