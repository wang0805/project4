import React, {Component, Fragment} from 'react';
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
import Grid from '@material-ui/core/Grid';
import MUIDataTable from 'mui-datatables';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import AddIcon from '@material-ui/icons/Add';

import TestingChat from './chat/testingChat';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  root: {
    flexGrow: 1,
    marginLeft: 10,
    marginRight: 10
  },
  root1: {
    width: '400'
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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
      messages: [],
      socket: null,
      chatrooms: [],
      chatPopup: false
    };
  }

  handleChatOpen = () => {
    this.setState({chatPopup: true});
  };

  handleChatClose = () => {
    this.setState({chatPopup: false});
  };

  setJoinedRoom = (params) => {
    this.setState({chatrooms: params});
  };

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

  compare(a, b) {
    if (parseInt(b) > parseInt(a)) {
      return `${a}to${b}`;
    } else {
      return `${b}to${a}`;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.idMarker != prevProps.idMarker) {
      let room = this.compare(this.props.user, this.props.idMarker);
      //to check if already joined room, as can be joined by other users
      let inChatrooms = false;
      this.state.chatrooms.forEach(function(rooms) {
        if (rooms.room === room) {
          inChatrooms = true;
        }
      });
      //synchronous
      if (inChatrooms === false) {
        this.setState({chatrooms: [...this.state.chatrooms, {room: room, joined: true}]});
        this.state.socket.emit('joinRoom', room);
      }
    }
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

    const socket = openSocket('/');
    this.setState({socket});
    socket.on('success', (room) => {
      console.log(`success in joining room: ${room}`);
      if (room.split('to').includes(this.props.user.toString())) {
        let inChatrooms = false;
        this.state.chatrooms.forEach(function(rooms) {
          if (rooms.room === room) {
            inChatrooms = true;
          }
        });
        if (inChatrooms === false) {
          this.setState({chatrooms: [...this.state.chatrooms, {room: room, joined: false}]});
        }
      }
      console.log('current chat rooms ~~~ ', this.state.chatrooms);
    });

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
    const socket = openSocket('/');
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
      <Fragment>
        <Dialog fullScreen open={this.state.chatPopup} onClose={this.handleChatClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleChatClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Chatbox
              </Typography>
              <Button color="inherit" onClick={this.handleChatClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.root1}>
            {this.state.chatrooms.map((room, index) => (
              <TestingChat
                key={index}
                room={room}
                user={this.props.user}
                username={this.props.username}
                socket={this.state.socket}
                chatrooms={this.state.chatrooms}
                setJoinedRoom={this.setJoinedRoom}
              />
            ))}
          </div>
        </Dialog>

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
              <Grid container direction="rows" justify="space-evenly" alignItems="center">
                <Grid item>
                  <div>
                    {this.props.loggedin && (
                      <Button
                        style={{position: 'relative'}}
                        className={classes.button}
                        onClick={this.handleClickOpen(this.state.scroll)}
                        variant="fab"
                        color="primary"
                        mini
                      >
                        <AddIcon />
                      </Button>
                    )}
                  </div>
                </Grid>
                <Grid item>
                  {/* <div className={classes.root1}>
                {this.state.chatrooms.map((room, index) => (
                  <TestingChat
                    key={index}
                    room={room}
                    user={this.props.user}
                    username={this.props.username}
                    socket={this.state.socket}
                    chatrooms={this.state.chatrooms}
                    setJoinedRoom={this.setJoinedRoom}
                  />
                ))}
              </div> */}
                  <div>
                    {this.props.loggedin && (
                      <Button className={classes.button} onClick={this.handleChatOpen}>
                        Chatroom
                      </Button>
                    )}
                  </div>
                </Grid>
                {/* <Grid item>
                  <div>
                    {this.props.loggedin && (
                      <Button className={classes.button} onClick={() => this.handleChat(!this.state.displaychat)}>
                        Display Chatbox
                      </Button>
                    )}
                  </div>
                </Grid> */}
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
      </Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
