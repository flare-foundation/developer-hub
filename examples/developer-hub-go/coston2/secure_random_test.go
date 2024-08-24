package coston2

import (
	"testing"
)

func TestSecureRandom(t *testing.T) {
	output := SecureRandom()

	if output == nil {
		t.Fatalf("Expected a valid result, got nil")
	}

	if output.RandomNumber == nil {
		t.Errorf("Expected RandomNumber to be non-nil")
	}

	if output.RandomTimestamp == nil {
		t.Errorf("Expected RandomTimestamp to be non-zero")
	}

	if !output.IsSecureRandom {
		t.Errorf("Expected IsSecureRandom to be true")
	}

}
