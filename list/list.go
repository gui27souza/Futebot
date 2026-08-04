package list

import (
	"fmt"
	"slices"
)

type List struct {
	present []string
	absent  []string
}

func add(s []string, name string) ([]string, error) {

	if slices.Contains(s, name) {
		return s, fmt.Errorf("player %s is already in the list", name)
	}

	return append(s, name), nil
}

func remove(s []string, name string) ([]string, error) {

	i := slices.Index(s, name)
	if i == -1 {
		return s, fmt.Errorf("player %s is not in the list", name)
	}

	return slices.Delete(s, i, i+1), nil
}

func (l *List) AddPresent(name string) error {

	updated, err := add(l.present, name)
	if err != nil {
		return err
	}

	l.present = updated

	return nil
}

func (l *List) RemovePresent(name string) error {

	updated, err := remove(l.present, name)
	if err != nil {
		return err
	}

	l.present = updated

	return nil
}

func (l *List) AddAbsent(name string) error {

	updated, err := add(l.absent, name)
	if err != nil {
		return err
	}

	l.absent = updated

	return nil
}

func (l *List) RemoveAbsent(name string) error {

	updated, err := remove(l.absent, name)
	if err != nil {
		return err
	}

	l.absent = updated

	return nil
}
