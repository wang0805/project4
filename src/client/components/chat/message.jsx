import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
      <div>
        {this.props.to} {this.props.from} {this.props.message}
      </div>
    );
  }
}

export default Message;
