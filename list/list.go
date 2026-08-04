package list

import (
	"fmt"
	"slices"
)

type List struct {
	presentPlayers []string
	absentPlayers  []string
}

func addPlayer(s []string, name string) ([]string, error) {

	if slices.Contains(s, name) {
		return s, fmt.Errorf("player %s is already in the list", name)
	}

	return append(s, name), nil
}

func removePlayer(s []string, name string) ([]string, error) {

	i := slices.Index(s, name)
	if i == -1 {
		return s, fmt.Errorf("player %s is not in the list", name)
	}

	return slices.Delete(s, i, i+1), nil
}

func (l *List) AddPresentPlayer(name string) error {

	updated, err := addPlayer(l.presentPlayers, name)
	if err != nil {
		return err
	}

	l.presentPlayers = updated

	return nil
}

func (l *List) RemovePresentPlayer(name string) error {

	updated, err := removePlayer(l.presentPlayers, name)
	if err != nil {
		return err
	}

	l.presentPlayers = updated

	return nil
}

func (l *List) AddAbsentPlayer(name string) error {

	updated, err := addPlayer(l.absentPlayers, name)
	if err != nil {
		return err
	}

	l.absentPlayers = updated

	return nil
}

func (l *List) RemoveAbsentPlayer(name string) error {

	updated, err := removePlayer(l.absentPlayers, name)
	if err != nil {
		return err
	}

	l.absentPlayers = updated
	
	return nil
}
