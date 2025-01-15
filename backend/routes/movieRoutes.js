const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, movieController.createMovie);
router.get('/', verifyToken, movieController.getMovies);
router.get('/:id', verifyToken, movieController.getMovie);
router.delete('/:id', verifyToken, movieController.deleteMovie);
router.put('/:id/cast', verifyToken, movieController.addCastMember);

module.exports = router;
