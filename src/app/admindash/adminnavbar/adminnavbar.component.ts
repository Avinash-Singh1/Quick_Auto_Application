import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-adminnavbar',
  templateUrl: './adminnavbar.component.html',
  styleUrls: ['./adminnavbar.component.css']
})
export class AdminnavbarComponent {
 
  constructor(private router: Router){}
  Logout() {
    localStorage.removeItem('role'); // Clear the role from local storage
    localStorage.removeItem('token'); // Clear the role from local storage
    this.router.navigate(['/login']); // Redirect to login page (optional)
  }
}
