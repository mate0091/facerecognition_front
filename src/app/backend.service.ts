import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private backendApi = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) { }

  public sendPicture(message: string): Observable<any>
  {
    const headers = new HttpHeaders()
      .append('Content-type', 'text/binary');
    return this.http.post<any>(this.backendApi + '/img/', message, {headers});
  }
}
