import {ApplicationRef, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {APP_BASE_HREF} from "@angular/common";
import { MetaWidgetComponent } from './meta-widget/meta-widget.component';
import {MatCardModule} from "@angular/material/card";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeEntryComponent } from './node-entry/node-entry.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    MetaWidgetComponent,
    NodeEntryComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'}
  ]
})
export class AppModule {
  ngDoBootstrap(appRef: ApplicationRef) {
    const rootElements = document.querySelectorAll('app-meta-widget');
    console.log(rootElements)
    for (const element of rootElements as any as HTMLElement[]){
      const componentRef = appRef.bootstrap(MetaWidgetComponent, element);
      for(let i = 0; i < element.attributes.length; i++) {
        const attr = (element.attributes.item(i) as Attr);
        (componentRef.instance as any)[attr.name] = attr.value;
      }
      componentRef.instance.ngOnChanges({});
    }
  }
}
