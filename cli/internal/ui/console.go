package ui

import (
	"fmt"

	"github.com/charmbracelet/lipgloss"
)

// Material Design Color Palette
var (
	colorSuccess = lipgloss.Color("#4CAF50") // Green 500
	colorError   = lipgloss.Color("#F44336") // Red 500
	colorWarning = lipgloss.Color("#FF9800") // Orange 500
	colorInfo    = lipgloss.Color("#2196F3") // Blue 500
	colorHeader  = lipgloss.Color("#6200EA") // Deep Purple A700
	colorText    = lipgloss.Color("#FAFAFA") // Off-white
	colorBorder  = lipgloss.Color("#616161") // Grey 700
)

var (
	// Icons - Clean and Minimal
	iconSuccess = "✔"
	iconError   = "✘"
	iconWarning = "⚠"
	iconInfo    = "ℹ"

	// Styles
	baseStyle = lipgloss.NewStyle().PaddingLeft(1)

	successStyle = baseStyle.Copy().Foreground(colorSuccess).Bold(true)
	errorStyle   = baseStyle.Copy().Foreground(colorError).Bold(true)
	warnStyle    = baseStyle.Copy().Foreground(colorWarning).Bold(true)
	infoStyle    = baseStyle.Copy().Foreground(colorInfo).Bold(true)

	// App Bar style Header
	headerStyle = lipgloss.NewStyle().
			Foreground(colorText).
			Background(colorHeader).
			Bold(true).
			Padding(1, 4).
			MarginTop(1).
			MarginBottom(1).
			Align(lipgloss.Center)

	// Card style Box
	boxBorder = lipgloss.Border{
		Top:         "─",
		Bottom:      "─",
		Left:        "│",
		Right:       "│",
		TopLeft:     "╭",
		TopRight:    "╮",
		BottomLeft:  "╰",
		BottomRight: "╯",
	}

	boxStyle = lipgloss.NewStyle().
			Border(boxBorder).
			BorderForeground(colorBorder).
			Padding(1, 2).
			MarginTop(1).
			MarginBottom(1)

	boxTitleStyle = lipgloss.NewStyle().
			Foreground(colorHeader).
			Bold(true).
			MarginBottom(1)
)

// Success displays a success message with Material Green
func Success(format string, a ...interface{}) {
	msg := fmt.Sprintf(format, a...)
	fmt.Println(successStyle.Render(fmt.Sprintf("%s  %s", iconSuccess, msg)))
}

// Error displays an error message with Material Red
func Error(format string, a ...interface{}) {
	msg := fmt.Sprintf(format, a...)
	fmt.Println(errorStyle.Render(fmt.Sprintf("%s  %s", iconError, msg)))
}

// Warning displays a warning message with Material Orange
func Warning(format string, a ...interface{}) {
	msg := fmt.Sprintf(format, a...)
	fmt.Println(warnStyle.Render(fmt.Sprintf("%s  %s", iconWarning, msg)))
}

// Info displays an info message with Material Blue
func Info(format string, a ...interface{}) {
	msg := fmt.Sprintf(format, a...)
	fmt.Println(infoStyle.Render(fmt.Sprintf("%s  %s", iconInfo, msg)))
}

// Header displays a distinct Material App Bar style header
func Header(text string) {
	fmt.Println(headerStyle.Render(text))
}

// Box displays a content card with a title
func Box(title, content string) {
	renderedTitle := boxTitleStyle.Render(title)
	renderedContent := lipgloss.NewStyle().Foreground(colorText).Render(content)

	fmt.Println(boxStyle.Render(
		lipgloss.JoinVertical(lipgloss.Left, renderedTitle, renderedContent),
	))
}
