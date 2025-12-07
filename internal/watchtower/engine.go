package watchtower

import (
	"context"
	"log"
	"sre-pilot/internal/monitor"
	"time"

	"github.com/prometheus/common/model"
)

type Engine struct {
	Client monitor.Client
	Ticker *time.Ticker
}

func NewEngine(client monitor.Client) *Engine {
	return &Engine{
		Client: client,
		Ticker: time.NewTicker(30 * time.Second),
	}
}

func (e *Engine) Run(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case <-e.Ticker.C:
			end := time.Now()
			start := end.Add(-5 * time.Minute)

			query := "process_cpu_seconds_total"

			val, err := e.Client.QueryRange(ctx, query, monitor.Range{
				Start: start,
				End:   end,
				Step:  15 * time.Second,
			})
			if err != nil {
				log.Printf("Watchtower Query Error: %v", err)
				continue
			}

			matrix, ok := val.(model.Matrix)
			if !ok {
				log.Printf("Watchtower expected Matrix, got %T", val)
				continue
			}

			for _, stream := range matrix {
				var data []Points
				for _, pair := range stream.Values {
					t := float64(pair.Timestamp) / 1000.0
					v := float64(pair.Value)
					data = append(data, Points{Time: t, Value: v})
				}

				slope := CalculateSlope(data)
				log.Printf("Slope: %f | Metric: %v", slope, stream.Metric)

				if slope > 0.5 {
					log.Printf("CRITICAL ALERT: %v is rising sharply", stream.Metric)
				}
			}
		}
	}
}
