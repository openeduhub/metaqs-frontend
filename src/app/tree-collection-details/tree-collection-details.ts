import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Input, OnInit} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {CollectionTreeNode, MetaApiService} from "../meta-api.service";
import {CollectionValidationStats, StatsResponse} from "../api";
import {Node} from "../meta-widget/meta-widget.component";
import {Helper} from "../helper";
import {environment} from "../../environments/environment";
import {MetaWidgetService} from "../meta-widget/meta-widget.service";
import {CollectionTreeNodeEntry, Tree} from "../tree";
import {transition} from "@angular/animations";

export interface CollectionTreeNodeDetailEntry extends CollectionTreeNodeEntry{
    validationStats: CollectionValidationStats;
}
@Component({
    selector: 'app-tree-collection-details',
    templateUrl: './tree-collection-details.html',
    styleUrls: ['./tree-collection-details.scss'],
})
export class TreeCollectionDetails implements OnInit {
    dataSource = new MatTreeNestedDataSource<CollectionTreeNodeEntry>();

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
        const translation =  ([]).concat(...Object.keys(entry.validationStats).map((key) => {
            return (entry.validationStats as any)[key].map((error: string) => {
                return keyI18n[key]+': '+errorI18n[error];
            })
        }));
        console.log(translation);
        return translation;
    }
    async ngOnInit() {
        const data = await this.metaApi.getTree(this.metaWidget.getCollectionId()).toPromise();
        const collectionValidation = await this.metaApi.getCollectionValidation(this.metaWidget.getCollectionId()).toPromise();
        const dataFlat: CollectionTreeNodeDetailEntry[] = Tree.flatten(data);
        collectionValidation.forEach((v) => {
            // @ts-ignore
            dataFlat.find((d) => d.noderef_id === v.noderef_id).validationStats = v.validation_stats;
        })
        this.statsData = dataFlat;
        this.filter();
        console.log(dataFlat, collectionValidation, this.getValidationTranslation(dataFlat[0]));
    }

    searchToken = '';

    getColumnIds() {
        return [
            'Sammlung',
            'Metadaten Sammlung'
        ].concat(

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

}
