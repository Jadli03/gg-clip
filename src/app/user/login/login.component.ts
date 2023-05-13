import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {email: '', password: ''}

  constructor(private auth : AngularFireAuth) {}
  showAlert = false;
  alertMsg = 'logging In...';
  alertColor = 'blue';
  inSubmission = false;

  async login() { 
    this.showAlert = true;
    this.inSubmission = true;
    try { 
      const {email, password} = this.credentials;
      await this.auth.signInWithEmailAndPassword(email,password)
    } catch(e) {
      this.alertColor = 'red';
      this.alertMsg = 'Invalid Email/Password';
      this.inSubmission = false;
      return;
    }
    this.alertColor = 'green';
    this.alertMsg = 'Logged In Successfully';
  }
}
