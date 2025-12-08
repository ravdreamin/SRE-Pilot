package memory

import (
	"math"
	"testing"
)

func TestCosineSimilarity(t *testing.T) {
	tests := []struct {
		name    string
		a       []float32
		b       []float32
		want    float32
		wantErr bool
	}{
		{
			name: "Identical vectors",
			a:    []float32{1, 0, 0},
			b:    []float32{1, 0, 0},
			want: 1.0,
		},
		{
			name: "Orthogonal vectors",
			a:    []float32{1, 0, 0},
			b:    []float32{0, 1, 0},
			want: 0.0,
		},
		{
			name: "Opposite vectors",
			a:    []float32{1, 0, 0},
			b:    []float32{-1, 0, 0},
			want: -1.0,
		},
		{
			name:    "Length mismatch",
			a:       []float32{1, 0},
			b:       []float32{1, 0, 0},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := CosineSimilarity(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Errorf("CosineSimilarity() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr {
				// Floating point comparison
				if math.Abs(float64(got-tt.want)) > 1e-5 {
					t.Errorf("CosineSimilarity() = %v, want %v", got, tt.want)
				}
			}
		})
	}
}

func TestRetrieve(t *testing.T) {
	store := VectorStore{
		Incidents: []Incident{
			{Title: "Exact Match", Embedding: []float32{1, 0, 0}},
			{Title: "Opposite", Embedding: []float32{-1, 0, 0}},
			{Title: "Orthogonal", Embedding: []float32{0, 1, 0}},
			{Title: "Semi-Match", Embedding: []float32{0.707, 0.707, 0}},
		},
	}

	// Query matches "Exact Match" (score 1.0)
	query := []float32{1, 0, 0}
	results, err := store.Retrieve(query, 2)
	if err != nil {
		t.Fatalf("Retrieve failed: %v", err)
	}

	if len(results) != 2 {
		t.Errorf("Expected 2 results, got %d", len(results))
	}

	if results[0].Title != "Exact Match" {
		t.Errorf("Expected top result 'Exact Match', got '%s'", results[0].Title)
	}

	if results[1].Title != "Semi-Match" {
		t.Errorf("Expected second result 'Semi-Match', got '%s'", results[1].Title)
	}
}
