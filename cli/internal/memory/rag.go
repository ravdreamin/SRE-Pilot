package memory

import (
	"errors"
	"math"
	"sort"
)

type Incident struct {
	ID                string    `json:"id"`
	Title             string    `json:"title"`
	Summary           string    `json:"summary"`
	SuggestedSolution string    `json:"suggested_solution"`
	Embedding         []float32 `json:"embedding"`
}

type VectorStore struct {
	Incidents []Incident
}

func CosineSimilarity(a, b []float32) (float32, error) {
	if len(a) != len(b) {
		return 0, errors.New("vector lengths do not match")
	}
	var dotProduct, normA, normB float64
	for i := range a {
		valA := float64(a[i])
		valB := float64(b[i])

		dotProduct += valA * valB
		normA += valA * valA
		normB += valB * valB
	}

	if normA == 0 || normB == 0 {
		return 0, nil
	}

	return float32(dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))), nil
}

type searchResult struct {
	incident Incident
	score    float32
}

func (s *VectorStore) Retrieve(query []float32, k int) ([]Incident, error) {
	var results []searchResult
	for _, incident := range s.Incidents {
		score, _ := CosineSimilarity(query, incident.Embedding)
		results = append(results, searchResult{incident: incident,
			score: score,
		})
	}

	sort.Slice(results, func(i, j int) bool {
		return results[i].score > results[j].score
	})

	if k > len(results) {
		k = len(results)
	}
	var final []Incident
	for i := 0; i < k; i++ {
		final = append(final, results[i].incident)
	}
	return final, nil

}
