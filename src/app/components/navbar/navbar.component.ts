import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authservice: AuthServiceService,private router: Router){}
  Logout(){
    this.authservice.logout()
    this.router.navigate(['/login']);

  }
}
