import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private auth: AuthService) { }
  
  inSubmission = false;
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ])
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(16),
    Validators.max(100)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('', [
    Validators.required,
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10)
  ])
  showAlert = false;
  alertMsg = 'Please Wait! Your Account is being created';
  alertColor = 'blue';
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  })


  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please Wait! Your Account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;
    const { email, password } = this.registerForm.value

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) {
      console.error(e)
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured. Please try again';
      this.inSubmission = false;
      return;
    }
    this.alertMsg = 'You Accont has been created';
    this.alertColor = 'green';
  }


}
