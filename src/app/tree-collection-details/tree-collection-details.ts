import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
    CollectionValidationStats,
    ValidationStatsResponseMaterialValidationStats,
} from '../api-analytics';
import { MetaApiService } from '../meta-api.service';
import { Node } from '../meta-widget/meta-widget.component';
import { MetaWidgetService } from '../meta-widget/meta-widget.service';
import { CollectionTreeNodeEntry, Tree } from '../tree';

export interface CollectionTreeNodeDetailEntry extends CollectionTreeNodeEntry {
    collectionDetails: CollectionValidationStats;
    collectionCounts: ValidationStatsResponseMaterialValidationStats;
}

@Component({
    selector: 'app-tree-collection-details',
    templateUrl: './tree-collection-details.html',
    styleUrls: ['./tree-collection-details.scss'],
})
export class TreeCollectionDetails implements OnInit, OnDestroy {
    dataSource = new MatTreeNestedDataSource<CollectionTreeNodeEntry>();

    countColumns = {
        title: 'Material ohne Titel',
        license: 'Material ohne Lizenz',
        subjects: 'Material ohne Fachzuordnung',
        educontext: 'Material ohne Bildungsstufe',
        keywords: 'Material ohne Schlagworte',
        description: 'Material ohne Beschreibungstext',
        ads_qualifier: 'Material ohne Angaben zu Werbung',
        // not used anymore since we have oeh_lrt as a required field
        // material_Type: 'Material ohne Inhaltetyp',
        // object_type: 'Material ohne Objekttypzuordnung',
    };

    searchToken = '';

    private statsData: CollectionTreeNodeEntry[];
    private destroyed$ = new Subject<void>();

    constructor(
        private readonly metaApi: MetaApiService,
        private readonly metaWidget: MetaWidgetService,
    ) {}

    ngOnInit(): void {
        this.metaWidget
            .observeCollectionId()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((collectionId) => this.init(collectionId));
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private async init(collectionId: string): Promise<void> {
        const data = await this.metaApi.getTree(collectionId).toPromise();
        const collectionDetails = await this.metaApi
            .getCollectionValidation(collectionId)
            .toPromise();
        const collectionCounts = await this.metaApi
            .getCollectionMaterialStats(collectionId)
            .toPromise();
        const dataFlat: CollectionTreeNodeDetailEntry[] = Tree.flatten(data);
        collectionDetails.forEach((v) => {
            // @ts-ignore
            const flat: any = dataFlat.find((d) => d.noderef_id === v.noderef_id);
            if (flat) {
                flat.collectionDetails = v.validation_stats;
            } else {
                // console.warn(v.noderef_id);
            }
        });
        collectionCounts.forEach((v) => {
            const flat: any = dataFlat.find((d) => d.noderef_id === v.noderef_id);
            if (flat) {
                flat.collectionCounts = v.validation_stats;
            } else {
                // console.warn(v.noderef_id);
            }
        });
        this.statsData = dataFlat;
        this.filter();
    }

    filter() {
        this.dataSource.data = this.statsData.filter((l) =>
            l.title.toLowerCase().includes(this.searchToken.toLowerCase()),
        );
    }

    getValidationTranslation(entry: CollectionTreeNodeDetailEntry) {
        const keyI18n: any = {
            description: 'Beschreibung',
            edu_context: 'Fachgebiet',
            keywords: 'Schlagworte',
            title: 'Titel',
        };
        const errorI18n: any = {
            missing: 'fehlt',
            too_few: 'zu kurz / zu wenig',
        };
        if (!entry.collectionDetails) {
            return [];
        }
        return [].concat(
            ...Object.keys(entry.collectionDetails).map((key) => {
                return (entry.collectionDetails as any)[key].map((error: string) => {
                    return keyI18n[key] + ' ' + errorI18n[error];
                });
            }),
        );
    }

    getColumnIds() {
        return ['Sammlung', 'Metadaten Sammlung'].concat(Object.keys(this.countColumns));
    }

    openNode(node: Node | 'root') {
        if (node === 'root') {
            this.metaWidget.openNode({
                noderef_id: this.metaWidget.getCollectionId(),
                type: 'ccm:map',
            } as Node);
        } else {
            this.metaWidget.openNode(node);
        }
    }

    getListLink(element: CollectionTreeNodeDetailEntry, column: string) {
        if (this.getCount(element, column)) {
            const ids = (element.collectionCounts as any)[column]?.missing;
            const title = (this.countColumns as any)[column] + ' - ' + element.title;
            return (
                environment.eduSharingPath +
                '/components/editorial-desk?mode=metaqs&title=' +
                encodeURIComponent(title) +
                '&ids=' +
                ids.join(',')
            );
        }
        return null;
    }

    getCount(element: CollectionTreeNodeDetailEntry, column: string) {
        return element.collectionCounts
            ? (element.collectionCounts as any)[column]?.missing?.length ?? 0
            : 0;
    }
}
