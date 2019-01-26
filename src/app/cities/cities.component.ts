import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../shared/services/api.service';
import {filter, map, switchMap, tap} from 'rxjs/internal/operators';
import {Cities} from '../shared/interfaces/city';
import {OPTIMAL_HUMIDITY, OPTIMAL_TEMP} from '../app.consts';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit, OnDestroy {
  public cities: Cities;
  private ids: string;

  private subs: Subscription;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.subs = this.apiService.getJSON()
      .pipe(
        filter(data => data),
        tap(data => this.getFirstTwentyCities(data)),
        switchMap(data => {
          return this.apiService.getCitiesWeather(this.ids);
        }),
        filter(res => !!res),
        map(res => res['list']),
      )
      .subscribe(this.sort.bind(this));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // Todo: convert forloop to arrow fn
  public getFirstTwentyCities(data): string {
    for (let i = 0; i < 20; i++) {
      if (this.ids) {
        this.ids = this.ids.concat(',' + data[i].id);
      } else {
        this.ids = '';
        this.ids = this.ids.concat(data[i].id);
      }
    }
    return this.ids;
  }

  public sort(arr): void {
    console.log('arr =>' , arr);
    this.cities =
      arr.map(city => {
        return {
          name: city.name,
          id: city.id,
          temp: city.main.temp,
          humidity: city.main.humidity,
          country: city.sys.country,
          score: Math.abs(Math.abs(OPTIMAL_TEMP - city.main.temp) - Math.abs(OPTIMAL_HUMIDITY - city.main.humidity))
        };
      }).sort((a, b) => {
        return a['score'] - b['score'];
      });
  }
}
