import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class Sgd extends React.Component {
  constructor() {
    super();
    this.changeHandler = this.changeHandler.bind(this);
  }
  changeHandler() {
    this.props.setSgd(event.target.value);
  }

  render() {
    const {classes} = this.props;
    console.log('rendering SGD');
    return (
      <div>
        <TextField
          id="outlined-number"
          label="USD TO SGD"
          value={Math.round(this.props.SGD * 100) / 100}
          onChange={this.changeHandler}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
        />
      </div>
    );
  }
}

Sgd.propTypes = {
  classes: PropTypes.object.isRequired
};

Sgd = withStyles(styles)(Sgd);

class Usd extends React.Component {
  constructor() {
    super();
    this.changeHandler = this.changeHandler.bind(this);
  }
  changeHandler() {
    this.props.setUsd(event.target.value);
  }

  render() {
    const {classes} = this.props;
    console.log('rendering USD');
    return (
      <div>
        <TextField
          id="outlined-number"
          label="SGD TO USD"
          value={Math.round(this.props.USD * 100) / 100}
          onChange={this.changeHandler}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
        />
      </div>
    );
  }
}

Usd.propTypes = {
  classes: PropTypes.object.isRequired
};

Usd = withStyles(styles)(Usd);

class CurrentPrice extends Component {
  constructor() {
    super();
    this.setSgd = this.setSgd.bind(this);
    this.setUsd = this.setUsd.bind(this);
    this.state = {
      USDSGD: '',
      SGD: '',
      USD: '',
      styles: {textDecorationLine: 'underline'}
    };
  }
  componentDidMount() {
    var APIkey = 'V9CIRQRJSAFI99RM';
    fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=SGD&apikey=${APIkey}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('api result of alphavantage:', data);
        this.setState({USDSGD: data['Realtime Currency Exchange Rate']['5. Exchange Rate']});
      });
  }

  setSgd(params) {
    this.setState({SGD: params, USD: params * parseFloat(this.state.USDSGD)});
  }

  setUsd(params) {
    this.setState({USD: params, SGD: params / parseFloat(this.state.USDSGD)});
  }

  render() {
    return (
      <div>
        <h2>
          USDSGD FX: <strong style={this.state.styles}>{this.state.USDSGD.substring(0, 5)}</strong>
        </h2>
        <Sgd setSgd={this.setSgd} SGD={this.state.SGD} />
        <Usd setUsd={this.setUsd} USD={this.state.USD} />
      </div>
    );
  }
}

export default withStyles(styles)(CurrentPrice);
