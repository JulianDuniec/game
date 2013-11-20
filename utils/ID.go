package utils

import (
	"fmt"
	"os"
)

func ID() string {
	b := make([]byte, 16)

	f, _ := os.Open("/dev/urandom")
	defer f.Close()
	f.Read(b)

	return fmt.Sprintf("%x", b[0:6])
}
