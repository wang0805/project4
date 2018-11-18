import React, { Component } from "react";

class Signup extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      name: "",
      password: ""
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      name: this.state.name,
      password: this.state.password
    };
    console.log(data);

    // axios
    //   .post(`http://localhost:3000/users/login`, { data })
    //   .then(() => {
    //     console.log("success");
    //   })
    //   .catch(err => console.log(err));

    fetch("/users/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data })
    });
  }
  render() {
    return (
      <div class="container">
        <div class="row jumbotron">
          <h1>REGISTER</h1>
        </div>
        <div class="row">
          <div class="col-lg-12 col-sm-12 col-xs-12">
            <form onSubmit={this.handleSubmit}>
              <div class="form-group row">
                <label for="inputUser5">User Name</label>
                <input
                  name="name"
                  type="text"
                  id="inputUser5"
                  class="form-control"
                  aria-describedby="usernameHelpBlock"
                  onChange={this.handleChange}
                />
                <small id="usernameHelpBlock" class="form-text text-muted">
                  Enter your desired user login name
                </small>
              </div>
              <div class="form-group row">
                <label for="inputPassword5">Password</label>
                <input
                  name="password"
                  type="password"
                  id="inputPassword5"
                  class="form-control"
                  aria-describedby="passwordHelpBlock"
                  onChange={this.handleChange}
                />
                <small id="passwordHelpBlock" class="form-text text-muted">
                  Your password must be 8-20 characters long, contain letters
                  and numbers, and must not contain spaces, special characters,
                  or emoji.
                </small>
              </div>
              <div class="form-group row">
                <button class="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
