import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private backendApi = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) { }

  public sendPicture(message: string, name: string): Observable<any>
  {
    const httpOptions: {headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response'
    };

    const body: {imgbase64; person; } = {
      imgbase64: message.toString(),
      person: name
    };

    return this.http.post<any>(this.backendApi + '/img/', body, httpOptions);
  }
}
