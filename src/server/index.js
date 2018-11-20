const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const db = require('./db');
const http = require('http');
const logger = require('./logger');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.HTTP_PORT = process.env.HTTP_PORT || 3000;

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

const setupAppRoutes =
  process.env.NODE_ENV === 'development' ? require('./middlewares/development') : require('./middlewares/production');

// Init express app
const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());

function onUnhandledError(err) {
  try {
    logger.error(err);
  } catch (e) {
    // console.log('LOGGER ERROR:', e);
    // console.log('APPLICATION ERROR:', err);
  }
  process.exit(1);
}

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

/**
 * ===================================
 * Routes
 * ===================================
 */

app.use(logger.expressMiddleware);

// This sets up routes other than the root routes. E.g. products the data needed for react components.
require('./routes')(app, db);

//this sets up the root route to react app.
setupAppRoutes(app);

// Root GET request (it doesn't belong in any controller file)

// Catch all unmatched requests and return 404 not found page

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(process.env.HTTP_PORT, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

// Run clean up actions when server shuts down
server.on('close', () => {
  console.log('Closed express server');

  db.pool.end(() => {
    console.log('Shut down db connection pool');
  });
});
