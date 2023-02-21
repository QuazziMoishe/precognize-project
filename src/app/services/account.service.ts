import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserDto} from "@app/dtos/user-dto";
import {env} from "@environments/env";


@Injectable({providedIn: 'root'})
export class AccountService {
  private userSubject: BehaviorSubject<UserDto>;
  public user: Observable<UserDto>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): UserDto {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<UserDto> {
    return this.http.post<UserDto>(`${env.apiUrl}/users/authenticate`, {username, password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: UserDto): Observable<any> {
    return this.http.post(`${env.apiUrl}/users/register`, user).pipe(
      switchMap(() => {
        return this.login(user.username, user.password)
      })
    );
  }

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${env.apiUrl}/users`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<UserDto>(`${env.apiUrl}/users/${id}`);
  }

  update(id: string, params: any): Observable<any> {
    return this.http.put(`${env.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        if (id == this.userValue?.id) {
          const user = {...this.userValue, ...params};
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${env.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue?.id) {
          this.logout();
        }
        return x;
      }));
  }
}
