package utils

import (
	"fmt"
	"os"
)

func UUID() string {
	b := make([]byte, 16)

	f, _ := os.Open("/dev/urandom")
	defer f.Close()
	f.Read(b)

	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}
