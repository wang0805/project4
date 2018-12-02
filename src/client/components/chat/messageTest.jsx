import React, {Component} from 'react';

class MessageTest extends Component {
  render() {
    return (
      <div>
        {this.props.username === this.props.message.from ? (
          <div style={{marginBottom: 20, textAlign: 'right'}}>
            <span
              style={{
                borderStyle: 'solid',
                color: 'white',
                borderColor: '#3F51B5',
                backgroundColor: '#3F51B5',
                borderWidth: 1,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 8
              }}
            >
              {this.props.message.message}
            </span>
          </div>
        ) : (
          <div style={{marginBottom: 20}}>
            <span
              style={{
                borderStyle: 'solid',
                borderColor: '#3F51B5',
                color: 'white',
                backgroundColor: '#3F51B5',
                borderWidth: 1,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 8
              }}
            >
              {this.props.message.from}: {this.props.message.message}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default MessageTest;
