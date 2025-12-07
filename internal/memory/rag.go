package memory

import (
	"encoding/json"
	"os"
	"strings"
)

type Incident struct {
	Keywords []string `json:"keywords`
	Context  string   `json:"context`
	Solution string   `json:"solution`
}

type Knowledgebase struct {
	Incidents []Incident
}

func LoadKnowledgebase(filepath string) (*Knowledgebase, error) {
	file, err := os.ReadFile(filepath)
	if err != nil {
		return nil, err
	}

	var incidents []Incident
	if err := json.Unmarshal(file, &incidents); err != nil {
		return nil, err
	}
	return &Knowledgebase{Incidents: incidents}, nil

}

func (kb *Knowledgebase) RetrieveContext(query string) string {
	query = strings.ToLower(query)
	var matches []string

	for _, incident := range kb.Incidents {

		for _, keywords := range incident.Keywords {
			if strings.Contains(query, keywords) {
				formatted := "🧠 MEMORY: " + incident.Context + " | Suggestion: " + incident.Solution
				matches = append(matches, formatted)
				break
			}
		}

		if len(matches) == 0 {
			return ""
		}

	}
	return strings.Join(matches, "\n")

}
