import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit
  },
  group: {
    margin: theme.spacing.unit
  },
  root: {
    display: 'flex'
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
    this.test = this.test.bind(this);
    this.state = {
      ticker: '',
      ordertype: 'B',
      price: null,
      quantity: null,
      orderstatus: 'active',
      meet_address: '',
      meet_lat: 0,
      meet_long: 0,
      available_till: '',
      user_id: ''
    };
  }

  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);
          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };
        // Load the Google Maps API
        const script = document.createElement('script');
        const API = 'AIzaSyACySFLlLmNi76Xy9u-nD_LtiVJLUnkuN0';
        script.src =
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyACySFLlLmNi76Xy9u-nD_LtiVJLUnkuN0&libraries=places&callback=resolveGoogleMapsPromise';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    }
    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  componentDidMount() {
    var reactThis = this;
    this.forceUpdate();
    let number = parseInt(this.props.user);
    this.setState({user_id: number});
    this.getGoogleMaps().then((google) => {
      //autocomplete function
      var input = document.getElementById('searchTextField');
      var options = {
        componentRestrictions: {country: 'sg'}
      };
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        console.log('places to be', place);
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        reactThis.setState({meet_lat: lat, meet_long: lng, meet_address: place.formatted_address}); //set the lat and long for submit
        document.getElementById('lat').value = lat; //test
        document.getElementById('long').value = lng; //test
      });
    });
  }
  //   handleRadio = event => {
  //     this.setState({ ordertype: event.target.value });
  //   };

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
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

    fetch('/order/new', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('this is a success!!');
      this.props.displayOrd(false);
      this.props.update();
      // this.props.history.push("/home"); //not pushing bcos the url is diff
    });
  }

  test() {
    console.log(this.state);
  }

  render() {
    console.log(this.props.user);
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <button onClick={this.test}>TEST</button>
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
                startAdornment: <InputAdornment position="start">@</InputAdornment>
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
                startAdornment: <InputAdornment position="start">$</InputAdornment>
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
                startAdornment: <InputAdornment position="start">Qty</InputAdornment>
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl} variant="outlined">
            <TextField
              // id="outlined-adornment-amount"
              id="searchTextField"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              label="Meet_address"
              name="meet_address"
              onChange={this.handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">@</InputAdornment>
              }}
            />
          </FormControl>

          <input id="lat" />
          <input id="long" />

          <formControl>
            <form className={classes.container} noValidate>
              <TextField
                id="date"
                label="Available till"
                type="date"
                name="available_till"
                value={this.state.available_till}
                onChange={this.handleChange}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </form>
          </formControl>

          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

NewOrder.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(NewOrder));
