import React, {Component} from 'react';
import {Link} from 'react-router-dom'; //link to login router if required
import NewOrder from './newOrder';
import Map from './map';

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
        <td className="orderstatus text-center">{this.props.order.orderstatus}</td>
        {this.props.order.user_id !== parseInt(this.props.user) ? (
          this.props.order.ordertype === 'B' ? (
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
    const result = this.props.result.filter((c) => c.orderstatus == 'active');
    console.log('results of filtering', result);
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
          {result.map((order, index) => <Order key={index} order={order} user={this.props.user} />)}
        </table>
      </div>
    );
  }
}

class MyOrders extends Component {
  render() {
    console.log('props for myorders: ', this.props);
    const result = this.props.result.filter((c) => c.user_id === parseInt(this.props.user));
    console.log('results of filtering', result);
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
          {result.map((order, index) => <Order key={index} order={order} user={this.props.user} />)}
        </table>
      </div>
    );
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      result: [],
      displayadd: false
    };
  }

  updateOrder() {
    fetch('api/orders')
      .then((res) => res.json())
      .then((resultrows) => this.setState({result: resultrows}, () => console.log('result of fetch:', resultrows)));
  }

  componentDidMount() {
    this.updateOrder();
  }

  handleClick(params) {
    this.setState({displayadd: params});
  }

  render() {
    return (
      <div>
        <div>
          {this.state.result.length > 0 && <Map result={this.state.result} />}
          {this.state.displayadd ? (
            <NewOrder
              user={this.props.user}
              displayOrd={this.handleClick}
              display={this.state.displayadd}
              update={this.updateOrder}
            />
          ) : (
            <AllOrders result={this.state.result} />
          )}
        </div>
        <div>This are all your orders :)</div>
        <div>
          {this.props.loggedin && (
            <div>
              {/* <Link to="/neworder">New Order pls</Link> */}
              <button onClick={() => this.handleClick(!this.state.displayadd)}>Add order</button>
              <MyOrders user={this.props.user} result={this.state.result} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
