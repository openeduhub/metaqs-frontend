import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule, Type } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { ApiModule, Configuration } from './api';
import {
    ApiModule as ApiModuleAnalytics,
    Configuration as ConfigurationAnalytics,
} from './api-analytics';
import { MetaScoreComponent } from './meta-score/meta-score.component';
import { MetaWidgetComponent } from './meta-widget/meta-widget.component';
import { NodeEntryComponent } from './node-entry/node-entry.component';
import { NodeImageUrlPipe } from './node-image-url.pipe';
import { TreeCollectionDetails } from './tree-collection-details/tree-collection-details';
import { TreeSearchCounts } from './tree-search-counts/tree-search-counts';
import { WidgetNodeList } from './widget-node-list/widget-node-list';
import { WrapObservablePipe } from './wrap-observable.pipe';

@NgModule({
    declarations: [
        MetaWidgetComponent,
        NodeEntryComponent,
        NodeImageUrlPipe,
        TreeSearchCounts,
        TreeCollectionDetails,
        WrapObservablePipe,
        WidgetNodeList,
        MetaScoreComponent,
    ],
    imports: [
        BrowserModule,
        MatCardModule,
        MatTreeModule,
        HttpClientModule,
        ApiModule.forRoot(() => {
            return new Configuration({
                basePath: environment.apiPath,
            });
        }),
        ApiModuleAnalytics.forRoot(() => {
            return new ConfigurationAnalytics({
                basePath: environment.apiPath + '/analytics',
            });
        }),
        BrowserAnimationsModule,
        MatIconModule,
        MatSliderModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppModule {
    // Add any component that may be injected from an external html container.
    static readonly BOOTSTRAP_COMPONENTS: { [key: string]: Type<any> } = {
        'app-meta-widget': MetaWidgetComponent,
        //'app-tree-table': TreeSearchCounts,
    };

    constructor(private injector: Injector) {}

    ngDoBootstrap() {
        for (const [name, component] of Object.entries(AppModule.BOOTSTRAP_COMPONENTS)) {
            this.registerWebComponent(name, component);
        }
    }

    private registerWebComponent(name: string, component: Type<any>): void {
        const element = createCustomElement(component, { injector: this.injector });
        customElements.define(name, element);
    }
}
