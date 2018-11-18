import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/signup";
import Navbar from "./components/navbar";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: ""
    };
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(App);
