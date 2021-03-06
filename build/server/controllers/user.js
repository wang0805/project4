var sha256 = require('js-sha256');
const SALT = 'fxchange';

module.exports = (db) => {
  /**
   * ===========================================
   * Controller logic
   * ===========================================
   */

  const index = (request, response) => {
    db.user.index((error, result) => {
      if (error) {
        console.error('error in getting back user index', error);
        request.sendStatus(500);
      } else {
        // console.log('user index result rows: ', result.rows);
        var resultrows = result.rows;
        response.json(resultrows);
      }
    });
  };

  const create = (request, response) => {
    db.user.create(request.body, (error, queryResult) => {
      if (error) {
        console.error('error getting user:', error);
        response.sendStatus(500);
      }

      if (queryResult.rowCount >= 1) {
        console.log('User created successfully');
      } else {
        console.log('User could not be created');
      }

      // redirect to home page after creation
      response.send('created');
    });
  };

  const login = (request, response) => {
    db.user.login(request.body, (error, result) => {
      // console.log('result controller for login: ', result.rows);
      if (error) {
        console.error('Query error', error);
      } else if (result.rows[0] != undefined) {
        let user_id = result.rows[0].id;
        if (sha256(request.body.password) === result.rows[0].password) {
          response.cookie('logged_in', sha256(SALT + user_id));
          response.cookie('username', request.body.name);
          response.cookie('user_id', user_id);
          console.log('successful logged in');
          response.send('logged in successfully');
        } else {
          response.send('wrong password');
        }
      } else {
        response.send('no such user');
      }
    });
  };

  const logout = (request, response) => {
    response.clearCookie('logged_in');
    response.clearCookie('user_id');
    response.clearCookie('username');

    response.send('clear');
  };

  /**
   * ===========================================
   * Export controller functions as a module
   * ===========================================
   */
  return {
    create,
    login,
    logout,
    index
  };
};
