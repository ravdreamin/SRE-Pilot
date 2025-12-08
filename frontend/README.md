# SRE-Pilot Frontend

This is the frontend application for SRE-Pilot, built with React, Vite, and Material UI.

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Material UI (MUI) + Emotion
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber (@react-three/fiber) + Drei

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development Server

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

- `src/components`: Reusable UI components (Navbar, Hero, etc.)
- `src/pages`: Page components (Home, Docs, Pricing, SignIn)
- `src/theme.ts`: Custom MUI theme configuration
- `src/App.tsx`: Main application entry point with Routing

## Features

- **Premium UI**: Custom Dark Mode theme with Material UI.
- **3D Hero Section**: Interactive 3D elements using Three.js.
- **Responsive Design**: Works on mobile and desktop.
- **Animated Navigation**: Smooth entrance animations.
