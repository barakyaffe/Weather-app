import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../shared/services/api.service';
import {filter, map, switchMap, tap} from 'rxjs/internal/operators';
import {Cities} from '../shared/interfaces/city';
import {OPTIMAL_TEMP_FOR_MALE, OPTIMAL_HUMIDITY} from '../app.consts';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit, OnDestroy {
  public cities: Cities;
  public isLoaded: boolean;
  public selectedGender = 'MALE';
  private ids: string;
  private subs: Subscription;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.subs = this.apiService.getAllCitiesFromJSON()
      .pipe(
        filter(data => data),
        tap(data => this.getFirstTwentyCities(data)),
        switchMap(data => {
          return this.apiService.getCitiesWeather(this.ids);
        }),
        filter(res => !!res),
        map(res => res['list']),
      )
      .subscribe(this.initSort.bind(this));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public getFirstTwentyCities(data): string {
    data.slice(0, 20).forEach(el => {
      this.ids = this.ids ? this.ids.concat(',' + el.id) : JSON.stringify(el.id);
    });
    return this.ids;
  }

  public initSort(arr): void {
    this.cities =
      arr.map(city => {
        return {
          name: city.name,
          id: city.id,
          temp: city.main.temp,
          humidity: city.main.humidity,
          country: city.sys.country,
          score: this.getScore(city, OPTIMAL_TEMP_FOR_MALE)
        };
      });
    this.sortCitiesByScore(this.cities);
    this.isLoaded = true;
  }

  public genderSelected(e): void {
    this.selectedGender = e.value;
    const optimalTemp = e.value === 'MALE' ? 21 : 22;
    this.cities = this.cities.map(city => {
      city['score'] = this.getScore(city, optimalTemp);
      return city;
    });
    this.sortCitiesByScore(this.cities);
  }

  private getScore(city, optimalTemp): number {
    return Math.abs(Math.abs(optimalTemp - city.temp) - Math.abs(OPTIMAL_HUMIDITY - city.humidity));
  }

  private sortCitiesByScore(arr): Cities {
    arr.sort((a, b) => {
      return a['score'] - b['score'];
    });
    return arr;
  }
}
