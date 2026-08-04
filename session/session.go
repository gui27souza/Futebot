package session

import (
	"os"
)

func SetupSession() error {

	msgEnv := os.Getenv("MESSAGE_INTERFACE")
	if err := dealMsgI(msgEnv); err != nil {
		return err
	}

	return nil
}

func dealMsgI(msgEnv string) error {
	
	return nil
}
