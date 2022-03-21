import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFacade } from 'src/app/app.facade';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isLoading = false;
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder, private appFacade: AppFacade) {}

  submitForm() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.appFacade.login(this.validateForm.value);
      // this.validateForm
    }
  }
  ngOnInit(): void {
    this.appFacade.isUserLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.appFacade.userAuthError$.subscribe((error) => {
      if (error) {
        for (const i in this.validateForm.controls) {
          if (this.validateForm.controls.hasOwnProperty(i)) {
            this.validateForm.controls[i].setErrors({ wrong: true });
          }
        }
      }
    });
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
