const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const publicRecipeRoutes = require('./routes/publicRecipeRoutes.js');
const privateRecipeRoutes = require('./routes/privateRecipeRoutes.js');
const folderRoutes = require('./routes/folderRoutes.js');

dotenv.config();
connectDB();

const app = express();


app.use(express.json()); 
app.use(cors());
app.use(morgan('dev')); 


app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running locally!' });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/public-recipes', publicRecipeRoutes);
app.use('/api/private-recipes', privateRecipeRoutes);
app.use('/api/folders', folderRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});