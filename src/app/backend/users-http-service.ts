import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {v4 as uuid} from 'uuid';
import {Observable, of, throwError} from 'rxjs';
import {delay, materialize, dematerialize} from 'rxjs/operators';
import {UserDto} from "@app/dtos/user-dto";

const adminUser: UserDto = {id: uuid(), firstName: 'admin', lastName: 'admin', creationDate: (new Date).getTime(), password: 'admin123', role: 'admin', username: 'admin', token: 'fake-jwt-admin-token'}
export const usersKey = 'precognize-user-key';
let users: UserDto[] = JSON.parse(localStorage.getItem(usersKey)) || [adminUser];

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
      if (users.find(x => x.username === body.username)) {
        return error('Username "' + body.username + '" is already taken')
      }

      body.id = uuid();
      body.role = 'user'
      body.creationDate = (new Date).getTime();
      users.push(body);
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

    const deleteUser = (): Observable<HttpResponse<UserDto>> => {
      if (!isLoggedIn()) return unauthorized();

      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(users));
      return getSuccessStatus();
    }

    const getSuccessStatus = (body?: any): Observable<HttpResponse<UserDto>> => {
      return of(new HttpResponse({status: 200, body}))
        .pipe(delay(200));
    }

    const error = (message: string): Observable<HttpResponse<UserDto>> => {
      return throwError(() => ({error: {message}}))
        .pipe(materialize(), delay(200), dematerialize());
    }

    const unauthorized = (): Observable<HttpResponse<UserDto>> => {
      return throwError(() => ({status: 401, error: {message: 'Unauthorized'}}))
        .pipe(materialize(), delay(200), dematerialize());
    }

    const getUserDetails = (user: any): Partial<UserDto> => {
      const {id, username, firstName, lastName, role, creationDate} = user;
      return {id, username, firstName, lastName, role, creationDate};
    }

    const isLoggedIn = (): boolean => {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    const idFromUrl = (): string => {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }

    const handleRoute = (): Observable<HttpEvent<any>> => {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\.*/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\.*/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\.*/) && method === 'DELETE':
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
