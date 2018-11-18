import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
    );
  }
}

export default Navbar;
