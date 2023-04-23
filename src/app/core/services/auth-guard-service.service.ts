// import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService implements CanActivate {

  constructor(private router: Router,
    // private socialAuthService: SocialAuthService
    ) {
}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return of(true);
    // return this.socialAuthService.authState
    //           .pipe(
    //             map((socialUser: SocialUser) => !!socialUser),
    //             tap((isLoggedIn: boolean) => {
    //                 if (!isLoggedIn) {
    //                   this.router.navigate(['login']);
    //                 }
    //               })
    //             );
                }
}
