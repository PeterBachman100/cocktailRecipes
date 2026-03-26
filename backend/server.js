const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const publicRecipeRoutes = require('./routes/publicRecipeRoutes.js');
const privateRecipeRoutes = require('./routes/privateRecipeRoutes.js');
const folderRoutes = require('./routes/folderRoutes.js');

connectDB();

const app = express();
app.set('trust proxy', 1);
app.use(express.json()); 

const allowedOrigins = [
'http://localhost:5173',
process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}


app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/public-recipes', publicRecipeRoutes);
app.use('/api/private-recipes', privateRecipeRoutes);
app.use('/api/folders', folderRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('/{*splat}', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});