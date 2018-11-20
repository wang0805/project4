import React, {Component} from 'react';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 1.3521,
      long: 103.8198,
      place: ''
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&libraries=places&callback=resolveGoogleMapsPromise`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    }
    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  // createMarker(data, map) {
  //   var myLatLng = new google.maps.LatLng(data.meet_lat, data.meet_long);
  //   var marker = new google.maps.Marker({
  //     position: myLatLng,
  //     map: map,
  //     animation: google.maps.Animation.DROP
  //     // icon: data.icon, //add icon inside results
  //     // title: data.title
  //   });
  //   var infowindow = new google.maps.InfoWindow();
  //   google.maps.event.addListener(marker, 'click', function() {
  //     infowindow.setContent('testing');
  //     // console.log(place.geometry.location.lat());
  //     infowindow.open(map, this);
  //     marker.setAnimation(google.maps.Animation.BOUNCE);
  //     setTimeout(function() {
  //       marker.setAnimation(null);
  //     }, 2000);
  //   });
  //   return marker;
  // }

  componentWillMount() {
    this.getGoogleMaps();
  }

  componentDidMount() {
    var reactThis = this;

    console.log('printing props from maps after maps been mounted', this.props);
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then((google) => {
      const sg = {lat: 1.3521, lng: 103.8198};
      const map = new google.maps.Map(document.getElementById('gmap'), {
        zoom: 12,
        center: sg
      });
      var infowindow = new google.maps.InfoWindow();

      //we need to pass all functions inside the promise as we need maps, and infowindow to be globally available
      //createMarker passed inside promise such that we are only creating 1 info window
      function createMarker(data) {
        var myLatLng = new google.maps.LatLng(data.meet_lat, data.meet_long);
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          animation: google.maps.Animation.DROP
          // icon: data.icon, //add icon inside results
          // title: data.title
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(
            '<p>Ticker: ' +
              data.ticker +
              '</p>' +
              '<p>Price: ' +
              data.price +
              '</p>' +
              '<p>Order type: ' +
              data.ordertype +
              '</p>' +
              '<p>quantity: ' +
              data.quantity +
              '</p>' +
              '<p>Good till: ' +
              data.available_till.split('T')[0] +
              '</p>' +
              '<button onclick="myFunction()">Click me</button>'
          );
          // console.log(place.geometry.location.lat());
          infowindow.open(map, this);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2000);
        });
        return marker;
      }

      // var contentString =
      //   '<div id="content">' +
      //   '<div id="siteNotice">' +
      //   '</div>' +
      //   '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
      //   '<div id="bodyContent">' +
      //   '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      //   'sandstone rock formation in the southern part of the ' +
      //   'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
      //   'south west of the nearest large town, Alice Springs; 450&#160;km ' +
      //   '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
      //   'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
      //   'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
      //   'Aboriginal people of the area. It has many springs, waterholes, ' +
      //   'rock caves and ancient paintings. Uluru is listed as a World ' +
      //   'Heritage Site.</p>' +
      //   '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
      //   'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
      //   '(last visited June 22, 2009).</p>' +
      //   '</div>' +
      //   '</div>';

      //create markers
      var infowindow = new google.maps.InfoWindow();
      let markers = [];
      for (let i = 0; i < this.props.result.length; i++) {
        markers[i] = createMarker(this.props.result[i]);
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
