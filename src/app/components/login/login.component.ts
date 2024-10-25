import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient,private router: Router,private authService:AuthServiceService) { }
  ngOnInit() {
    // Clear the local storage to remove any previous session
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  }


  Login(formData: any) {
    // Log the form data to ensure correct submission
    console.log('Form data:', formData);
  
    // Make a POST request to the login API
    this.http.post('/api/users/login', formData).subscribe(
      (response: any) => {
        // Check if the response indicates a successful login
        if (response && response.token && response.role) {
          // If successful, store the token and navigate to the dashboard
          this.authService.setToken(response.token);
          localStorage.setItem('role',response.role);
          // this.router.navigate(['/dash']);

            // Redirect based on user role
            if (response.role === 'admin') {
              this.router.navigate(['/admindash']);
            } else if (response.role === 'user') {
              this.router.navigate(['/dash']);
            } else {
              this.handleLoginError('Invalid user role');
            }




        } else {
          // If no token is returned, handle invalid login
          this.handleLoginError('Invalid password or user not found.');
        }
      },
      (error) => {
        console.error('Login failed!', error);
        // Handle error, display an error message
        this.handleLoginError('Invalid password or user not found.');
      }
    );
  }
  
  // Function to handle login error and display a message
  private handleLoginError(message: string) {
    // Display the error message
    alert(message); // You can replace this with a more user-friendly UI element like a toast notification
    // Optionally, you could also clear the form or focus the input
  }
  
}
