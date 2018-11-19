module.exports = dbPoolInstance => {
  const activeIndex = callback => {
    const query =
      "SELECT id, ticker, ordertype, price, orderstatus, quantity, available_till, user_id FROM orders ORDER BY ticker, ordertype, price DESC;";

    dbPoolInstance.query(query, (error, result) => {
      callback(error, result);
      //console.log("select all for active indexs: ",result.rows);
    });
  };

  //   const index = callback => {
  //     //asc so as to employ the FIFO logic, if not each time an order is edited it is pushed dowwnwards in SQL
  //     const query = "SELECT * FROM orders ORDER BY id ASC";

  //     dbPoolInstance.query(query, (error, result) => {
  //       callback(error, result);
  //       //console.log("select all from orders: ",result.rows);
  //     });
  //   };

  const create = (newObj, callback) => {
    const query =
      "INSERT INTO orders (ticker, ordertype, price, quantity, orderstatus, meet_address, meet_lat, meet_long, available_till, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;";
    const values = [
      newObj.ticker.toUpperCase(),
      newObj.ordertype,
      newObj.price,
      newObj.quantity,
      "active",
      newObj.meet_address,
      newObj.meet_lat,
      newObj.meet_long,
      newObj.available_till,
      newObj.user_id
    ];

    dbPoolInstance.query(query, values, (error, result) => {
      callback(error, result);
      console.log("id from orders create: ", result.rows);
    });
  };

  //   const edit = (orderid, callback) => {
  //     const query = "SELECT * FROM orders WHERE id=$1";
  //     const values = [orderid];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //       //console.log("select all from orders where user: ",result.rows);
  //     });
  //   };

  // const update = (updateObj, callback) => {

  // 	const query = "UPDATE orders SET price=$1, qty=$2 WHERE id=$3;";
  // 	const values = [updateObj.price, updateObj.qty, updateObj.id];

  // 	dbPoolInstance.query(query, values, (error, result) => {
  // 		callback(error, result);
  // 		//console.log("updated orders: ",result.rows);
  // 	})
  // }

  //   const update = (updateObj, callback) => {
  //     const query =
  //       "INSERT INTO orders (ticker, ordertype, price, qty, orderstatus, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;";
  //     const values = [
  //       updateObj.ticker,
  //       updateObj.ordertype,
  //       updateObj.price,
  //       updateObj.qty,
  //       "active",
  //       updateObj.user_id
  //     ];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //     });
  //   };

  //   const destroy = (orderid, callback) => {
  //     const query = "DELETE FROM orders WHERE id=$1;";
  //     const values = [orderid];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //     });
  //   };

  //   const cancel = (id, callback) => {
  //     const query = "UPDATE orders SET orderstatus=$1 WHERE id=$2";
  //     values = ["cancelled", id];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //     });
  //   };

  //   const updateMore = (id, qty, status, callback) => {
  //     const query = "UPDATE orders SET qty=$1, orderstatus=$2 WHERE id=$3";
  //     const values = [qty, status, id];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //     });
  //   };

  //   const updateLess = (id, qty, callback) => {
  //     const query = "UPDATE orders SET qty=$1, orderstatus=$2 WHERE id=$3";

  //     var status;
  //     if (qty === 0) {
  //       status = "filled";
  //     } else if (qty > 0) {
  //       status = "active";
  //     }
  //     const values = [qty, status, id];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //     });
  //   };

  //   const createTrans = (a_orderid, b_orderid, qty, price, ticker, callback) => {
  //     const query =
  //       "INSERT INTO transactions (a_orderid, b_orderid, qty, price, ticker) VALUES ($1, $2, $3, $4, $5);";
  //     const values = [a_orderid, b_orderid, qty, price, ticker];

  //     dbPoolInstance.query(query, values, (error, result) => {
  //       callback(error, result);
  //     });
  //   };

  return {
    activeIndex,
    create
    // index,
    // edit,
    // update,
    // destroy,
    // cancel,
    // updateMore,
    // updateLess,
    // createTrans
  };
};
