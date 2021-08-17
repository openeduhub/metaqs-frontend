import {ApplicationRef, ComponentFactory, NgModule, Type} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {APP_BASE_HREF} from "@angular/common";
import { MetaWidgetComponent } from './meta-widget/meta-widget.component';
import {MatCardModule} from "@angular/material/card";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeEntryComponent } from './node-entry/node-entry.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ApiModule, Configuration} from "./api";
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { NodeImageUrlPipe } from './node-image-url.pipe';
import {MatSliderModule} from "@angular/material/slider";

@NgModule({
  declarations: [
    MetaWidgetComponent,
    NodeEntryComponent,
    NodeImageUrlPipe
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    HttpClientModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: environment.apiPath
      })
    }),
    BrowserAnimationsModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'}
  ]
})
export class AppModule {
  // add any component that may be injected from an external html container
  static readonly BOOTSTRAP_COMPONENTS: {[key: string] : Type<any>} = {
    'app-meta-widget': MetaWidgetComponent
  }
  ngDoBootstrap(appRef: ApplicationRef) {

    for(const key of Object.keys(AppModule.BOOTSTRAP_COMPONENTS)){
    const rootElements = document.querySelectorAll(key);
    for (const element of rootElements as any as HTMLElement[]) {
        const componentRef = appRef.bootstrap(AppModule.BOOTSTRAP_COMPONENTS[key], element);
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = (element.attributes.item(i) as Attr);
          (componentRef.instance as any)[attr.name] = attr.value;
        }
        // we unfortunately need to manually trigger ng on changes
        componentRef.instance.ngOnChanges({});
      }
    }
  }
}
