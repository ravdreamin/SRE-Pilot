# SRE-Pilot Web Console

The SRE-Pilot Web Console is a premium React application that provides a beautiful, modern interface for interacting with the Aegis AI engine.

## ✨ Features

- **Modern UI/UX** - Google Material Design with smooth animations
- **Interactive Chat** - Natural language interface to query your infrastructure
- **Real-time Updates** - Live metric visualization
- **Responsive Design** - Works on desktop and mobile
- **Dark Mode Ready** - Prepared for theme switching

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Material UI | 7 | Component Library |
| Framer Motion | 12 | Animations |
| React Router | 7 | Navigation |
| Axios | 1.13 | HTTP Client |
| Vite | 7 (Rolldown) | Build Tool |

## 📁 Project Structure

```
sre-pilot-ui/
├── public/
│   └── vite.svg              # Favicon
├── src/
│   ├── assets/               # Static assets
│   │   └── react.svg
│   ├── components/
│   │   └── Layout.jsx        # App shell with navigation
│   ├── pages/
│   │   ├── Hero.jsx          # Landing page
│   │   ├── Console.jsx       # Chat interface
│   │   └── Docs.jsx          # Documentation
│   ├── App.jsx               # Router configuration
│   ├── App.css               # App-level styles
│   ├── main.jsx              # React entrypoint
│   ├── index.css             # Global styles
│   └── theme.js              # MUI theme configuration
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
└── eslint.config.js          # ESLint rules
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** - [Download](https://nodejs.org/)
- **npm** or **yarn**

### Installation

```bash
# Navigate to UI directory
cd sre-pilot-ui

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

**Development server:** http://localhost:5173

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The build output is in the `dist/` directory.

### Linting

```bash
# Run ESLint
npm run lint
```

## 📄 Pages

### Home (`/`)

The landing page featuring:
- Animated gradient orb background
- Product value proposition
- Call-to-action buttons
- Smooth entrance animations

### Console (`/console`)

The chat interface:
- Natural language input
- Message history
- AI responses with PromQL and results
- Loading states

### Documentation (`/docs`)

Usage guides and API reference.

## 🎨 Theme Configuration

The app uses a custom Material UI theme defined in `src/theme.js`:

```javascript
// Key theme settings
{
  palette: {
    primary: {
      main: "#1a73e8",  // Google Blue
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Google Sans", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
}
```

## 🔌 API Integration

The Console page connects to the Aegis backend:

```javascript
// Default API endpoint
const API_URL = "http://localhost:8080/api";

// Send chat message
const response = await axios.post(`${API_URL}/chat`, {
  message: userMessage,
  context: conversationHistory,
});
```

**Make sure the Aegis CLI is running in Watchtower mode:**
```bash
cd ../cli
go run ./cmd/aegis --watch
```

## 🧩 Components

### Layout (`Layout.jsx`)

The app shell providing:
- Fixed navigation bar with blur effect
- Responsive navigation links
- Animated hover states
- Action buttons (Build with Aegis, Chat with Aegis)

### Hero (`Hero.jsx`)

Landing page features:
- Animated gradient orb background (Google colors)
- Staggered entrance animations
- Gradient text effects
- Premium button styling

### Console (`Console.jsx`)

Chat interface with:
- Message input with send button
- Message history display
- Loading indicators
- Error handling
- Markdown rendering for responses

## 🚢 Deployment

### Static Hosting (Vercel, Netlify)

```bash
# Build the app
npm run build

# Deploy the dist/ folder
```

### Docker

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t sre-pilot-ui .
docker run -p 3000:80 sre-pilot-ui
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for configuration:

```env
# API endpoint (optional, defaults to localhost:8080)
VITE_API_URL=http://localhost:8080/api
```

### Proxy Configuration (Development)

If you need to proxy API requests during development, update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🐛 Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules
npm install
```

### Port 5173 already in use

```bash
# Kill process on port
lsof -ti:5173 | xargs kill

# Or use different port
npm run dev -- --port 3000
```

### API connection errors

1. Ensure Aegis CLI is running: `go run ./cmd/aegis --watch`
2. Check API URL matches (default: `http://localhost:8080`)
3. Check browser console for CORS errors

### Build fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.
