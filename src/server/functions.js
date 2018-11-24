// import openSocket from 'socket.io-client';
const openSocket = require('socket.io-client');

let socket;
function addOrder(data) {
  // socket = openSocket('http://127.0.0.1:3000');
  socket = openSocket('https://sheltered-badlands-12857.herokuapp.com');
  socket.emit('added order', data);
}

//otherfunctions

const socketfuncs = {
  addOrder
  //otherfunctions
};

// export {addOrder, otherfunctions};
module.exports = socketfuncs; //es5 syntax
