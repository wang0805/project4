import React, {Component} from 'react';
import Message from './message';

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      myUser: null,
      receiver: null,
      messages: [],
      input: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.setMsg = this.setMsg.bind(this);
  }

  componentWillMount() {
    this.setState({
      myUser: this.props.user,
      receiver: this.props.idMarker,
      messages: this.props.messages
    });
  }

  componentDidMount() {
    console.log(this.state, 'states of chatroom ~~~~~~~~');
    console.log(this.props, 'passing props to chatroom ~~~~~');
  }

  setMsg(event) {
    this.setState({input: event.target.value});
  }

  handleClick(event) {
    event.preventDefault();
    let data = {message: true, to: this.state.receiver, from: this.state.myUser, content: this.state.input};
    console.log('data from input fielddddd', data);
    this.props.handleMessage(data);
    this.setState({input: ''});
  }
  render() {
    let msg = this.state.messages.map((message, index) => {
      if (this.props.user === message.to || this.props.user === message.from) {
        return <Message key={index} message={message.content} to={message.to} from={message.from} />;
      }
    });
    return (
      <div>
        <div>
          <form onSubmit={this.handleClick}>
            <input value={this.state.input} onChange={this.setMsg} />
            <button type="submit">Submit</button>
          </form>
        </div>
        {msg}
      </div>
    );
  }
}

export default Chatroom;
