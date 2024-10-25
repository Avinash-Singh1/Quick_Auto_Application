import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var Razorpay: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private http: HttpClient,private router: Router) { }

  // Define a model to hold the form data
  booking = {
    source: '',
    destination: '',
    travelDate: '',
    travelTime: ''
  };

  // Method to handle form submission
  SubmitBookinginfo(formValues: any) {
    console.log('Form Submitted!', formValues);
      this.http.post('/api/users/sendinfo', formValues).subscribe(
        (response) => {
          console.log('Login successful!', response);
          // Handle success, maybe navigate to a different page
          if(response){
            // this.router.navigate(['/dash']);
          }

        },
        (error) => {
          console.error('Login failed!', error);
          // Handle error, display an error message
        }
      );
    }

  
  SubmitBooking(bookingData: any) {
      // Backend call to create Razorpay order
      const paymentDetails = {
        amount: 50 * 100, // Amount in paise (₹50)
        currency: 'INR',
        receipt: `rcpt_${new Date().getTime()}`,
        bookingData
      };
      console.log("paydetails: ",paymentDetails);
  
      // Send request to backend to create order
      this.http.post<any>('/api/users/createOrder', paymentDetails).subscribe((response: any) => {
        if (response && response.order_id) {
          this.initiatePayment(response);
        } else {
          alert('Payment initiation failed!');
        }
      });
    }
  
    initiatePayment(orderResponse: any) {
      const options = {
        "key":  orderResponse.key_id, // Replace with your Razorpay key
        "amount": orderResponse.amount, // ₹50 in paise
        "currency": "INR",
        "name": "Travel Booking",
        "description": "Payment for travel auto booking",
        "order_id": orderResponse.order_id, // Generated from backend
        "handler": function (response: any) {
          alert("Payment Successful: " + response.razorpay_payment_id);
        },
        "prefill": {
          "name": orderResponse.name,
          "email": orderResponse.email,
          "contact": orderResponse.contact
        },
        "theme": {
          "color": "#3399cc"
        },
        "modal": {
          "ondismiss": function () {
            alert('Payment was not completed.');
          }
        }
      };
  
      const rzp1 = new Razorpay(options);
      rzp1.open();
    }
  
    PlanJourney(){
      this.router.navigate(['/planjourney']);
    }
}
