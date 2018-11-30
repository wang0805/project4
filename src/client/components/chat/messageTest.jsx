import React, {Component} from 'react';

class MessageTest extends Component {
  render() {
    return (
      <div>
        {this.props.username === this.props.message.from ? (
          <div>{this.props.message.message}</div>
        ) : (
          <div>
            From: {this.props.message.from} || {this.props.message.message}
          </div>
        )}
      </div>
    );
  }
}

export default MessageTest;
