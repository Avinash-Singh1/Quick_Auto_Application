import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-appointment-success',
  templateUrl: './appointment-success.component.html',
  styleUrls: ['./appointment-success.component.css']
})
export class AppointmentSuccessComponent {
  constructor(private http: HttpClient, private route: ActivatedRoute,private router: Router) { }
  appointment = {
    source: '',
    destination: '',
    travelDate: '',
    travelTime: '',
    fare:'',
    distance:''
  };
  
  ngOnInit() {
    // Extract query params
    this.route.queryParams.subscribe(params => {
      this.appointment.source = params['source'] || '';  // Set source from query param or empty if not provided
      this.appointment.destination = params['destination'] || '';  // Set destination from query param or empty if not provided
      this.appointment.fare = params['fare'] || '';  // Set destination from query param or empty if not provided
      this.appointment.distance = params['distance'] || '';  // Set destination from query param or empty if not provided
      this.appointment.travelDate = params['travelDate'] || '';  // Set destination from query param or empty if not provided
      this.appointment.travelTime = params['travelTime'] || '';  // Set destination from query param or empty if not provided
    });
  }

  goHome(){
    this.router.navigate(['/dash']);
  }

}
