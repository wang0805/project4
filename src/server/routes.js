module.exports = (app, db) => {
  const users = require('./controllers/user')(db);
  const order = require('./controllers/orders')(db);

  /*
   *  =========================================
   *  Users
   *  =========================================
   */

  // CRUD

  // app.get("/users/new", users.newForm); // users/new has to be first other :id will overwrite and new != int
  // app.get("/users/:id/order/:orderid/edit", order.edit);
  // app.get("/users/:id/order/:orderid/cancel", order.cfmcancel);
  // app.get("/users/:id/profile", users.profile);
  // app.get("/users/:id", users.layout);
  // app.get("/users", users.layout);
  app.get('/api/orders', order.activeIndex);

  app.post('/users/create', users.create);
  app.post('/users/logout', users.logout);
  app.post('/users/login', users.login);
  app.post('/order/new', order.create);

  // app.put("/order/:orderid/edit", order.update);
  // app.put("/order/:orderid/cancel", order.cancel);
};
/*
routes.js export to index.js 
models export to db.js
controllers import from db.js to call db.model.action
controllers exports to routes

*/
