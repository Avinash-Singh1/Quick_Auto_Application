import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMapsService } from 'src/app/google-maps.service';

@Component({
  selector: 'app-planjourney',
  templateUrl: './planjourney.component.html',
  styleUrls: ['./planjourney.component.css']
})
export class PlanjourneyComponent {
  constructor(private googleMapsService: GoogleMapsService, private router: Router) {}

  title = 'travel-app';
  source: string = '';
  destination: string = '';
  directions: any;
  markers: { position: { lat: number; lng: number }, label: string }[] = [];
  polyline: any; // To hold polyline data
  distance: number | null = null; // Distance in kilometers
  fare: number | null = null; // Fare in currency

  // Store autocomplete suggestions
  sourceSuggestions: any[] = [];
  destinationSuggestions: any[] = [];

  options: google.maps.MapOptions = {
    zoom: 14,
    center: { lat: 28.6139, lng: 77.2090 }
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  // Method to handle input for source
  onSourceInput() {
    this.fetchAutocompleteSuggestions(this.source, 'source');
  }

  // Method to handle input for destination
  onDestinationInput() {
    this.fetchAutocompleteSuggestions(this.destination, 'destination');
  }

  // Fetch autocomplete suggestions from Google Maps API
  private fetchAutocompleteSuggestions(query: string, type: string) {
    if (query.length < 3) {
      this.clearSuggestions(type);
      return;
    }

    this.googleMapsService.getAutocompleteSuggestions(query).subscribe(
      (data) => {
        console.log("data:", data);
        if (type === 'source') {
          this.sourceSuggestions = data.predictions; // Set source suggestions
        } else {
          this.destinationSuggestions = data.predictions; // Set destination suggestions
        }
      },
      (error) => {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    );
  }

  // Clear suggestions
  private clearSuggestions(type: string) {
    if (type === 'source') {
      this.sourceSuggestions = [];
    } else {
      this.destinationSuggestions = [];
    }
  }

  // Select source suggestion
  selectSource(suggestion: any) {
    this.source = suggestion.description; // Set source to selected suggestion
    this.clearSuggestions('source');
  }

  // Select destination suggestion
  selectDestination(suggestion: any) {
    this.destination = suggestion.description; // Set destination to selected suggestion
    this.clearSuggestions('destination');
  }

  getDirections() {
    if (this.source && this.destination) {
      this.googleMapsService.getDirections(this.source, this.destination).subscribe(
        (data) => {
          this.directions = data;
          this.setMarkers();
          this.setPolyline();
          this.calculateDistanceAndFare(); // Calculate distance and fare
        },
        (error) => {
          console.error('Error fetching directions', error);
        }
      );
    } else {
      alert('Please enter both source and destination');
    }
  }

  setMarkers() {
    if (this.directions.routes.length > 0) {
      const route = this.directions.routes[0].legs[0];
      const startLocation = route.start_location;
      const endLocation = route.end_location;

      this.markers = [
        { position: { lat: startLocation.lat, lng: startLocation.lng }, label: 'Source' },
        { position: { lat: endLocation.lat, lng: endLocation.lng }, label: 'Destination' }
      ];

      // Adjust map center to source
      this.options = { ...this.options, center: { lat: startLocation.lat, lng: startLocation.lng } };
    }
  }

  setPolyline() {
    if (this.directions.routes.length > 0) {
      const encodedPath = this.directions.routes[0].overview_polyline.points; // Get the encoded polyline
      const path = google.maps.geometry.encoding.decodePath(encodedPath); // Decode the polyline

      this.polyline = {
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      };
    }
  }

  // Calculate distance and fare
  private calculateDistanceAndFare() {
    if (this.directions.routes.length > 0) {
      const route = this.directions.routes[0].legs[0];
      this.distance = route.distance.value / 1000; // Convert meters to kilometers

      // Assuming fare calculation is based on a rate of $10/km
      this.fare = this.distance * 10; // Adjust the fare calculation based on your pricing model
    }
  }

  FillAllDetails() {
    console.log("source: ", this.source);
    console.log("destination: ", this.destination);
    this.router.navigate(['/booking'], {
      queryParams: { source: this.source, destination: this.destination,fare:this.fare, distance:this.distance }
    });
  }
}
