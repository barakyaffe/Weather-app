import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ApiService} from './shared/services/api.service';
import { CitiesComponent } from './cities/cities.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatRadioModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    CitiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatCardModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
