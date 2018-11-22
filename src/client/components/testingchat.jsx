import React, {Component} from 'react';
import Message from './message';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 10
  }
});

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      myUser: null,
      receiver: null,
      messages: [],
      input: '',
      styles: {marginTop: '19px'}
    };
    this.handleClick = this.handleClick.bind(this);
    this.setMsg = this.setMsg.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.messages != prevProps.messages) {
      this.setState({
        myUser: this.props.user,
        receiver: this.props.idMarker,
        messages: this.props.messages
      });
      console.log('is state updated in update? ~~~~~~~~~~~', this.state);
    }
  }

  componentDidMount() {
    this.setState({
      myUser: this.props.user,
      receiver: this.props.idMarker,
      messages: this.props.messages
    });
    console.log(this.state, 'states of chatroom ~~~~~~~~');
    console.log(this.props, 'passing props to chatroom ~~~~~');
  }

  setMsg(event) {
    this.setState({input: event.target.value});
  }

  handleClick(event) {
    event.preventDefault();
    let data = {message: true, to: this.props.idMarker, from: this.props.user, content: this.state.input};
    console.log('data from input field ~~~ ', data);
    this.props.handleMessage(data);
    this.setState({input: ''});
  }
  render() {
    const {classes} = this.props;
    let msg = this.state.messages.map((message, index) => {
      if (this.props.user === message.to || this.props.user === message.from) {
        return (
          <Grid item xs={12} key={index}>
            <Message message={message.content} to={message.to} from={message.from} />
          </Grid>
        );
      }
    });
    return (
      <div className={classes.root}>
        <Grid item xs={12}>
          <form onSubmit={this.handleClick}>
            <input style={this.state.styles} value={this.state.input} onChange={this.setMsg} />
            <button type="submit">Submit</button>
          </form>
        </Grid>
        {msg}
      </div>
    );
  }
}

Chatroom.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chatroom);
