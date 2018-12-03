import React, {Component} from 'react';
import {MAP_STYLE3} from './mapstyle';

class Map extends Component {
  constructor(props) {
    super(props);
    this.fetchUser = this.fetchUser.bind(this);
    this.state = {
      lat: 1.3521,
      long: 103.8198,
      place: '',
      userList: []
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
        const API = process.env.REACT_APP_MAP;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&libraries=places&callback=resolveGoogleMapsPromise`;
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
    this.fetchUser();
  }

  fetchUser() {
    fetch('api/users')
      .then((res) => res.json())
      .then((resultrows) => this.setState({userList: resultrows}));
  }

  componentDidMount() {
    var reactThis = this;
    console.log(this.state.userList, 'state of userList ~~~~ ');

    console.log('printing props from maps after maps been mounted', this.props);
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then((google) => {
      const sg = {lat: 1.3521, lng: 103.8198};
      const map = new google.maps.Map(document.getElementById('gmap'), {
        zoom: 12,
        center: sg,
        styles: MAP_STYLE3
      });
      var infowindow = new google.maps.InfoWindow();

      //we need to pass all functions inside the promise as we need maps, and infowindow to be globally available
      //createMarker passed inside promise such that we are only creating 1 info window
      function createMarker(data, counterparty) {
        var image = '';
        if (data.ordertype === 'B') {
          // image = 'http://maps.google.com/mapfiles/ms/micons/blue.png';
          image = {
            url:
              'http://www.iconarchive.com/download/i57834/icons-land/vista-map-markers/Map-Marker-Marker-Outside-Chartreuse.ico',
            scaledSize: new google.maps.Size(40, 40)
          };
        }
        var myLatLng = new google.maps.LatLng(data.meet_lat, data.meet_long);
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          animation: google.maps.Animation.DROP,
          // icon: data.icon, //add icon inside results
          icon: image
          // title: data.title
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(
            '<p>Ticker: ' +
              data.ticker +
              '</p>' +
              '<p>Order type: ' +
              data.ordertype +
              '</p>' +
              '<p>quantity: ' +
              data.quantity +
              '</p>' +
              '<p>Good till: ' +
              data.available_till.split('T')[0] +
              '<p>Counterparty id: ' +
              data.user_id +
              '</p>' +
              '<p>Counterparty name: ' +
              counterparty +
              '</p>' +
              '</p>' +
              '<button id="markerButton" data-foo="' +
              data.user_id +
              '" onclick="myFunction(event)">Click to chat with me!</button>'
          ); // data-foo gives the .dataset method -> see useridMarker in App.jsx
          // console.log(place.geometry.location.lat());
          infowindow.open(map, this);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2000);
        });
        return marker;
      }
      //create markers
      var infowindow = new google.maps.InfoWindow();
      let markers = [];
      for (let i = 0; i < this.props.result.length; i++) {
        let counterparty = '';
        for (let j = 0; j < this.state.userList.length; j++) {
          if (this.state.userList[j].id === parseInt(this.props.result[i].user_id)) {
            counterparty = this.state.userList[j].name;
          }
        }
        if (this.props.result[i].user_id !== this.props.userid) {
          markers[i] = createMarker(this.props.result[i], counterparty);
        }
      }
    });
  }

  render() {
    console.log('maps been rendered');
    console.log('maps props - see result', this.props);
    return <div style={{width: '100%%', height: 500}} id="gmap" />;
  }
}

export default Map;
