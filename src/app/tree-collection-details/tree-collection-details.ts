import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Input, OnInit} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {CollectionTreeNode, MetaApiService} from "../meta-api.service";
import {
    CollectionValidationStats,
    MaterialFieldValidation,
    StatsResponse,
    ValidationStatsResponseMaterialValidationStats
} from "../api";
import {Node} from "../meta-widget/meta-widget.component";
import {Helper} from "../helper";
import {environment} from "../../environments/environment";
import {MetaWidgetService} from "../meta-widget/meta-widget.service";
import {CollectionTreeNodeEntry, Tree} from "../tree";
import {transition} from "@angular/animations";

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
            educontext: 'Fachgebiet',
            keywords: 'Schlagworte',
            title: 'Titel',
        }
        const errorI18n: any = {
            'missing': 'fehlt',
            'too_few': 'zu kurz / zu wenig',
        }
        const translation =  ([]).concat(...Object.keys(entry.collectionDetails).map((key) => {
            return (entry.collectionDetails as any)[key].map((error: string) => {
                return keyI18n[key]+' '+errorI18n[error];
            })
        }));
        return translation;
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

    getCount(element: CollectionTreeNodeDetailEntry, column: string) {
        return element.collectionCounts ? (element.collectionCounts as any)[column]?.missing ?? 0 : 0;
    }
}
