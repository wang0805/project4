import React, {Component} from 'react';
import Message from './message';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import CurrentPrice from '../currentPrice';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 10
  },
  card: {
    width: 400,
    height: 345,
    overflow: 'auto',
    marginTop: 0
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
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
      styles: {borderRadius: 5, paddingTop: 10, paddingBottom: 10, position: 'relative', left: 8, top: 2}
    };
    this.handleClick = this.handleClick.bind(this);
    this.setMsg = this.setMsg.bind(this);
  }

  //check parent component if state is being updated
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
    let data = {
      message: true,
      to: this.props.idMarker,
      from: this.props.user,
      fromUser: this.props.username,
      content: this.state.input
    };
    console.log('data from input field ~~~ ', data);
    this.props.handleMessage(data);
    this.setState({input: ''});
  }
  render() {
    const {classes} = this.props;

    let msg = this.state.messages.map((message, index) => {
      if (this.props.user === message.to || this.props.user === message.from) {
        return (
          <Typography component="p">
            <Message message={message.content} to={message.to} from={message.from} fromUser={message.fromUser} />
          </Typography>
        );
      }
    });

    let placeHolder = 'Chat to User no.' + this.props.idMarker;

    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  Chatroom
                </Typography>
                {msg}
              </CardContent>
            </CardActionArea>
            <CardActions>
              <form onSubmit={this.handleClick}>
                <input
                  style={this.state.styles}
                  value={this.state.input}
                  onChange={this.setMsg}
                  placeholder={placeHolder}
                />
                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                  Send
                  <Icon className={classes.rightIcon}>send</Icon>
                </Button>
              </form>
            </CardActions>
          </Card>
        </Grid>
        <br />
        <br />
        <Grid item>
          <CurrentPrice />
        </Grid>
      </Grid>
    );
  }
}

Chatroom.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chatroom);
