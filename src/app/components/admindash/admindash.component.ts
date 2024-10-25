import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.css'],
})
export class AdmindashComponent {

  constructor(private router: Router){}
  viewAllBookings() {
    this.router.navigate(['/viewallbookings']);
  }
  manageUsers() {
    this.router.navigate(['/manageUsers']);
  }
  // viewAllBookings() {
  //   this.router.navigate(['/manageUsers']);
  // }
  generateReports() {
    this.router.navigate(['/generateReports']);
  }
  manageTickets() {
    this.router.navigate(['/manageTickets']);
  }
  openSettings() {
    this.router.navigate(['/openSettings']);
  }
  managePayments() {
    this.router.navigate(['/managePayments']);
  }
  feedbackSupport() {
    this.router.navigate(['/feedbackSupport']);
  }
  viewAnalytics() {
    this.router.navigate(['/viewAnalytics']);
  }
}
