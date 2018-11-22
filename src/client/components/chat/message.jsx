import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
      <div>
        <strong>To: </strong> {this.props.to} <strong>From: </strong> {this.props.fromUser} <strong>Text: </strong>
        {this.props.message}
      </div>
    );
  }
}

export default Message;
