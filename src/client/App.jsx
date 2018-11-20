import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/signup';
import Navbar from './components/navbar';
import Home from './components/home';
import NewOrder from './components/newOrder';

class App extends Component {
  constructor() {
    super();
    this.setLogin = this.setLogin.bind(this);
    this.setUser = this.setUser.bind(this);
    this.state = {
      loggedIn: false,
      user: ''
    };
  }

  setLogin(params) {
    this.setState({loggedIn: params});
  }

  setUser(params) {
    this.setState({user: params});
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar
            loggedin={this.state.loggedIn}
            user={this.state.user}
            setLogin={this.setLogin}
            setUser={this.setUser}
          />
          <Switch>
            <Route path="/home" render={() => <Home loggedin={this.state.loggedIn} user={this.state.user} />} />
            <Route
              path="/login"
              render={() => (
                <Login
                  loggedin={this.state.loggedIn}
                  user={this.state.user}
                  setLogin={this.setLogin}
                  setUser={this.setUser}
                />
              )}
            />
            <Route path="/signup" render={() => <Signup loggedin={this.state.loggedIn} user={this.state.user} />} />
            <Route path="/neworder" render={() => <NewOrder loggedin={this.state.loggedIn} user={this.state.user} />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(App);
