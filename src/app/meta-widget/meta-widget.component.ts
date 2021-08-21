import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MetaApiService, Type } from '../meta-api.service';
import {
    AppModelsCollectionAttribute,
    AppModelsLearningMaterialAttribute,
    Collection,
    CollectionMaterialsCount,
    LearningMaterial,
} from '../api';
import { environment } from '../../environments/environment';

export enum Mode {
    MaterialsNoTitle = 'MaterialsNoTitle',
    MaterialsNoLicense = 'MaterialsNoLicense',
    MaterialsNoDiscipline = 'MaterialsNoDiscipline',
    MaterialsNoContext = 'MaterialsNoContext',
    MaterialsNoKeywords = 'MaterialsNoKeywords',
    CollectionsNoDescription = 'CollectionsNoDescription',
    CollectionsNoKeywords = 'CollectionsNoKeywords',
    CollectionsNoContent = 'CollectionsNoContent',
}

export type Attribute = AppModelsLearningMaterialAttribute | AppModelsCollectionAttribute;
export type Node = LearningMaterial | Collection | CollectionMaterialsCount;
export type ModeDetail = {
    title: string;
    type: Type;
    attribute?: Attribute | 'count';
};
const ModeDetails: { [key: string]: ModeDetail } = {};
ModeDetails[Mode.MaterialsNoTitle] = {
    title: 'Materialien ohne Titel',
    type: Type.Material,
    attribute: AppModelsLearningMaterialAttribute.Cclomtitle,
};
ModeDetails[Mode.MaterialsNoLicense] = {
    title: 'Materialien ohne Lizenz',
    type: Type.Material,
    attribute: AppModelsLearningMaterialAttribute.CcmcommonlicenseKey,
};
ModeDetails[Mode.MaterialsNoDiscipline] = {
    title: 'Materialien ohne Fachgebiet',
    type: Type.Material,
    attribute: AppModelsLearningMaterialAttribute.Ccmtaxonid,
};
ModeDetails[Mode.MaterialsNoContext] = {
    title: 'Materialien ohne Bildungsstufe',
    type: Type.Material,
    attribute: AppModelsLearningMaterialAttribute.Ccmeducationalcontext,
};
ModeDetails[Mode.MaterialsNoKeywords] = {
    title: 'Materialien ohne Schlagworte',
    type: Type.Material,
    attribute: AppModelsLearningMaterialAttribute.CclomgeneralKeyword,
};
ModeDetails[Mode.CollectionsNoDescription] = {
    title: 'Sammlungen ohne Beschreibungstext',
    type: Type.Collection,
    attribute: AppModelsCollectionAttribute.PropertiesCmdescription,
};
ModeDetails[Mode.CollectionsNoKeywords] = {
    title: 'Sammlungen ohne Schlagworte',
    type: Type.Collection,
    attribute: AppModelsCollectionAttribute.PropertiesCclomgeneralKeyword,
};
ModeDetails[Mode.CollectionsNoContent] = {
    title: 'Sammlungen ohne Inhalt',
    type: Type.Collection,
    attribute: 'count',
};
@Component({
    selector: 'app-meta-widget',
    templateUrl: './meta-widget.component.html',
    styleUrls: ['./meta-widget.component.scss'],
})
export class MetaWidgetComponent implements OnInit, OnChanges {
    readonly Mode = Mode;
    @Input() collectionId: string;
    @Input() mode: Mode;
    data: Node[];
    rawData: Node[];
    modeDetail: ModeDetail;
    count: number | null = 0;
    constructor(private metaApi: MetaApiService) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        this.modeDetail = ModeDetails[this.mode.toString()];
        this.refresh();
    }

    async refresh() {
        if (this.modeDetail.attribute) {
            this.data = await this.metaApi
                .getByMissingAttribute(
                    this.collectionId,
                    this.modeDetail.type,
                    this.modeDetail.attribute,
                )
                .toPromise();
            this.rawData = this.data.slice();
        } else {
            console.warn('missing mode ' + this.modeDetail);
        }
        if (this.mode === Mode.CollectionsNoContent && this.rawData) {
            this.filterCount();
        }
        //this.data = [{name: 'Test'}] as any;
        console.log('refresh', this.count);
    }

    editNode(node: Node) {
        let action: string;
        if (this.mode === Mode.MaterialsNoLicense) {
            action = 'OPTIONS.LICENSE';
        } else {
            action = 'OPTIONS.EDIT';
        }
        const id =
            (node as LearningMaterial).noderef_id;
        const win = window.open(
            environment.eduSharingPath +
                '/components/render/' +
                encodeURIComponent(id) +
                '?action=' +
                action,
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
        this.data = this.rawData.filter(
            (d) => (d as CollectionMaterialsCount).materials_count <= (this.count || 0),
        );
    }
}
