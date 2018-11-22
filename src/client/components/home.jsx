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
import Grid from '@material-ui/core/Grid';
import MUIDataTable from 'mui-datatables';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  root: {
    flexGrow: 1
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.updateOrder = this.updateOrder.bind(this);
    this.handleClickDisplay = this.handleClickDisplay.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.state = {
      result: [],
      displayadd: false,
      scroll: 'paper',
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

  readCookie(cookies) {
    var obj = {};
    var array = cookies.split(';');
    for (let i = 0; i < array.length; i++) {
      var newArr = array[i].split('=');
      obj[newArr[0]] = newArr[1];
    }
    return obj;
  }

  componentDidMount() {
    this.updateOrder();
    //if cookies not cleared - allow user to remain logged in if refresh
    var cookiesObj = this.readCookie(document.cookie);
    if (cookiesObj.logged_in) {
      this.props.setLogin(true);
      this.props.setUser(parseInt(cookiesObj[' user_id']));
      this.props.setUsername(cookiesObj[' username']);
    }
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
  } // ready to remove

  handleClickOpen = (scroll) => () => {
    this.setState({displayadd: true, scroll});
  };

  handleClickClose = () => {
    console.log('checking if close ~~~~~~~~~~~~~~~~~~~');
    this.setState({displayadd: false});
  };

  render() {
    const {classes} = this.props;

    //MUI theme
    const columns = ['ticker', 'Buy/Sell', 'price', 'quantity', 'orderstatus', 'action'];
    const options = {
      filterType: 'checkbox'
    };
    let newArry = []; //get array of data in array format for MUI theme
    const result = this.state.result.filter((c) => c.orderstatus === 'active' && c.user_id != this.props.user);
    result.map((obj, index) => {
      let arr = [];
      arr.push(obj.ticker);
      arr.push(obj.ordertype);
      arr.push(obj.price);
      arr.push(obj.quantity);
      arr.push(obj.orderstatus);
      if (obj.ordertype === 'B') {
        arr.push('Sell -->');
      } else if (obj.ordertype === 'S') {
        arr.push('Buy -->');
      }
      newArry.push(arr);
    });

    return (
      <div className={classes.root}>
        <Grid container spacing={32}>
          {this.state.result.length > 0 && (
            <Grid item xs={12}>
              <Map result={this.state.result} />
            </Grid>
          )}

          {this.state.displayadd ? (
            <NewOrder
              user={this.props.user}
              displayClose={this.handleClickClose}
              update={this.updateOrder}
              displayadd={this.state.displayadd}
            />
          ) : (
            ''
          )}

          {this.state.result.length > 0 && (
            <Grid item xs={12} sm={8}>
              {/* <Orders result={this.state.result} user={this.props.user} /> */}
              <MUIDataTable title={'All Orders'} data={newArry} columns={columns} options={options} />
            </Grid>
          )}

          {this.state.displaychat ? (
            <Grid item xs={12} sm={4}>
              <Chatroom
                username={this.props.username}
                user={this.props.user}
                idMarker={this.props.idMarker}
                messages={this.state.messages}
                setMsgs={this.state.setMsgs}
                handleMessage={this.handleMessage}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={4} />
          )}

          <Grid item xs={12} sm={8}>
            <MyOrders user={this.props.user} result={this.state.result} />
          </Grid>

          {this.props.loggedin && (
            <button onClick={() => this.handleChat(!this.state.displaychat)}>Display chat room</button>
          )}

          <div>
            {this.props.loggedin && (
              <div>
                <Button
                  variant="extendedFab"
                  aria-label="Delete"
                  className={classes.button}
                  onClick={this.handleClickOpen(this.state.scroll)}
                >
                  <NavigationIcon className={classes.extendedIcon} />
                  Add order
                </Button>
              </div>
            )}
          </div>
        </Grid>
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

// class Order extends Component {
//   render() {
//     return (
//       <tr>
//         <th className="orderticker text-center" scope="row">
//           {this.props.order.ticker}
//         </th>
//         <td class="text-center">{this.props.order.ordertype}</td>
//         <td class="text-center">{this.props.order.price}</td>
//         <td class="text-center">{this.props.order.quantity}</td>
//         <td className="orderstatus text-center">{this.props.order.orderstatus}</td>
//         {this.props.order.user_id !== parseInt(this.props.user) ? (
//           this.props.order.ordertype === 'B' ? (
//             <td>Sell*change</td>
//           ) : (
//             <td>Buy*change</td>
//           )
//         ) : (
//           <td />
//         )}
//       </tr>
//     );
//   }
// }
