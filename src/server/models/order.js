module.exports = (dbPoolInstance) => {
  const activeIndex = (callback) => {
    const query =
      'SELECT id, ticker, ordertype, price, orderstatus, quantity, meet_address, meet_lat, meet_long, available_till, user_id FROM orders ORDER BY ticker, ordertype, price DESC;';

    dbPoolInstance.query(query, (error, result) => {
      callback(error, result);
    });
  };

  const create = (newObj, callback) => {
    const query =
      'INSERT INTO orders (ticker, ordertype, price, quantity, orderstatus, meet_address, meet_lat, meet_long, available_till, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;';
    const values = [
      newObj.ticker.toUpperCase(),
      newObj.ordertype,
      newObj.price,
      newObj.quantity,
      'active',
      newObj.meet_address,
      newObj.meet_lat,
      newObj.meet_long,
      newObj.available_till,
      newObj.user_id
    ];

    dbPoolInstance.query(query, values, (error, result) => {
      callback(error, result);
      console.log('id from orders create: ', result.rows);
    });
  };

  const cancel = (id, callback) => {
    const query = 'UPDATE orders SET orderstatus=$1 WHERE id=$2';
    values = ['cancelled', id];

    dbPoolInstance.query(query, values, (error, result) => {
      callback(error, result);
    });
  };

  return {
    activeIndex,
    create,
    cancel
  };
};
