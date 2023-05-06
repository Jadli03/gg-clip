import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('',[
    Validators.required,
    Validators.email
  ])
  age = new FormControl('',[
    Validators.required,
    Validators.min(16),
    Validators.max(100)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('',[
    Validators.required,
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.min(12),
    Validators.max(12)
  ])
  showAlert = false;
  alertMsg = 'Please Wait! Your Account is being created';
  alertColor = 'blue';
  registerForm = new FormGroup({
    name: this.name,
    email : this.email,
    age : this.age,
    password: this.password,
    confirmPassword : this.confirmPassword,
    phoneNumber: this.phoneNumber
  })


  register() { 
    this.showAlert = true;
    this.alertMsg = 'Please Wait! Your Account is being created';
    this.alertColor = 'blue';
  }


}
