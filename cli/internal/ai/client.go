package ai

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type Client struct {
	model  *genai.GenerativeModel
	client *genai.Client
}

func NewClient(apiKey, modelName string) (*Client, error) {
	ctx := context.Background()
	c, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}

	model := c.GenerativeModel(modelName)

	model.ResponseMIMEType = "application/json"

	return &Client{
		client: c,
		model:  model,
	}, nil
}

func (c *Client) Analyze(ctx context.Context, req Request) (*Response, error) {
	prompt := fmt.Sprintf(`You are Aegis, an SRE Copilot. 
User: %s
Context: %s
History: %v

Return ONLY JSON matching this structure:
{
  "action": "QUERY" | "EXPLAIN" | "FIX",
  "payload": "promql_query_or_explanation_text",
  "confidence": 0.0_to_1.0
}
`, req.UserPrompt, req.Context, req.History)

	resp, err := c.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, err
	}
	if len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("no Response from AI")
	}

	var aiResp Response
	part := resp.Candidates[0].Content.Parts[0]

	rawJSON, ok := part.(genai.Text)
	if !ok {
		return nil, fmt.Errorf("Unexpected response Type")
	}

	if err := json.Unmarshal([]byte(rawJSON), &aiResp); err != nil {
		return nil, err
	}

	return &aiResp, nil

}
