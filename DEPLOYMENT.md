# Deploying SRE-Pilot for Free

Because SRE-Pilot requires multiple services (Frontend, Backend, Prometheus Database), creating a "Free" deployment is tricky. Standard free tiers (Vercel/Netlify) only support the Frontend.

We have created a **Monolith Dockerfile** that bundles everything into a single container. You can deploy this to any "Container as a Service" platform.

## Recommended Free/Cheap Platforms

### 1. Render.com (Easiest)
Render offers a free "Web Service" tier (spins down after inactivity).

1. Fork this repo to your GitHub.
2. Sign up at [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repo.
5. Settings:
   - **Runtime**: Docker
   - **Region**: Choose closest to you
   - **Instance Type**: Free
   - **Environment Variables**:
     - `GEMINI_KEY`: (Your Google Gemini API Key)
     - `GROQ_API_KEY`: (Or your Groq Key)
     - `PORT`: `10000` (Render default, or leave blank)
6. Click **Deploy**.

> **Note**: On the free tier, Prometheus data will be lost when the service spins down (approx 15 mins of inactivity). This is fine for demos.

### 2. Fly.io (Performance)
Fly.io gives you a free allowance of VMs that stay running longer.

1. Install Fly CLI: `brew install flyctl`
2. Login: `fly auth login`
3. Launch:
   ```bash
   fly launch
   # Follow prompts. Yes to verify config.
   ```
4. Set Secrets:
   ```bash
   fly secrets set GEMINI_KEY=your_key_here
   ```
5. Deploy:
   ```bash
   fly deploy
   ```

### 3. Railway.app (Trial)
Railway is extremely easy but trial based.
1. `npm i -g @railway/cli`
2. `railway login`
3. `railway up`

## Architecture
The `Dockerfile` in the root does the following:
1. Builds the React UI (Vite)
2. Builds the Go API (Aegis)
3. Installs Prometheus
4. Uses Nginx to serve the UI and proxy `/api/*` requests to the Go backend.
All running in one container!
