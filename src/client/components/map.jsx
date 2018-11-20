import React, { Component } from "react";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 1.3521,
      long: 103.8198,
      place: ""
    };
  }

  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise(resolve => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = "AIzaSyACySFLlLmNi76Xy9u-nD_LtiVJLUnkuN0";
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyACySFLlLmNi76Xy9u-nD_LtiVJLUnkuN0&libraries=places&callback=resolveGoogleMapsPromise";
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
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then(google => {
      const sg = { lat: 1.3521, lng: 103.8198 };
      const map = new google.maps.Map(document.getElementById("gmap"), {
        zoom: 8,
        center: sg
      });
      const marker = new google.maps.Marker({
        position: sg,
        map: map
      });
      //autocomplete
      console.log(document.querySelector("#searchTextField"));
      var input = document.getElementById("searchTextField");
      var options = {
        componentRestrictions: { country: "sg" }
      };
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      google.maps.event.addListener(autocomplete, "place_changed", function() {
        var place = autocomplete.getPlace();
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();

        document.getElementById("lat").value = lat;
        document.getElementById("long").value = lng;
      });
    });
  }

  render() {
    return <div style={{ width: 500, height: 500 }} id="gmap" />;
  }
}

export default Map;
