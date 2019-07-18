import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {ErrorStateMatcher} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class RegisterComponent implements OnInit {

  user: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required , Validators.minLength(6)]);
  password1 = new FormControl('', [Validators.required , Validators.minLength(6)]);
  name = new FormControl('', [Validators.required]);
  secondname = new FormControl('', [Validators.required]);
  surname = new FormControl('', [Validators.required]);
  gender = new FormControl('', [Validators.required]);
  date = new FormControl( moment() , [Validators.required]);

  constructor() {
    this.user = new FormGroup({
      email: this.email,
      password: this.password,
      password1: this.password1,
      name: this.name,
      secondname: this.secondname,
      surname: this.surname,
      gender: this.gender,
      date: this.date
    }, { validators: this.sonIguales('password' , 'password1')
  });
   }

  ngOnInit() {
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
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

  getErrorMessagePassword1() {
    return this.password1.hasError('required') ? 'Debes introducir un valor' :
        this.password1.hasError('minlength') ? 'El password debe tener más de 6 digitos' :
            '';
  }

  sonIguales(campo1, campo2): any  {

    return(group: FormGroup) => {

    const pass1 = group.controls[campo1].value;
    const pass2 = group.controls[campo2].value;
    if ( pass1 === pass2 ) {
      return null;
    }

    return {
          sonIguales: true
        };

    };

  }

  ingresar() {
    console.log(this.user.value);
}
}
