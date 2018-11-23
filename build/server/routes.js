module.exports = (app, db) => {
  const users = require('./controllers/user')(db);
  const order = require('./controllers/orders')(db);

  /*
   *  =========================================
   *  Users
   *  =========================================
   */

  // CRUD
  app.get('/api/orders', order.activeIndex);
  app.get('/api/users', users.index);

  app.post('/users/create', users.create);
  app.post('/users/logout', users.logout);
  app.post('/users/login', users.login);
  app.post('/order/new', order.create);
  app.put('/order/:orderid/cancel', order.cancel);
};
/*
routes.js export to index.js 
models export to db.js
controllers import from db.js to call db.model.action
controllers exports to routes

*/
