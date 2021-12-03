import {Component, OnInit} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MetaApiService} from "../meta-api.service";
import {CollectionValidationStats, ValidationStatsResponseMaterialValidationStats} from "../api-analytics";
import {Node} from "../meta-widget/meta-widget.component";
import {environment} from "../../environments/environment";
import {MetaWidgetService} from "../meta-widget/meta-widget.service";
import {CollectionTreeNodeEntry, Tree} from "../tree";

export interface CollectionTreeNodeDetailEntry extends CollectionTreeNodeEntry{
    collectionDetails: CollectionValidationStats;
    collectionCounts: ValidationStatsResponseMaterialValidationStats;
}
@Component({
    selector: 'app-tree-collection-details',
    templateUrl: './tree-collection-details.html',
    styleUrls: ['./tree-collection-details.scss'],
})
export class TreeCollectionDetails implements OnInit {
    dataSource = new MatTreeNestedDataSource<CollectionTreeNodeEntry>();

    countColumns = {
        title: 'Material ohne Titel',
        license: 'Material ohne Lizenz',
        subjects: 'Material ohne Fachzuordnung',
        educontext: 'Material ohne Bildungsstufe',
        keywords: 'Material ohne Schlagworte',
        description: 'Material ohne Beschreibungstext',
        ads_qualifier: 'Material ohne Angaben zu Werbung',
        material_Type: 'Material ohne Materialtypzuordnung',
        object_type: 'Material ohne Objekttypzuordnung',
    };

    private statsData: CollectionTreeNodeEntry[];

    constructor(
        private readonly metaApi: MetaApiService,
        private readonly metaWidget: MetaWidgetService
    ) {}
    filter(){
        this.dataSource.data = this.statsData.filter((l) =>
            l.title.toLowerCase().includes(this.searchToken.toLowerCase())
        );
    }

    getValidationTranslation(entry: CollectionTreeNodeDetailEntry) {
        const keyI18n: any = {
            description: 'Beschreibung',
            edu_context: 'Fachgebiet',
            keywords: 'Schlagworte',
            title: 'Titel',
        }
        const errorI18n: any = {
            'missing': 'fehlt',
            'too_few': 'zu kurz / zu wenig',
        }
        return ([]).concat(...Object.keys(entry.collectionDetails).map((key) => {
            return (entry.collectionDetails as any)[key].map((error: string) => {
                return keyI18n[key] + ' ' + errorI18n[error];
            })
        }));
    }
    async ngOnInit() {
        const data = await this.metaApi.getTree(this.metaWidget.getCollectionId()).toPromise();
        const collectionDetails = await this.metaApi.getCollectionValidation(this.metaWidget.getCollectionId()).toPromise();
        const collectionCounts = await this.metaApi.getCollectionMaterialStats(this.metaWidget.getCollectionId()).toPromise();
        const dataFlat: CollectionTreeNodeDetailEntry[] = Tree.flatten(data);
        console.log(dataFlat.length);
        collectionDetails.forEach((v) => {
            // @ts-ignore
            const flat: any = dataFlat.find((d) => d.noderef_id === v.noderef_id);
            if(flat) {
                flat.collectionDetails = v.validation_stats;
            } else {
                console.warn(v.noderef_id);
            }
        });
        collectionCounts.forEach((v) => {
            const flat: any = dataFlat.find((d) => d.noderef_id === v.noderef_id);
            if(flat) {
                flat.collectionCounts = v.validation_stats;
            } else {
                console.warn(v.noderef_id);
            }
        })
        this.statsData = dataFlat;
        this.filter();
        console.log(dataFlat);
    }

    searchToken = '';
    getColumnIds() {
        return [
            'Sammlung',
            'Metadaten Sammlung'
        ].concat(
            Object.keys(this.countColumns)
        );
    }
    openNode(node: Node|'root') {
        if(node === 'root') {
            this.metaWidget.openNode({
                noderef_id: this.metaWidget.getCollectionId(),
                type: 'ccm:map'
            } as Node);
        } else {
            this.metaWidget.openNode(node);
        }
    }
    getListLink(element: CollectionTreeNodeDetailEntry, column: string) {
        if(this.getCount(element, column)) {
            const ids = (element.collectionCounts as any)[column]?.missing;
            const title = (this.countColumns as any)[column] + ' - ' + element.title;
            return environment.eduSharingPath + '/components/editorial-desk?mode=audit&title=' + encodeURIComponent(title) +
                '&ids=' + ids.join(',')

        }
        return null;
    }
    getCount(element: CollectionTreeNodeDetailEntry, column: string) {
        return element.collectionCounts ? (element.collectionCounts as any)[column]?.missing?.length ?? 0 : 0;
    }
}
