// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://srikanthbisaiwork:aMlsMOd2byeXRCa2@cluster0.iq9sq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

// Movie Model
const movieSchema = new mongoose.Schema({
  title: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cast: [{
    name: String,
    email: String,
    phone: String,
    place: String
  }]
});

const Movie = mongoose.model('Movie', movieSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '24h' });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Movie Routes
app.post('/api/movies', verifyToken, async (req, res) => {
  try {
    const { title, cast } = req.body;
    const movie = new Movie({
      title,
      userId: req.userId,
      cast: cast || []
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/movies', verifyToken, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.userId });
    res.json(movies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/movies/:id/cast', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cast } = req.body;
    const movie = await Movie.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $push: { cast: cast } },
      { new: true }
    );
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));