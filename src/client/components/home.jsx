import React, { Component } from "react";
import { Link } from "react-router-dom";

class Order extends Component {
  render() {
    return (
      <tr>
        <th className="orderticker text-center" scope="row">
          {this.props.order.ticker}
        </th>
        <td class="text-center">{this.props.order.ordertype}</td>
        <td class="text-center">{this.props.order.price}</td>
        <td class="text-center">{this.props.order.quantity}</td>
        <td className="orderstatus text-center">
          {this.props.order.orderstatus}
        </td>
        {this.props.order.user_id !== parseInt(this.props.user) ? (
          this.props.order.ordertype === "B" ? (
            <td>Sell*</td>
          ) : (
            <td>Buy*</td>
          )
        ) : (
          <td />
        )}
      </tr>
    );
  }
}

class AllOrders extends Component {
  render() {
    const result = this.props.result.filter(c => c.orderstatus == "active");
    console.log("results of filtering", result);
    return (
      <div>
        <table>
          <tr>
            <th class="text-center" scope="col">
              Ticker
            </th>
            <th class="text-center" scope="col">
              Buy/Sell
            </th>
            <th class="text-center" scope="col">
              Price
            </th>
            <th class="text-center" scope="col">
              Quantity
            </th>
            <th class="text-center" scope="col">
              Status
            </th>
            <th class="text-center" scope="col">
              sell or buy
            </th>
          </tr>
          {result.map((order, index) => (
            <Order key={index} order={order} user={this.props.user} />
          ))}
        </table>
      </div>
    );
  }
}

class MyOrders extends Component {
  render() {
    console.log("props for myorders: ", this.props);
    const result = this.props.result.filter(
      c => c.user_id === parseInt(this.props.user)
    );
    console.log("results of filtering", result);
    return (
      <div>
        <table>
          <tr>
            <th class="text-center" scope="col">
              Ticker
            </th>
            <th class="text-center" scope="col">
              Buy/Sell
            </th>
            <th class="text-center" scope="col">
              Price
            </th>
            <th class="text-center" scope="col">
              Quantity
            </th>
            <th class="text-center" scope="col">
              Status
            </th>
            <th class="text-center" scope="col">
              sell or buy
            </th>
          </tr>
          {result.map((order, index) => (
            <Order key={index} order={order} user={this.props.user} />
          ))}
        </table>
      </div>
    );
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: []
    };
  }

  componentDidMount() {
    console.log("mounted");
    fetch("api/orders")
      .then(res => res.json())
      .then(resultrows =>
        this.setState({ result: resultrows }, () =>
          console.log("result of fetch:", resultrows)
        )
      );
  }

  render() {
    return (
      <div>
        <div>
          <AllOrders result={this.state.result} />
        </div>
        <div>this is all your orders :)</div>
        <div>
          {this.props.loggedin && (
            <div>
              <Link to="/neworder">New Order pls</Link>
              <MyOrders user={this.props.user} result={this.state.result} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
