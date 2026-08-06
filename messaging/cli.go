package messaging

import (
	"bufio"
	"fmt"
	"futebot/list"
	"log/slog"
	"os"
)

type CLI struct{}

func (c *CLI) Send(m string) error {
	slog.Info(m)
	return nil
}

func (c *CLI) Receive() (string, error) {

	scanner := bufio.NewScanner(os.Stdin)

	var input string
	if scanner.Scan() {
		input = scanner.Text()
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("error receiving message")
	}

	return input, nil
}

func (c* CLI) SendList(l *list.List) error {
	slog.Info("Present")
}
