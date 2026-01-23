const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const publicRecipeRoutes = require('./routes/publicRecipeRoutes.js');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body
app.use(cors());
app.use(morgan('dev')); // Logs requests to the console

// Basic Health Route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running locally!' });
});

// My Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/public-recipes', publicRecipeRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});