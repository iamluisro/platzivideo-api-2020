const joi = require('@hapi/joi');

const userMovieSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

//importing schemas from other files wasn't working so I just added
// added the same constraints in other docs
const createUserMovieSchema = {
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  movieId: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

module.exports = {
  userMovieSchema,
  createUserMovieSchema,
};
