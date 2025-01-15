const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

app.use(cors({
  origin: 'https://movies-dashboard-frontend-xbni.vercel.app', 
  credentials: true
}));
app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
