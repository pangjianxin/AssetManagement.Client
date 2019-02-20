import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Organization } from 'src/app/models/organization';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  currentOrg: Organization;
  returnUrl: string;
  constructor(private fb: FormBuilder,
    private orgService: AccountService,
    private router: Router,
    private alert: AlertService) {

  }
  ngOnInit() {
    this.loginForm = this.fb.group({
      orgIdentifier: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    this.router.routerState.root.queryParamMap.subscribe(value => {
      this.returnUrl = value.get('returnUrl');
    });
  }
  login() {
    const loginFormValue = this.loginForm.value;
    this.orgService.login(loginFormValue).subscribe(data => {
      this.alert.success(data.message, '确定');
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, error => {
      this.alert.failure(error.message);
    });
  }

}
