import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
    CollectionMaterialsCount,
    LearningMaterial,
    MissingCollectionField,
    MissingMaterialField,
} from '../api';
import { MetaApiService, Type } from '../meta-api.service';
import { Mode, Node } from '../meta-widget/meta-widget.component';
import { MetaWidgetService } from '../meta-widget/meta-widget.service';
import { WrappedResponse, wrapResponse } from '../wrap-observable.pipe';

export type MissingField = MissingMaterialField | MissingCollectionField;

export type ModeDetail = {
    title: string;
    type: Type;
    missing?: MissingField | 'count';
};

const ModeDetails: { [key: string]: ModeDetail } = {};
ModeDetails[Mode.MaterialsNoTitle] = {
    title: 'Materialien ohne Titel',
    type: Type.Material,
    missing: MissingMaterialField.Cclomtitle,
};
ModeDetails[Mode.MaterialsNoLicense] = {
    title: 'Materialien ohne Lizenz',
    type: Type.Material,
    missing: MissingMaterialField.CcmcommonlicenseKey,
};
ModeDetails[Mode.MaterialsNoDiscipline] = {
    title: 'Materialien ohne Fachgebiet',
    type: Type.Material,
    missing: MissingMaterialField.Ccmtaxonid,
};
ModeDetails[Mode.MaterialsNoContext] = {
    title: 'Materialien ohne Bildungsstufe',
    type: Type.Material,
    missing: MissingMaterialField.Ccmeducationalcontext,
};
ModeDetails[Mode.MaterialsNoKeywords] = {
    title: 'Materialien ohne Schlagworte',
    type: Type.Material,
    missing: MissingMaterialField.CclomgeneralKeyword,
};
ModeDetails[Mode.CollectionsNoDescription] = {
    title: 'Sammlungen ohne Beschreibungstext',
    type: Type.Collection,
    missing: MissingCollectionField.Cmdescription,
};
ModeDetails[Mode.CollectionsNoKeywords] = {
    title: 'Sammlungen ohne Schlagworte',
    type: Type.Collection,
    missing: MissingCollectionField.CclomgeneralKeyword,
};
ModeDetails[Mode.CollectionsNoContent] = {
    title: 'Sammlungen ohne Inhalt',
    type: Type.Collection,
    missing: 'count',
};

@Component({
    selector: 'app-widget-node-list',
    templateUrl: './widget-node-list.html',
    styleUrls: ['./widget-node-list.scss'],
})
export class WidgetNodeList implements OnInit, OnChanges, OnDestroy {
    @Input() mode: Mode;

    readonly Mode = Mode;
    wrappedData$: Observable<WrappedResponse<Node[]>>;
    data: Node[] | undefined;
    rawData: Node[] | undefined;
    modeDetail: ModeDetail;
    count: number | null = 0;

    private destroyed$ = new Subject<void>();

    constructor(private metaApi: MetaApiService, private widgetService: MetaWidgetService) {}

    ngOnInit(): void {
        this.widgetService
            .observeCollectionId()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.refresh());
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.modeDetail = ModeDetails[this.mode.toString()];
        this.refresh();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    async refresh() {
        if (this.modeDetail.missing) {
            this.wrappedData$ = this.metaApi
                .getByMissingAttribute(
                    this.widgetService.getCollectionId(),
                    this.modeDetail.type,
                    this.modeDetail.missing,
                )
                .pipe(wrapResponse(), shareReplay(1));
            this.data = await this.wrappedData$
                .pipe(
                    map((wrappedData) =>
                        wrappedData.state === 'success' ? wrappedData.data : undefined,
                    ),
                )
                .toPromise();
            this.rawData = this.data?.slice();
        } else {
            console.warn('missing mode ' + this.modeDetail);
        }
        if (this.mode === Mode.CollectionsNoContent && this.rawData) {
            this.filterCount();
        }
    }

    editNode(node: Node) {
        let action: string;
        if (this.mode === Mode.MaterialsNoLicense) {
            action = 'OPTIONS.LICENSE';
        } else {
            action = 'OPTIONS.EDIT';
        }
        const id = (node as LearningMaterial).noderef_id;
        const win = window.open(
            environment.eduSharingPath +
                '/components/editorial-desk?mode=render&viewType=single&ids=' +
                encodeURIComponent(id) +
                '&action=' +
                action +
                '&ticket=' +
                this.widgetService.getTicket() || '',
        );
        if (win) {
            win.onunload = () => {
                this.refresh();
                // give the elastic index some more time, and try again
                setTimeout(() => this.refresh(), 5000);
            };
        }
    }

    filterCount() {
        this.data = this.rawData?.filter(
            (d) => (d as CollectionMaterialsCount).materials_count <= (this.count ?? 0),
        );
    }
}
