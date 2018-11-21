import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import Axios from 'axios';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  }
});

class Login extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.state = {
      name: '',
      password: '',
      username: '',
      showPassword: false
    };
  }

  readCookie(cookies) {
    var obj = {};
    var array = cookies.split(';');
    for (let i = 0; i < array.length; i++) {
      var newArr = array[i].split('=');
      obj[newArr[0]] = newArr[1];
    }
    return obj;
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleClickShowPassword() {
    this.setState((state) => ({showPassword: !state.showPassword}));
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      name: this.state.name,
      password: this.state.password
    };
    console.log(data);

    fetch('/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log(this.readCookie(document.cookie));
      var cookiesObj = this.readCookie(document.cookie);
      if (cookiesObj.logged_in) {
        this.props.setLogin(true);
        this.props.setUser(parseInt(cookiesObj[' user_id']));
        this.props.setUsername(cookiesObj[' username']);
        this.props.history.push('/home');
      }
    });
  }

  render() {
    const {classes} = this.props;
    console.log(this.props);
    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <FormControl
                className={classNames(classes.margin, classes.withoutLabel, classes.textField)}
                aria-describedby="name-helper-text"
              >
                <Input
                  id="adornment-weight"
                  name="name"
                  onChange={this.handleChange}
                  inputProps={{
                    'aria-label': 'Name'
                  }}
                />
                <FormHelperText id="name-helper-text">Name</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="adornment-password">Password</InputLabel>
                <Input
                  id="adornment-password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={this.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl>
                <input type="submit" value="submit" />
              </FormControl>
            </Grid>
          </Grid>
        </form>
        <div>
          <Link to="/signup">Signup</Link>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Login));
