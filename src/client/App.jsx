import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/signup';
import Navbar from './components/navbar';
import Home from './components/home';
import NewOrder from './components/newOrder';
// import Socket from './components/socket';

class App extends Component {
  constructor() {
    super();

    myFunction = this.useridMarker.bind(this);
    this.setLogin = this.setLogin.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.state = {
      loggedIn: false,
      user: '',
      username: '',
      idMarker: null
    };
  }

  useridMarker(event) {
    // var user_id = event.target.dataset.foo; -> get userid of marker
    this.setState({idMarker: parseInt(event.target.dataset.foo)});
    console.log('user marker u clicking ~~~~', event.target.dataset.foo);
    //debugger;
  }

  setLogin(params) {
    this.setState({loggedIn: params});
  }

  setUser(params) {
    this.setState({user: params});
  }

  setUsername(params) {
    this.setState({username: params});
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar
            loggedin={this.state.loggedIn}
            user={this.state.user}
            username={this.state.username}
            setLogin={this.setLogin}
            setUser={this.setUser}
            setUsername={this.setUsername}
          />
          <Switch>
            <Route
              path="/home"
              render={() => (
                <Home
                  loggedin={this.state.loggedIn}
                  user={this.state.user}
                  username={this.state.username}
                  idMarker={this.state.idMarker}
                  setLogin={this.setLogin}
                  setUser={this.setUser}
                  setUsername={this.setUsername}
                />
              )}
            />
            <Route
              path="/login"
              render={() => (
                <Login
                  loggedin={this.state.loggedIn}
                  user={this.state.user}
                  username={this.state.username}
                  setLogin={this.setLogin}
                  setUser={this.setUser}
                  setUsername={this.setUsername}
                />
              )}
            />
            <Route
              path="/signup"
              render={() => (
                <Signup loggedin={this.state.loggedIn} user={this.state.user} username={this.state.username} />
              )}
            />
            <Route
              path="/neworder"
              render={() => (
                <NewOrder loggedin={this.state.loggedIn} user={this.state.user} username={this.state.username} />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(App);
