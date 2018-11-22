import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
//material ui
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Navbar extends Component {
  constructor() {
    super();
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout(event) {
    event.preventDefault();

    fetch('/users/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log('success!');
      this.props.setLogin(false);
      this.props.setUser('');
      this.props.setUsername('');
    });
  }
  render() {
    console.log(this.props);
    const {classes} = this.props;
    const homeLink = (props) => <NavLink to="/home" {...props} />;
    const loginLink = (props) => <NavLink to="/login" {...props} />;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Exchange
            </Typography>
            <Button color="inherit" component={homeLink}>
              Home
            </Button>
            {!this.props.loggedin && (
              <Button color="inherit" component={loginLink}>
                Login
              </Button>
            )}
            {this.props.loggedin && (
              <form onSubmit={this.onLogout}>
                <Button type="submit" color="inherit">
                  Logout
                </Button>
              </form>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);
