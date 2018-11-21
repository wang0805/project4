import React, {Component} from 'react';
// import {Link} from 'react-router-dom'; //link to login router if required
import NewOrder from './newOrder';
import Map from './map';
import socketIOClient from 'socket.io-client';
import Chatroom from './chat/chatroom';
// import {socketfuncs} from './functions'; //if using helper functions

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
    this.setMsg = this.setMsg.bind(this);
    this.state = {
      result: [],
      displayadd: false,
      displaychat: false,
      message: '',
      messages: []
    };
  }

  setMsg(params) {
    this.setState({message: params});
  }
  setMsgs(params) {
    this.setState({messages: [...this.state.messages, params]});
  }

  handleChat(params) {
    this.setState({displaychat: params});
  }

  updateOrder() {
    fetch('api/orders')
      .then((res) => res.json())
      .then((resultrows) => this.setState({result: resultrows}, () => console.log('result of fetch:', resultrows)));
  }

  componentDidMount() {
    this.updateOrder();
    // -- set interval call from socket -- //
    // const {endpoint} = this.state;
    // const socket = socketIOClient(endpoint);
    // socket.on('APICALL', (data) => this.setState({result: data}));

    const socket = socketIOClient('http://127.0.0.1:3000/');
    socket.on('added order', (data) => {
      if (data.addOrder === true) {
        console.log(data);
        console.log('testing socket from sockets');
        fetch('api/orders')
          .then((res) => res.json())
          .then((resultrows) => this.setState({result: resultrows}, () => console.log('result of fetch:', resultrows)));
      } else {
        console.log('nothing yet');
      }
    });
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
        {this.props.loggedin && (
          <button onClick={() => this.handleChat(!this.state.displaychat)}>Display chat room</button>
        )}
        {this.state.displaychat ? <Chatroom username={this.props.username} user={this.props.user} /> : ''}
        <div>This are all your orders :)</div>
        <div>
          {this.props.loggedin && (
            <div>
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
