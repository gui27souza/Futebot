package session

import (
	"futebot/messaging"
	"os"
)

type Session struct {
	msgI messaging.MsgI
}

func (s *Session) SetupSession() error {

	msgEnv := os.Getenv("MESSAGE_INTERFACE")
	if err := s.dealMsgI(msgEnv); err != nil {
		return err
	}

	return nil
}

func (s *Session) dealMsgI(msgEnv string) error {

	switch msgEnv {
	case "cli":
		s.msgI = messaging.NewCLI()
	case "whatsapp":
		s.msgI = messaging.NewWpp()
	default:
		s.msgI = messaging.NewCLI()
	}

	return nil
}
