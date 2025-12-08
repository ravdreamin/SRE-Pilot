package monitor

import (
	"context"
	"time"

	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
)

type Client interface {
	Query(ctx context.Context, PromQL string, ts time.Time) (result model.Value, err error)
	QueryRange(ctx context.Context, PromQL string, timeRange Range) (result model.Value, err error)
}

type Range struct {
	Start, End time.Time
	Step       time.Duration
}

type PrometheusClient struct {
	api v1.API
}

func NewClient(url string) (*PrometheusClient, error) {
	client, err := api.NewClient(api.Config{
		Address: url,
	})
	if err != nil {
		return nil, err
	}

	v1api := v1.NewAPI(client)

	return &PrometheusClient{api: v1api}, nil
}

func (c *PrometheusClient) Query(ctx context.Context, query string, ts time.Time) (result model.Value, err error) {
	result, _, err = c.api.Query(ctx, query, ts)
	return result, err
}

func (c *PrometheusClient) QueryRange(ctx context.Context, query string, timeRange Range) (result model.Value, err error) {

	r := v1.Range{
		Start: timeRange.Start,
		End:   timeRange.End,
		Step:  timeRange.Step,
	}

	result, _, err = c.api.QueryRange(ctx, query, r)
	return result, err
}
