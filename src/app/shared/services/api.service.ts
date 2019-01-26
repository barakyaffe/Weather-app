import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {USER_TOKEN} from '../../app.consts';
import {Observable} from 'rxjs/index';
import {Cities} from '../interfaces/city';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  public getAllCitiesFromJSON(): Observable<any> {
    return this.http.get('./assets/city.list.json');
  }

  public getCitiesWeather(ids: string): Observable<any> {
    return this.http.get(`${environment.base_url}/group`, {
      params: {
        id: ids,
        units: 'metric',
        appid: USER_TOKEN
      }
    });
  }
}


