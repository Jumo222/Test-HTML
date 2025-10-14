// Import the Express framework - a minimal web server framework for Node.js
// that makes it easy to create REST APIs
import express from 'express';

// Import CORS middleware - Cross-Origin Resource Sharing allows your React app
// (running on port 3000) to make requests to this API (running on port 3001)
import cors from 'cors';

// Create an Express application instance that will handle all HTTP requests
const app = express();

// Define which port the server listens on (different from React dev server on 3000)
const PORT = 3001;

// Middleware setup - these run on every request before reaching your endpoints
// Enable CORS so browsers allow requests from your React app's domain
app.use(cors());

// Automatically parse incoming JSON data in request bodies and make it available in req.body
app.use(express.json());

// Subtraction REST API endpoint
// app.post() creates a POST endpoint (POST is used when sending data to the server)
// '/api/subtract' is the URL path clients use to access this endpoint
// (req, res) => {} is a callback function with:
//   - req (request) - Contains data sent from the client
//   - res (response) - Used to send data back to the client
app.post('/api/subtract', (req, res) => {
  // Start error handling block to catch any unexpected errors
  try {
    // Destructuring: extract num1 and num2 from the JSON body sent by the client
    const { num1, num2 } = req.body;

    // First validation check: Verify both values are the number type
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      // res.status(400) sets HTTP status code 400 (Bad Request)
      // res.json() sends a JSON response back to the client
      // return stops execution here if validation fails
      return res.status(400).json({
        error: 'Invalid input: both num1 and num2 must be numbers'
      });
    }

    // Second validation check: isNaN() checks if value is "Not a Number"
    // NaN is a special JavaScript value that represents an invalid number
    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: 'Invalid input: numbers cannot be NaN'
      });
    }

    // Perform the subtraction operation and store result
    const result = num1 - num2;

    // Log the operation to the server console (helpful for debugging)
    // Uses template literals (backticks) with ${} for string interpolation
    console.log(`Subtraction request: ${num1} - ${num2} = ${result}`);

    // Send successful JSON response back to client containing:
    // - result: The calculated value (shorthand for result: result)
    // - operation: Label identifying the operation type
    // - timestamp: Current date/time in ISO format (e.g., "2025-10-08T10:30:00.000Z")
    res.json({
      result,
      operation: 'subtraction',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Catch any unexpected errors that weren't handled above
    // Log error details to server console for debugging
    console.error('Error processing subtraction:', error);

    // Status 500 = "Internal Server Error"
    // Send generic message to client (security best practice - don't expose internal details)
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
// app.get() creates a GET endpoint (used for retrieving data, not sending)
// _req - underscore prefix indicates this parameter isn't used in the function
// Simple endpoint to verify server is running (useful for monitoring and debugging)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
// app.listen() starts the server on the specified port
// The callback function runs once the server successfully starts
app.listen(PORT, () => {
  // Log confirmation messages showing where to access the API
  console.log(`REST API server running on http://localhost:${PORT}`);
  console.log(`Subtraction endpoint: http://localhost:${PORT}/api/subtract`);
});
