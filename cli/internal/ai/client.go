package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Client struct {
	APIKey     string
	Model      string
	HTTPClient *http.Client
}

type ChatRequest struct {
	Model          string         `json:"model"`
	Messages       []Message      `json:"messages"`
	Temperature    float64        `json:"temperature"`
	ResponseFormat ResponseFormat `json:"response_format"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ResponseFormat struct {
	Type string `json:"type"`
}

type ChatResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func NewClient(apiKey, modelName string) (*Client, error) {
	if modelName == "" {
		modelName = "qwen/qwen3-32b"
	}

	return &Client{
		APIKey:     apiKey,
		Model:      modelName,
		HTTPClient: &http.Client{},
	}, nil
}

func (c *Client) Analyze(ctx context.Context, req Request) (*Response, error) {

	systemPrompt := `You are Aegis, an SRE Copilot.
You MUST return valid JSON only. No markdown, no conversational text,Return ONLY the raw PromQL string. Do not use labels or prefixes.
Your goal is to monitor, diagnose, and fix infrastructure issues using Prometheus.

Response Schema:
{
  "action": "QUERY" | "EXPLAIN" | "FIX",
  "payload": "promql_query_or_explanation_text",
  "confidence": 0.0_to_1.0
}`

	userPrompt := fmt.Sprintf("User: %s\nContext: %s\nHistory: %v", req.UserPrompt, req.Context, req.History)

	// 2. Build the Request Object
	apiReq := ChatRequest{
		Model: c.Model,
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature:    0.1, // Low temp = more precise code/JSON
		ResponseFormat: ResponseFormat{Type: "json_object"},
	}

	jsonData, err := json.Marshal(apiReq)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.APIKey)

	resp, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("API call failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("Groq API Error %d: %s", resp.StatusCode, string(body))
	}

	var chatResp ChatResponse
	if err := json.NewDecoder(resp.Body).Decode(&chatResp); err != nil {
		return nil, err
	}

	if len(chatResp.Choices) == 0 {
		return nil, fmt.Errorf("empty response from AI provider")
	}

	// 5. Unmarshal the inner JSON string from the LLM
	var aiResp Response
	if err := json.Unmarshal([]byte(chatResp.Choices[0].Message.Content), &aiResp); err != nil {
		return nil, fmt.Errorf("failed to parse AI JSON: %v | Raw: %s", err, chatResp.Choices[0].Message.Content)
	}

	return &aiResp, nil

}
