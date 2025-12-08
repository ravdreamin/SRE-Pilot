package ai

type Request struct {
	UserPrompt string
	Context    string
	History    []string
}

type Response struct {
	Action     string  `json:"action"`
	Payload    string  `json:"payload"`
	Confidence float64 `json:"confidence"`
}
