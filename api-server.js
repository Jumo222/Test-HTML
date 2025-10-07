import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Subtraction webhook endpoint
app.post('/api/subtract', (req, res) => {
  try {
    const { num1, num2 } = req.body;

    // Validate input
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      return res.status(400).json({
        error: 'Invalid input: both num1 and num2 must be numbers'
      });
    }

    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({
        error: 'Invalid input: numbers cannot be NaN'
      });
    }

    // Perform subtraction
    const result = num1 - num2;

    // Log the request (for learning purposes)
    console.log(`Subtraction request: ${num1} - ${num2} = ${result}`);

    // Send response
    res.json({
      result,
      operation: 'subtraction',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing subtraction:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/subtract`);
});
