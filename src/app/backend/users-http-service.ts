import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, materialize, dematerialize} from 'rxjs/operators';
import {UserDto} from "@app/dtos/user-dto";

const usersKey = 'precognize-user-key';
let users: UserDto[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;

    const authenticate = () => {
      const {username, password} = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) {
        return error('Username or password is incorrect');
      }
      return getSuccessStatus({
        ...getUserDetails(user),
        token: 'fake-jwt-token'
      })
    }

    const register = (): Observable<HttpResponse<any>> => {
      const user = body


      if (users.find(x => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken')
      }

      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem(usersKey, JSON.stringify(users));
      return getSuccessStatus();
    }

    const getUsers = (): Observable<HttpResponse<any>> => {
      if (!isLoggedIn()) return unauthorized();
      return getSuccessStatus(users.map(x => getUserDetails(x)));
    }

    const getUserById = (): Observable<HttpResponse<any>> => {
      if (!isLoggedIn()) return unauthorized();

      const user = users.find(x => x.id === idFromUrl());
      return getSuccessStatus(getUserDetails(user));
    }

    const updateUser = (): Observable<HttpResponse<any>> => {
      if (!isLoggedIn()) return unauthorized();

      let params = body;
      let user = users.find(x => x.id === idFromUrl());

      if (!params.password) {
        delete params.password;
      }

      Object.assign(user, params);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return getSuccessStatus();
    }

    const deleteUser = (): Observable<HttpResponse<any>> => {
      if (!isLoggedIn()) return unauthorized();

      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(users));
      return getSuccessStatus();
    }

    const getSuccessStatus = (body?: any): Observable<HttpResponse<any>> => {
      return of(new HttpResponse({status: 200, body}))
        .pipe(delay(500));
    }

    const error = (message: string): Observable<HttpResponse<any>> => {
      return throwError(() => ({error: {message}}))
        .pipe(materialize(), delay(500), dematerialize());
    }

    const unauthorized = (): Observable<HttpResponse<any>> => {
      return throwError(() => ({status: 401, error: {message: 'Unauthorized'}}))
        .pipe(materialize(), delay(500), dematerialize());
    }

    const getUserDetails = (user: any): UserDto => {
      const {id, username, firstName, lastName} = user;
      return {id, username, firstName, lastName};
    }

    const isLoggedIn = (): boolean => {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    const idFromUrl = (): number => {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    const handleRoute = (): Observable<HttpEvent<any>> => {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        default:
          return next.handle(request);
      }
    }


    return handleRoute();
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
