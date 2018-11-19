const sha256 = require("js-sha256");
const SALT = "fxchange";

module.exports = db => {
  //var orderStatus = ['active', 'expired', 'cancelled', 'filled'];
  const activeIndex = (request, response) => {
    db.order.activeIndex((error, result) => {
      if (error) {
        console.log("error", error);
        response.sendStatus(500);
      } else {
        console.log("active index result rows: ", result.rows);
        //response.render('order/activeindex', {orders: result.rows});
        var resultrows = result.rows;
        response.json(resultrows);
      }
    });
  };

  const create = (request, response) => {
    console.log("create orders request:", request.body);

    db.order.create(request.body, (error, result) => {
      if (error) {
        console.error("error: ", error);
        response.sendStatus(500);
      } else {
        console.log("result of create orders rows", result.rows);
        response.send("works!");
      }
    });
  };

  //   const edit = (request, response) => {
  //     //let user_id = request.cookies.user_id;
  //     let order_id = request.params.orderid;

  //     db.order.edit(order_id, (error, result) => {
  //       if (error) {
  //         console.log("error", error);
  //         response.sendStatus(500);
  //       } else {
  //         response.render("order/edit", result.rows[0]);
  //         console.log("results of edit", result.rows[0]);
  //       }
  //     });
  //   };

  //   const update = (request, response) => {
  //     console.log("request body of update:", request.body);
  //     db.order.update(request.body, (error, result) => {
  //       if (error) {
  //         console.log("error at update", error);
  //         response.sendStatus(500);
  //       } else {
  //         db.order.destroy(request.body.id, (error, result) => {
  //           if (error) {
  //             console.log("error at update", error);
  //             response.sendStatus(500);
  //           } else {
  //             response.redirect(`/users/${request.body.user_id}`);
  //           }
  //         });
  //       }
  //     });
  //   };

  //   const cfmcancel = (request, response) => {
  //     //let user_id = request.cookies.user_id;
  //     let order_id = request.params.orderid;

  //     db.order.edit(order_id, (error, result) => {
  //       if (error) {
  //         console.log("error", error);
  //         response.sendStatus(500);
  //       } else {
  //         response.render("order/cancel", result.rows[0]);
  //         console.log("results of cancel", result.rows[0]);
  //       }
  //     });
  //   };
  //   //destroy is updating orderstatus to cancelled and not removing from array
  //   const cancel = (request, response) => {
  //     db.order.cancel(request.body.id, (error, result) => {
  //       if (error) {
  //         console.log("error", error);
  //         response.sendStatus(500);
  //       } else {
  //         response.redirect(`/users/${request.body.user_id}`);
  //       }
  //     });
  //   };

  /**
   * ===========================================
   * Export controller functions as a module
   * ===========================================
   */

  return {
    activeIndex,
    create
    // edit,
    // update,
    // cfmcancel,
    // cancel
  };
};
