import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';

import { User } from '../../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public form: FormGroup = new FormGroup(
    {email: new FormControl(null, [
      Validators.required, 
      Validators.email
    ]),
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(3)
    ])}
  );

  protected submitted = false;
  protected message?: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params: Params) => {
      console.log('queryParams.subscribe');
      
      if (params['loginAgain']) {
        this.message = 'Пожалуйста, введите данные';
      } else if (params['authFailed']) {
        this.message = 'Пожалуйста, введите данные, снова';
      }  

      
    } );
  }



  submit() {
    if (this.form.invalid)
    return;

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }

    this.auth.login(user).subscribe({ next: () => {
      this.form.reset();
      this.router.navigate(['/admin','dashboard'])
      this.submitted = false;
    },
    error: () => {
      this.submitted = false;
    }}
    )
    
  }

}
