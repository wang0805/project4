import React, {Component} from 'react';
// import {Link} from 'react-router-dom'; //link to login router if required
import NewOrder from './newOrder';
import Map from './map';
import openSocket from 'socket.io-client';
import Chatroom from './chat/chatroom';
// import {socketfuncs} from './functions'; //if using helper functions
import Orders from './orders';
import MyOrders from './myorders';
import CurrentPrice from './currentPrice';
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

    // socket = openSocket('http://127.0.0.1:3000');
    socket = openSocket('https://sheltered-badlands-12857.herokuapp.com/');
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
    // socket = openSocket('http://127.0.0.1:3000');
    socket = openSocket('https://sheltered-badlands-12857.herokuapp.com/');
    socket.emit('added order', data);
  }

  handleClickDisplay(params) {
    this.setState({displayadd: params});
  } // ready to remove

  handleClickOpen = (scroll) => () => {
    this.setState({displayadd: true, scroll});
  };

  handleClickClose = () => {
    console.log('checking if display add order is closed ~~~~~~~~~~~~~~~~~~~');
    this.setState({displayadd: false});
  };

  render() {
    const {classes} = this.props;

    //MUI theme
    const columns = ['ticker', 'Buy/Sell', 'quantity', 'orderstatus', 'action'];
    const options = {
      filterType: 'checkbox'
    };
    let newArry = []; //get array of data in array format for MUI theme
    const result = this.state.result.filter((c) => c.orderstatus === 'active' && c.user_id != this.props.user);
    result.map((obj, index) => {
      let arr = [];
      arr.push(obj.ticker);
      arr.push(obj.ordertype);
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

          {/* this is a open dialog box so doesnt matter where it is */}
          {this.state.displayadd && (
            <NewOrder
              user={this.props.user}
              displayClose={this.handleClickClose}
              update={this.updateOrder}
              displayadd={this.state.displayadd}
            />
          )}
          {this.state.result.length > 0 && (
            <Grid item xs={12} sm={8}>
              {/* <Orders result={this.state.result} user={this.props.user} /> */}
              <MUIDataTable title={'All Orders'} data={newArry} columns={columns} options={options} />

              <MyOrders user={this.props.user} result={this.state.result} updateOrder={this.updateOrder} />
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
              <Grid item>
                <div>
                  {this.props.loggedin && (
                    <Button
                      variant="extendedFab"
                      aria-label="Delete"
                      className={classes.button}
                      onClick={this.handleClickOpen(this.state.scroll)}
                    >
                      <NavigationIcon className={classes.extendedIcon} />
                      Add order
                    </Button>
                  )}
                </div>
              </Grid>
              <Grid item>
                <div>
                  {this.props.loggedin && (
                    <Button
                      variant="extendedFab"
                      aria-label="Delete"
                      className={classes.button}
                      onClick={() => this.handleChat(!this.state.displaychat)}
                    >
                      <NavigationIcon className={classes.extendedIcon} />
                      Display Chatroom
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
            <br />
            <br />
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
              <Grid container direction="column" justify="space-evenly" alignItems="center">
                <Grid item>
                  <CurrentPrice />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
