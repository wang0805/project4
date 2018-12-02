import React, {Component} from 'react';

class MessageTest extends Component {
  render() {
    return (
      <div>
        {this.props.username === this.props.message.from ? (
          <div style={{marginBottom: 17, textAlign: 'right'}}>
            <span
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 8
              }}
            >
              {this.props.message.message}
            </span>
          </div>
        ) : (
          <div style={{marginBottom: 17}}>
            <span
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 8
              }}
            >
              From: {this.props.message.from} || {this.props.message.message}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default MessageTest;
