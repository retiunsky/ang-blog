import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
        ) {}
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            console.log('canActivate');
            
            if (this.auth.isAuthenticated()) {
                console.log('auth: true');
                    
                 return true
            } else {
                this.auth.logout();
                this.router.navigate(['/admin', 'login'], 
                { queryParams: {
                    loginAgain: true
                } });
                console.log('loginAgain: true');
                return false;
            }
            
            
    }

}