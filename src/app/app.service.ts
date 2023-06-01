import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Participante } from './shared/participante.model';
import { Reunion } from './shared/reunion.model';
import { environment } from 'src/environments/environment';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }
  private URL: string = environment.apiURL;
  postReunion(body: Object): Observable<any> {
    return this.http.post<any>(this.URL + `reunion`, body);
  }

  getReunion(id_reunion: any) {
    return this.http.get<Reunion>(this.URL + `reunion/${id_reunion}`);
  }
}
