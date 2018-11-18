import React, { Component } from "react";
import { hot } from "react-hot-loader";

import Counter from "./components/counter/counter";
import Form from "./components/form/form";

class App extends Component {
  constructor() {
    super();
    this.state = {
      message: "hello"
    };
  }

  render() {
    return (
      <div>
        <Form />
        Welcome.
        <Counter message={this.state.message} />
      </div>
    );
  }
}

export default hot(module)(App);
