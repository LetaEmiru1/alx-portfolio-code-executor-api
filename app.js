const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// --- Route Files ---
const authRoutes = require('./src/routes/auth');
const testRoutes = require('./src/routes/test'); // <-- NEW LINE

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// --- Mount Routers ---
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes); // <-- NEW LINE

// A simple test route for the root URL
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
