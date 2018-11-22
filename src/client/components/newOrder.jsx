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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      const sg = {lat: 1.3521, lng: 103.8198};
      const map = new google.maps.Map(document.getElementById('smap'), {
        zoom: 10,
        center: sg
      });
      //autocomplete function
      var input = document.getElementById('searchTextField');
      var options = {
        componentRestrictions: {country: 'sg'}
      };
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        reactThis.setState({meet_lat: lat, meet_long: lng, meet_address: place.formatted_address}); //set the lat and long for submit
        document.getElementById('lat').value = lat;
        document.getElementById('long').value = lng;

        let latLng = {lat: parseFloat(lat), lng: parseFloat(lng)};
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
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

    fetch('/order/new', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('this is a success!!');
      this.props.displayClose();
      this.props.update();
    });
  }

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Dialog
          open={this.props.displayadd}
          onClose={this.props.displayClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
        >
          <form onSubmit={this.handleSubmit}>
            <DialogTitle id="scroll-dialog-title">Enter Order</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Disclaimers: enter order that would be shown to other users on the map and would allow them to click on
                the map marker to chat to you
              </DialogContentText>
              <br />
              <TextField
                id="outlined-adornment-amount"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Ticker"
                name="ticker"
                value={this.state.ticker}
                onChange={this.handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">T</InputAdornment>
                }}
                fullWidth
              />
              <br />
              <br />
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
                fullWidth
              />
              <br />
              <br />
              <TextField
                id="outlined-adornment-amount"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Quantity"
                name="quantity"
                value={this.state.quantity}
                onChange={this.handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Q</InputAdornment>
                }}
                fullWidth
              />
              <br />
              <br />
              <TextField
                // id="outlined-adornment-amount"
                id="searchTextField" //autocomplete
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Meet_address"
                name="meet_address"
                onChange={this.handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">@</InputAdornment>
                }}
                fullWidth
              />
              <br />
              <input id="lat" type="hidden" />
              <input id="long" type="hidden" />
              <br />
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
              <br />
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

              <div style={{width: '100%%', height: 200}} id="smap" />
            </DialogContent>
            <DialogActions>
              <Button type="submit" color="primary">
                Confirm Order
              </Button>
              <Button onClick={this.props.displayClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

NewOrder.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(NewOrder));
