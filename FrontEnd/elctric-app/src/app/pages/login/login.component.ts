import { Component, OnInit } from '@angular/core';
import {FormControl , FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  user: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  matcher = new MyErrorStateMatcher();

  constructor() {
    this.user = new FormGroup({
      email: this.email,
      password: this.password
    });
  }


  ngOnInit() {
  }

  getErrorMessageMail() {
    return this.email.hasError('required') ? 'Debes introducir un valor' :
        this.email.hasError('email') ? 'El email no es valido' :
            '';
  }

  getErrorMessagePassword() {
    return this.password.hasError('required') ? 'Debes introducir un valor' :
        this.password.hasError('minlength') ? 'El password debe tener más de 6 digitos' :
            '';
  }

  ingresar() {
      console.log(this.user.value);
  }


}
