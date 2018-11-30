import React, {Component} from 'react';
import MessageTest from './messageTest';

class TestingChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      messages: [],
      message: '',
      from: '',
      to: ''
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
    // let user = this.props.user;
    // let array = this.props.room.split('to');
    // if (parseInt(array[0]) === user) {
    //   this.setState({from: user, to: parseInt(array[1])});
    // } else if (parseInt(array[1]) === user) {
    //   this.setState({from: user, to: parseInt(array[0])});
    // }
    socket.on('message', (data) => {
      console.log('data received from server to testing chat', data);
      if (data.room === this.props.room) {
        this.setState({messages: [...this.state.messages, data.data]});
      }
    });
  }

  render() {
    console.log(this.props, 'props of testing chat');
    // console.log(this.state, 'states of testing chat');
    let msg = this.state.messages.map((message, index) => {
      return <MessageTest key={index} message={message} username={this.props.username} />;
    });

    return (
      <div>
        <div>Chat</div>
        <div>{msg}</div>
        <form onSubmit={this.sendMessage}>
          <input value={this.state.message} onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}

export default TestingChat;
