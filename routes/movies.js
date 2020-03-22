const express = require('express');
const MovieService = require('../services/movies');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const movieService = new MovieService();

  router.get('/', async function (req, res, next) {
    const { tags } = req.query;

    try {
      const movies = await movieService.getMovies({ tags });
      res.status(200).json({
        data: movies,
        message: 'movies listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:movieId', async function (req, res, next) {
    const { movieId } = req.params;
    try {
      const movies = await movieService.getMovie({ movieId });

      res.status(200).json({
        data: movies,
        message: 'movie retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async function (req, res, next) {
    const { body: movie } = req;
    try {
      const createMovieId = await movieService.createMovie({ movie });

      res.status(201).json({
        data: createMovieId,
        message: 'movie created',
      });
    } catch (err) {
      next(err);
    }
  });

  router.put('/:movieId', async function (req, res, next) {
    const { body: movie } = req;
    const { movieId } = req.params;

    try {
      const updatedMoviedId = await movieService.updateMovie({
        movieId,
        movie,
      });

      res.status(200).json({
        data: updatedMoviedId,
        message: 'movie updated',
      });
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:movieId', async function (req, res, next) {
    const { body: movie } = req;
    const { movieId } = req.params;

    try {
      const patchMovieId = await movieService.updateMovie({
        movieId,
        movie,
      });

      res.status(200).json({
        data: patchMovieId,
        message: 'movie patched',
      });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:movieId', async function (req, res, next) {
    const { movieId } = req.params;

    try {
      const deleteMovie = await movieService.deleteMovie({ movieId });

      res.status(200).json({
        data: deleteMovie,
        message: 'movie deleted',
      });
    } catch (err) {
      next(err);
    }
  });
}
module.exports = moviesApi;
