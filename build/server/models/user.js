var sha256 = require('js-sha256');

/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (dbPoolInstance) => {
  const index = (callback) => {
    const query = 'SELECT * FROM users ORDER BY id ASC';

    dbPoolInstance.query(query, (error, result) => {
      callback(error, result);
    });
  };

  const create = (user, callback) => {
    // run user input password through bcrypt to obtain hashed password

    var hashedValue = sha256(user.password);

    const queryString = 'INSERT INTO users (name, password) VALUES ($1, $2)';
    const values = [user.name, hashedValue];

    dbPoolInstance.query(queryString, values, (error, result) => {
      callback(error, result);
    });
  };

  const login = (user, callback) => {
    var hashedValue = sha256(user.password);
    let name = user.name;

    const queryString = `SELECT * FROM users WHERE name='${name}'`;

    // execute query
    dbPoolInstance.query(queryString, (error, result) => {
      callback(error, result);
      console.log('result models: ', result.rows);
    });
  };

  return {
    create,
    login,
    index
  };
};
