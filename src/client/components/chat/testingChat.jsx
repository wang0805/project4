import React, {Component} from 'react';
import MessageTest from './messageTest';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class TestingChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      messages: [],
      message: ''
    };
  }

  handleChange = (e) => {
    this.setState({message: e.target.value});
  };

  sendMessage = (e) => {
    e.preventDefault();
    this.props.socket.emit(this.props.room, {
      room: this.state.room,
      data: {message: this.state.message, from: this.props.username}
    });
    // this.setState({messages: [...this.state.messages, e.target.value]});
  };

  componentWillMount() {
    //since component didnt update for other user, joinedRoom will be false hence join room
    if (!this.props.joinedRoom) {
      this.props.socket.emit('joinRoom', this.props.room);
    }
    this.props.setJoinedRoom(); //set the joinedRoom back to false for other msg pop ups

    const {socket} = this.props;
    this.setState({room: this.props.room});

    socket.on('message', (data) => {
      console.log('data received from server to testing chat', data);
      if (data.room === this.props.room) {
        this.setState({messages: [...this.state.messages, data.data]});
      }
    });
  }

  componentWillUnmount() {
    this.props.socket.emit('leaveRoom', {room: this.props.room, user: this.props.user});
  }

  render() {
    const {classes} = this.props;
    console.log(this.props, 'props of testing chat');
    // console.log(this.state, 'states of testing chat');
    let msg = this.state.messages.map((message, index) => {
      return <MessageTest key={index} message={message} username={this.props.username} />;
    });

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Room: {this.props.room}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            {msg}
            <div>
              <form onSubmit={this.sendMessage}>
                <input
                  style={{borderRadius: 5, width: '100%'}}
                  value={this.state.message}
                  onChange={this.handleChange}
                />
              </form>
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

TestingChat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TestingChat);
