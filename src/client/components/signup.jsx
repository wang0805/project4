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
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password
      })
    });
  }
  render() {
    return (
      <div>
        <h1>register</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Name</label>
          <input name="name" type="text" onChange={this.handleChange} />
          <label>Password</label>
          <input name="password" type="password" onChange={this.handleChange} />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default Signup;
