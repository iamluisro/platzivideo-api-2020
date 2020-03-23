const express = require('express');
const UserMoviesServices = require('../services/userMovies');
const passport = require('passport');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/users');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

function userMoviesApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesServices();

  //JWT Strategy
  require('../utils/auth/strategies/jwt');

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:user-movies']),
    validationHandler({ userId: userIdSchema }, 'query'),
    async function (req, res, next) {
      const { userId } = req.query;

      try {
        const userMovies = await userMoviesService.getUserMovies({ userId });
        res.status(200).json({
          data: userMovies,
          message: 'user movies listed',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:user-movies']),
    validationHandler(createUserMovieSchema),
    async function (req, res, next) {
      const { body: userMovie } = req;

      try {
        const createdUserMovieId = await userMoviesService.createUserMovie({
          userMovie,
        });

        res.status(201).json({
          data: createdUserMovieId,
          message: 'user movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:user-movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler({ userId: userIdSchema }, 'query'),
    async function (req, res, next) {
      const { movieId } = req.params;
      const { userId } = req.query;

      const userMovies = await userMoviesService.getUserMovies({ userId });
      const userMovieId = userMovies.find(
        (userMovie) => userMovie.movieId === movieId
      )._id;

      try {
        const deletedUserMovieId = await userMoviesService.deleteUserMovie({
          userMovieId,
        });

        res.status(200).json({
          data: deletedUserMovieId,
          message: 'user movie deleted',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = userMoviesApi;
