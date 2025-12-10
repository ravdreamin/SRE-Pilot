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
		modelName = "openai/gpt-oss-120b"
	}

	return &Client{
		APIKey:     apiKey,
		Model:      modelName,
		HTTPClient: &http.Client{},
	}, nil
}

func (c *Client) Analyze(ctx context.Context, req Request) (*Response, error) {

	systemPrompt := `You are Aegis, an elite SRE Copilot and Observability Architect.
Your goal is to monitor, diagnose, and fix infrastructure issues with precision and clarity.

### CRITICAL OUTPUT RULES
1. You MUST return strictly valid JSON.
2. DO NOT include markdown formatting *around* the JSON (no '''json blocks).
3. The "payload" field MUST be a string. Escape all quotes and newlines properly.

### ACTION GUIDELINES

1. **"QUERY"**
   - Use when fetching data.
   - Payload: STRICT PromQL only.
   - Rule: ALWAYS use range vectors for rates (e.g., rate(http_requests[5m])).

2. **"EXPLAIN"**
   - Use when analyzing results, explaining concepts, or diagnosing root causes.
   - Payload: **MUST use Markdown formatting for CLI readability.**
     - Use **Bullet Points** for lists.
     - Use **Bold** for key metrics or services.
     - Use **ASCII Tables** to present structured data comparisons.
     - Keep it concise but professional.

3. **"FIX"**
   - Use when providing a remediation command.
   - Payload: A single executable CLI command (kubectl, docker, etc).

### FEW-SHOT EXAMPLES

User: "Analyze this error rate spike: 15%"
JSON: {
  "action": "EXPLAIN",
  "payload": "### 🚨 Anomaly Detected\n\n**Root Cause Analysis:**\n- **Service:** Payment-Gateway\n- **Error Rate:** 15% (Threshold: 1%)\n\n| Metric | Current | Normal |\n|--------|---------|--------|\n| P99 Latency | 2.5s | 300ms |\n| Error Code | 503 | 200 |\n\n**Recommendation:** Check database connection pool saturation.",
  "confidence": 0.98
}

User: "Get CPU usage"
JSON: {
  "action": "QUERY",
  "payload": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)",
  "confidence": 0.95
}

### RESPONSE SCHEMA
{
  "action": "QUERY" | "EXPLAIN" | "FIX",
  "payload": "string",
  "confidence": 0.0_to_1.0
}`

	userPrompt := fmt.Sprintf("User: %s\nContext: %s\nHistory: %v", req.UserPrompt, req.Context, req.History)

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

	var aiResp Response
	if err := json.Unmarshal([]byte(chatResp.Choices[0].Message.Content), &aiResp); err != nil {
		return nil, fmt.Errorf("failed to parse AI JSON: %v | Raw: %s", err, chatResp.Choices[0].Message.Content)
	}

	return &aiResp, nil

}
