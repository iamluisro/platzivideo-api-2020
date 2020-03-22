const express = require('express');
const app = express();

const { config } = require('./config/index');

const moviesApi = require('./routes/movies.js');

app.use(express.json());

moviesApi(app);

app.listen(config.port, function () {
  console.log(`LIstening on http://localhost:${config.port}`);
});
