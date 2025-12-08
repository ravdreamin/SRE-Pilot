package billing

import (
	"encoding/json"
	"os"
	"time"
)

type Tier string

const (
	Free Tier = "FREE"
	Pro  Tier = "PRO"
)

type UserConfig struct {
	Tier       Tier   `json:"tier"`
	QueryCount int    `json:"query_count"`
	TokenUsage int    `json:"token_usage"`
	LastReset  string `json:"last_reset"`
}

// Limits
const (
	FreeDailyQueryLimit = 10
	FreeModel           = "gemini-2.5-flash"
	ProModel            = "gemini-2.5-pro"
)

func LoadConfig() (*UserConfig, error) {
	file, err := os.ReadFile("data/subscription.json")
	if os.IsNotExist(err) {

		return &UserConfig{
			Tier:       Free,
			QueryCount: 0,
			LastReset:  time.Now().Format("2006-01-02"),
		}, nil
	}
	if err != nil {
		return nil, err
	}

	var config UserConfig
	if err := json.Unmarshal(file, &config); err != nil {
		return nil, err
	}

	// Check if we need to reset daily limits
	today := time.Now().Format("2006-01-02")
	if config.LastReset != today {
		config.QueryCount = 0
		config.TokenUsage = 0
		config.LastReset = today
		SaveConfig(&config)
	}

	return &config, nil
}

func SaveConfig(config *UserConfig) error {
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile("data/subscription.json", data, 0644)
}

func (c *UserConfig) CanQuery() bool {
	if c.Tier == Pro {
		return true // Unlimited
	}
	return c.QueryCount < FreeDailyQueryLimit
}

func (c *UserConfig) GetModel() string {
	if c.Tier == Pro {
		return ProModel
	}
	return FreeModel
}
