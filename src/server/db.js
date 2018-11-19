const pg = require("pg");
const user = require("./models/user");
const order = require("./models/order");

var configs = {
  user: "wangwh",
  host: "127.0.0.1",
  database: "project4",
  port: 5432
};

const pool = new pg.Pool(configs);

pool.on("error", function(err) {
  console.log("idle client error", err.message, err.stack);
});

module.exports = {
  /*
   * ADD APP MODELS HERE
   */
  user: user(pool),
  order: order(pool),

  //make queries directly from here
  queryInterface: (text, params, callback) => {
    return pool.query(text, params, callback);
  },

  // get a reference to end the connection pool at server end
  pool: pool
};
