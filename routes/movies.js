const express = require('express');
const passport = require('passport');
const MovieService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

//JWT strategy
require('../utils/auth/strategies/jwt');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const movieService = new MovieService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    async function (req, res, next) {
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
    }
  );

  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
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
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async function (req, res, next) {
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
    }
  );

  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
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
    }
  );

  router.patch(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
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
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['deleted:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),

    async function (req, res, next) {
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
    }
  );
}
module.exports = moviesApi;
