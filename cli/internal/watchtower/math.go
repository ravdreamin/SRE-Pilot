package watchtower

func CalculateSlope(points []Points) float64 {
	n := float64(len(points))
	if n < 2 {
		return 0.0
	}

	var sumX, sumY, sumXY, sumXSq float64

	for _, p := range points {
		sumX += p.Time
		sumY += p.Value
		sumXY += p.Time * p.Value
		sumXSq += p.Time * p.Time

	}
	numerator := (n * sumXY) - (sumX * sumY)
	denominator := (n * sumXSq) - (sumX * sumX)

	if denominator == 0 {
		return 0.0
	}

	return numerator / denominator

}

type Points struct {
	Time  float64
	Value float64
}
