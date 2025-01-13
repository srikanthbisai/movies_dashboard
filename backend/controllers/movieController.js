// controllers/movieController.js
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

exports.createMovie = async (req, res) => {
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
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.userId });
    res.json(movies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const movie = await Movie.findOne({ 
      _id: id, 
      userId: req.userId 
    }).lean();

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const deletedMovie = await Movie.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found or unauthorized access' });
    }

    res.json({ message: 'Movie deleted successfully', movie: deletedMovie });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the movie' });
  }
};

exports.addCastMember = async (req, res) => {
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
};
