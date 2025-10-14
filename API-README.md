# REST API Server Documentation

## Overview
This project includes a separate REST API server that demonstrates server-side calculations. The Calculation page compares two approaches:
- **Client-side calculation** (Addition): Performed directly in the browser using JavaScript
- **Server-side calculation** (Subtraction): Performed on the server via REST API

## What's the Difference?

### REST API vs Webhook
- **REST API** (what we built): Your client initiates a request to the server and waits for a response. The client is in control.
  - Example: Browser → `POST /api/subtract` → Server processes → Returns result → Browser displays it

- **Webhook**: The server initiates a request to your client when an event occurs. The server is in control.
  - Example: GitHub → detects push event → `POST https://your-app.com/webhook` → Your app processes the event

Our subtraction calculator uses a **REST API** because the browser initiates the request when you click "Calculate Difference".

## Running the Project

### Option 1: Run both servers together (Recommended)
```bash
npm run dev:all
```
This starts both the API server (port 3001) and the Vite dev server (port 3000) simultaneously.

### Option 2: Run servers separately
In one terminal:
```bash
npm run api
```

In another terminal:
```bash
npm run dev
```

## API Endpoints

### POST /api/subtract
Performs subtraction of two numbers.

**Request:**
```json
{
  "num1": 10,
  "num2": 5
}
```

**Response:**
```json
{
  "result": 5,
  "operation": "subtraction",
  "timestamp": "2025-10-07T12:34:56.789Z"
}
```

### GET /api/health
Health check endpoint to verify the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "API server is running",
  "timestamp": "2025-10-07T12:34:56.789Z"
}
```

## How It Works

### Vite Proxy Configuration
The Vite development server is configured to proxy API requests to the backend server:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

When the React app makes a request to `/api/subtract`, Vite automatically forwards it to `http://localhost:3001/api/subtract`.

### Why This Approach?
This setup demonstrates:
1. **Client-side vs Server-side processing**: Compare how calculations work in different environments
2. **API integration**: Learn how front-end apps communicate with backend services
3. **Real-world architecture**: Many web applications use this separation of concerns

## Technical Details

### Dependencies
- **express**: Web framework for Node.js
- **cors**: Enable Cross-Origin Resource Sharing
- **concurrently**: Run multiple npm scripts simultaneously

### Error Handling
The API includes validation for:
- Invalid input types
- NaN values
- Server errors

All errors return appropriate HTTP status codes and error messages.
