import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  },
  group: {
    margin: theme.spacing.unit
  },
  root: {
    display: "flex"
  },
  textField: {
    flexBasis: 200
  }
});

class NewOrder extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      ticker: "",
      ordertype: "B",
      price: null,
      quantity: null,
      orderstatus: "active",
      meet_address: "",
      meet_lat: 0,
      meet_long: 0,
      available_till: "",
      user_id: ""
    };
  }
  componentDidMount() {
    this.forceUpdate();
    let number = parseInt(this.props.user);
    this.setState({ user_id: number });
  }

  //   handleRadio = event => {
  //     this.setState({ ordertype: event.target.value });
  //   };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      ticker: this.state.ticker,
      ordertype: this.state.ordertype,
      price: this.state.price,
      quantity: this.state.quantity,
      orderstatus: this.state.orderstatus,
      meet_address: this.state.meet_address,
      meet_lat: this.state.meet_lat,
      meet_long: this.state.meet_long,
      available_till: this.state.available_till,
      user_id: this.state.user_id
    };
    console.log(data);

    fetch("/order/new", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log("this is a success!!");
      this.props.history.push("/home");
    });
  }

  render() {
    console.log(this.props.user);
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <FormControl className={classes.formControl} variant="outlined">
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              label="Ticker"
              name="ticker"
              value={this.state.ticker}
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                )
              }}
            />
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Buy/Sell</FormLabel>
            <RadioGroup
              aria-label="Ordertype"
              name="ordertype"
              className={classes.group}
              value={this.state.ordertype}
              onChange={this.handleChange}
            >
              <FormControlLabel value="B" control={<Radio />} label="Buy" />
              <FormControlLabel value="S" control={<Radio />} label="Sell" />
            </RadioGroup>
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              label="Price"
              name="price"
              value={this.state.price}
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              label="Quantity"
              name="quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">qty</InputAdornment>
                )
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              label="Meet_address"
              name="meet_address"
              value={this.state.meet_address}
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                )
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              label="Available_till"
              name="available_till"
              value={this.state.available_till}
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                )
              }}
            />
            <input type="submit" value="submit" />
          </FormControl>
        </form>
      </div>
    );
  }
}

NewOrder.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(NewOrder));
