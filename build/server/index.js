require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const db = require('./db');
const http = require('http');
const logger = require('./logger');
const socketIO = require('socket.io');
const axios = require('axios');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

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

// app.use(logger.expressMiddleware); -> removed to prevent express methods for console logging endlessly

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

var server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('new connection from server');
  socket.on('added order', (data) => {
    io.sockets.emit('added order', data);
  });

  socket.on('disconnect', () => console.log('user disconnected'));
});

server.listen(process.env.PORT, () => console.log(`~~~ Tuning in to the waves of port **${process.env.PORT}** ~~~`));

// Run clean up actions when server shuts down
server.on('close', () => {
  console.log('Closed express server');

  db.pool.end(() => {
    console.log('Shut down db connection pool');
  });
});

// -- using set interval to update api calls -- //

// let intervalcb; //initialize interval callback
// io.on('connection', (socket) => {
//   console.log('new connection from server');
//   // if (intervalcb) {
//   //   clearInterval(intervalcb);
//   // }
//   intervalcb = setInterval(() => getOrdersAPI(socket), 2000);

//   socket.on('disconnect from server', () => console.log('user disconnected'));
// });

// const getOrdersAPI = async (socket) => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/orders');
//     console.log('response from axios socket call', response.data);
//     socket.emit('APICALL', response.data);
//   } catch (error) {
//     console.log('error', error);
//   }
// };

// -- simeple color changing exercise from socket.jsx client file --//

// //on takes on 2 arguements; name of event and a callback function
// io.on('connection', (socket) => {
//   console.log('user connected');
//   //receives data from front end, and emit to front end again
//   socket.on('change color', (color) => {
//     console.log('color changed to:', color);
//     io.sockets.emit('change color', color);
//   });

//   socket.on('disconnect', () => console.log('user disconnected'));
// });
