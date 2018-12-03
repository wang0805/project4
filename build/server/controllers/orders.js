const sha256 = require('js-sha256');
const SALT = 'fxchange';
const socketfuncs = require('../functions'); //server has to use require not import

module.exports = (db) => {
  //var orderStatus = ['active', 'expired', 'cancelled'];
  const activeIndex = (request, response) => {
    db.order.activeIndex((error, result) => {
      if (error) {
        console.log('error', error);
        response.sendStatus(500);
      } else {
        // console.log('active index result rows: ', result.rows);
        //response.render('order/activeindex', {orders: result.rows});
        var resultrows = result.rows;
        response.json(resultrows);
      }
    });
  };

  const create = (request, response) => {
    console.log('create orders request:', request.body);
    db.order.create(request.body, (error, result) => {
      if (error) {
        console.error('error: ', error);
        response.sendStatus(500);
      } else {
        // console.log('result of create orders rows', result.rows);

        //if postdata suceeds, emit to server to be broadcast to others
        let data = {addOrder: true, currencyPair: 'usd/sgd', amount: '10'};
        socketfuncs.addOrder(data);
        response.send('works!');
      }
    });
  };

  const cancel = (request, response) => {
    console.log(request.params.orderid, 'printing cancelling ~~~~~~~~');
    db.order.cancel(request.params.orderid, (error, result) => {
      if (error) {
        console.log('error', error);
        response.sendStatus(500);
      } else {
        response.send('order status changed to cancelled!');
      }
    });
  };

  /**
   * ===========================================
   * Export controller functions as a module
   * ===========================================
   */

  return {
    activeIndex,
    create,
    cancel
  };
};
