import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApplicationRef, ComponentRef, NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { ApiModule, Configuration } from './api';
import { MetaWidgetComponent } from './meta-widget/meta-widget.component';
import { NodeEntryComponent } from './node-entry/node-entry.component';
import { NodeImageUrlPipe } from './node-image-url.pipe';
import { WrapObservablePipe } from './wrap-observable.pipe';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {WidgetNodeList} from "./widget-node-list/widget-node-list";
import {TreeSearchCounts} from "./tree-search-counts/tree-search-counts";
import {TreeCollectionDetails} from "./tree-collection-details/tree-collection-details";
import { MetaScoreComponent } from './meta-score/meta-score.component';

@NgModule({
    declarations: [
        MetaWidgetComponent,
        NodeEntryComponent,
        NodeImageUrlPipe,
        TreeSearchCounts,
        TreeCollectionDetails,
        WrapObservablePipe,
        WidgetNodeList,
        MetaScoreComponent],
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
    // add any component that may be injected from an external html container
    static readonly BOOTSTRAP_COMPONENTS: { [key: string]: Type<any> } = {
        'app-meta-widget': MetaWidgetComponent,
        //'app-tree-table': TreeSearchCounts,
    };

    ngDoBootstrap(appRef: ApplicationRef) {
        for (const key of Object.keys(AppModule.BOOTSTRAP_COMPONENTS)) {
            const componentClass = AppModule.BOOTSTRAP_COMPONENTS[key];
            // Don't call ngOnInit right away when bootstrapping, but wait for inputs to be set.
            const ngOnInit = componentClass.prototype.ngOnInit;
            componentClass.prototype.ngOnInit = () => {};
            const rootElements = document.querySelectorAll(key);
            for (const element of rootElements as any as HTMLElement[]) {
                const componentRef = appRef.bootstrap(componentClass, element);
                for (let i = 0; i < element.attributes.length; i++) {
                    const attr = element.attributes.item(i) as Attr;
                    this.setInput(componentRef, attr.name, attr.value);
                }
                if (typeof ngOnInit === 'function') {
                    ngOnInit.apply(componentRef.instance);
                }
            }
        }
    }

    private setInput(componentRef: ComponentRef<any>, name: string, value: string): void {
        const cmp = (componentRef.componentType as any).ɵcmp;
        const publicName = Object.keys(cmp.inputs).find(
            (publicName) => publicName.toLowerCase() === name,
        );
        if (publicName) {
            const privateName: string = cmp.inputs[publicName];
            if (cmp.setInput) {
                cmp.setInput(componentRef.instance, value, publicName, privateName);
            } else {
                componentRef.instance[privateName] = value;
            }
        }
    }
}
