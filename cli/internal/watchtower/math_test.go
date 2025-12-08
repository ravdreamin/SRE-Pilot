package watchtower

import (
	"testing"
)

func TestCalculateSlope(t *testing.T) {
	tests := []struct {
		name     string
		points   []Points
		wantSign string // "positive", "negative", "zero"
	}{
		{
			name: "Rising sharply",
			points: []Points{
				{0, 10}, {1, 20}, {2, 30},
			},
			wantSign: "positive",
		},
		{
			name: "Flat line",
			points: []Points{
				{0, 50}, {1, 50}, {2, 50},
			},
			wantSign: "zero",
		},
		{
			name: "Falling",
			points: []Points{
				{0, 90}, {1, 80}, {2, 70},
			},
			wantSign: "negative",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := CalculateSlope(tt.points)
			if tt.wantSign == "positive" && got <= 0 {
				t.Errorf("CalculateSlope() = %v, want positive", got)
			}
			if tt.wantSign == "negative" && got >= 0 {
				t.Errorf("CalculateSlope() = %v, want negative", got)
			}
			if tt.wantSign == "zero" && got != 0 {
				t.Errorf("CalculateSlope() = %v, want zero", got)
			}
		})
	}
}
