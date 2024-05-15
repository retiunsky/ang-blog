import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ObservableInput, of, Subject, throwError } from "rxjs";
import { FbAuthResponse, User } from "src/app/shared/interfaces";
import { environment } from "src/environments/environment";
import { catchError, tap } from "rxjs/operators";


@Injectable({providedIn: 'root'})

export class AuthService {
    constructor(private http: HttpClient){}

    get token(): string | null {
        const expiresDateString = localStorage.getItem('fb-token-exp');
        
        if (!expiresDateString) return null;

        if (new Date() > new Date(expiresDateString)) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token');
    }

    login( user: User): Observable<any> {
        return this.http.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken as Object),
                catchError(this.handleError.bind(this))
            )
    }

    public error$ = new Subject<string>();

    private handleError(error: HttpErrorResponse): ObservableInput<any> {
        const {message} = error.error.error;
        
        switch (message) {
            case 'INVALID_EMAIL':
                this.error$.next('Неверный email');
                break;
        
            case 'INVALID_PASSWORD':
                this.error$.next('Неверный пароль');
                break;
            
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Не найден email');
                break;
                
            default:
                break;
        }
         

        return throwError(error);
    }

    logout() {
        console.log('logout');
        this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private setToken(response: FbAuthResponse | null) {
        if (response) {
            const expiresDate = new Date( new Date().getTime() + (+response.expiresIn * 1000));
            localStorage.setItem('fb-token', response.idToken);
            localStorage.setItem('fb-token-exp', expiresDate.toString());
        }
        else
        {
            localStorage.clear();
            console.log('localStorage.clear');
            
        }
        
        
        
    }
}