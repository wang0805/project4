import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// const styles = theme => ({
//   root: {
//     flexGrow: 1
//   },
//   margin: {
//     margin: theme.spacing.unit
//   },
//   withoutLabel: {
//     marginTop: theme.spacing.unit * 3
//   },
//   textField: {
//     flexBasis: 200
//   }
// });

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    flexBasis: 200
  }
});

class Signup extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.state = {
      name: "",
      password: ""
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClickShowPassword() {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      name: this.state.name,
      password: this.state.password,
      showPassword: false
    };
    console.log(data);

    fetch("/users/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      this.props.history.push("/home");
    });
  }
  render() {
    const { classes } = this.props;

    return (
      // <div className={classes.root}>
      //   <form onSubmit={this.handleSubmit}>
      //     <Grid container spacing={24}>
      //       <Grid item xs={12}>
      //         <FormControl
      //           className={classNames(
      //             classes.margin,
      //             classes.withoutLabel,
      //             classes.textField
      //           )}
      //           aria-describedby="name-helper-text"
      //         >
      //           <Input
      //             id="adornment-weight"
      //             name="name"
      //             onChange={this.handleChange}
      //             inputProps={{
      //               "aria-label": "Name"
      //             }}
      //           />
      //           <FormHelperText id="name-helper-text">Name</FormHelperText>
      //         </FormControl>
      //       </Grid>
      //       <Grid item xs={12}>
      //         <FormControl
      //           className={classNames(classes.margin, classes.textField)}
      //         >
      //           <InputLabel htmlFor="adornment-password">Password</InputLabel>
      //           <Input
      //             id="adornment-password"
      //             type={this.state.showPassword ? "text" : "password"}
      //             name="password"
      //             onChange={this.handleChange}
      //             endAdornment={
      //               <InputAdornment position="end">
      //                 <IconButton
      //                   aria-label="Toggle password visibility"
      //                   onClick={this.handleClickShowPassword}
      //                 >
      //                   {this.state.showPassword ? (
      //                     <Visibility />
      //                   ) : (
      //                     <VisibilityOff />
      //                   )}
      //                 </IconButton>
      //               </InputAdornment>
      //             }
      //           />
      //         </FormControl>
      //         <input type="submit" value="submit" />
      //       </Grid>
      //     </Grid>
      //   </form>
      // </div>
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id="outlined-adornment-amount"
            className={classNames(classes.margin, classes.textField)}
            variant="outlined"
            label="Name"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              )
            }}
          />
          <TextField
            id="outlined-adornment-password"
            className={classNames(classes.margin, classes.textField)}
            variant="outlined"
            type={this.state.showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Signup));
