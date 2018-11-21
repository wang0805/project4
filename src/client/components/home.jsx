import React, {Component} from 'react';
// import {Link} from 'react-router-dom'; //link to login router if required
import NewOrder from './newOrder';
import Map from './map';
import socketIOClient from 'socket.io-client';
import Chatroom from './chat/chatroom';
// import {socketfuncs} from './functions'; //if using helper functions
import Orders from './orders';
import MyOrders from './myorders';
//material ui
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

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
            <td>Sell*change</td>
          ) : (
            <td>Buy*change</td>
          )
        ) : (
          <td />
        )}
      </tr>
    );
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
    this.handleClickDisplay = this.handleClickDisplay.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.state = {
      result: [],
      displayadd: false,
      displaychat: false,
      messages: []
    };
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
        console.log('testing if orders live updating works ~~~~~~~');
        fetch('api/orders')
          .then((res) => res.json())
          .then((resultrows) => this.setState({result: resultrows}, () => console.log('result of fetch:', resultrows)));
      } else if (data.message === true) {
        console.log('display the messages from chat pls ~~~~~~~');
        this.setState({messages: [...this.state.messages, data]});
        this.setState({displaychat: false});
        this.setState({displaychat: true});
      } else {
        console.log('nothing here to see ~~~~~');
      }
    });
  }

  handleMessage(data) {
    const socket = socketIOClient('http://127.0.0.1:3000/');
    socket.emit('added order', data);
  }

  handleClickDisplay(params) {
    this.setState({displayadd: params});
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <div>
          {this.state.result.length > 0 && <Map result={this.state.result} />}
          {this.state.displayadd ? (
            <NewOrder
              user={this.props.user}
              displayOrd={this.handleClickDisplay}
              display={this.state.displayadd}
              update={this.updateOrder}
            />
          ) : (
            ''
          )}
          {this.state.result.length > 0 && <Orders result={this.state.result} user={this.props.user} />}
        </div>
        {this.props.loggedin && (
          <button onClick={() => this.handleChat(!this.state.displaychat)}>Display chat room</button>
        )}
        {this.state.displaychat ? (
          <Chatroom
            username={this.props.username}
            user={this.props.user}
            idMarker={this.props.idMarker}
            messages={this.state.messages}
            setMsgs={this.state.setMsgs}
            handleMessage={this.handleMessage}
          />
        ) : (
          ''
        )}
        <div>This are all your orders :)</div>
        <div>
          {this.props.loggedin && (
            <div>
              <Button
                variant="extendedFab"
                aria-label="Delete"
                className={classes.button}
                onClick={() => this.handleClickDisplay(!this.state.displayadd)}
              >
                <NavigationIcon className={classes.extendedIcon} />
                Add order
              </Button>
              <MyOrders user={this.props.user} result={this.state.result} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);

// class AllOrders extends Component {
//   render() {
//     const result = this.props.result.filter((c) => c.orderstatus == 'active' && c.user_id != this.props.user);
//     return (
//       <div>
//         <table>
//           <tr>
//             <th class="text-center" scope="col">
//               Ticker
//             </th>
//             <th class="text-center" scope="col">
//               Buy/Sell
//             </th>
//             <th class="text-center" scope="col">
//               Price
//             </th>
//             <th class="text-center" scope="col">
//               Quantity
//             </th>
//             <th class="text-center" scope="col">
//               Status
//             </th>
//             <th class="text-center" scope="col">
//               sell or buy
//             </th>
//           </tr>
//           {result.map((order, index) => <Order key={index} order={order} user={this.props.user} />)}
//         </table>
//       </div>
//     );
//   }
// }

// class MyOrders extends Component {
//   render() {
//     console.log('props for myorders: ', this.props);
//     const result = this.props.result.filter((c) => c.user_id === parseInt(this.props.user));
//     console.log('results of filtering', result);
//     return (
//       <div>
//         <table>
//           <tr>
//             <th class="text-center" scope="col">
//               Ticker
//             </th>
//             <th class="text-center" scope="col">
//               Buy/Sell
//             </th>
//             <th class="text-center" scope="col">
//               Price
//             </th>
//             <th class="text-center" scope="col">
//               Quantity
//             </th>
//             <th class="text-center" scope="col">
//               Status
//             </th>
//             <th class="text-center" scope="col">
//               sell or buy
//             </th>
//           </tr>
//           {result.map((order, index) => <Order key={index} order={order} user={this.props.user} />)}
//         </table>
//       </div>
//     );
//   }
// }
