const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// --- Route Files ---
const authRoutes = require('./src/routes/auth');
const snippetRoutes = require('./src/routes/snippets');
const executionRoutes = require('./src/routes/execution');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// --- Mount Routers ---
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/execute', executionRoutes);

app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Use the port that Render provides via the 'PORT' environment variable,
// or default to 5000 for local development.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // The console.log will now show which port it's using.
  console.log(`Server is listening on port ${PORT}`);
});
