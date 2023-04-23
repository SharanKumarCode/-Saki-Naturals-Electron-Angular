// import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any;
  loggedIn: boolean;

  constructor(
    private router: Router,
    // private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);

    //   console.log(this.user);
    //   console.log(this.loggedIn);

    //   if (this.loggedIn) {
    //     this.router.navigate(['products']);
    //   } else {
    //     this.router.navigate(['login']);
    //   }
    // });
  }

}
