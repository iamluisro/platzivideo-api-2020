const express = require('express');
const app = express();

const { config } = require('./config/index');

const authApi = require('./routes/auth.js');
const moviesApi = require('./routes/movies.js');
const userMoviesApi = require('./routes/userMovies.js');

app.use(express.json());

authApi(app);
moviesApi(app);
userMoviesApi(app);

app.listen(config.port, function () {
  console.log(`LIstening on http://localhost:${config.port}`);
});
