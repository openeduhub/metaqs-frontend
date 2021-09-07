import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    CollectionsService, MissingCollectionField, MissingMaterialField, StatisticsService, StatsResponse,
} from './api';
import { MissingField, Node } from './meta-widget/meta-widget.component';
import {HttpClient} from "@angular/common/http";

export interface CollectionTreeNode {
    noderef_id: string;
    title: string;
    children: CollectionTreeNode[];
}
@Injectable({
    providedIn: 'root',
})
export class MetaApiService {
    constructor(
        private collectionsService: CollectionsService,
        private statisticsService: StatisticsService,
        private httpClient: HttpClient,
    ) {}
    getCombinedVocab() {
        return this.httpClient.get<any>
        ('https://vocabs.openeduhub.de/w3id.org/openeduhub/vocabs/learningResourceTypeCombined/index.json');
    }
    getTree(
        nodeRef: string
    ) {
        /*return of([
            {
                noderef_id: '1',
                title: 'Test 1',
                children: [],
            },
            {
                noderef_id: '2',
                title: 'Test 2',
                children: [],
            }]);*/
        return (this.collectionsService.getPortalTreeApiV1CollectionsNoderefIdTreeGet(nodeRef) as Observable<CollectionTreeNode[]>);
    }
    getStatistics(
        nodeRef: string
    ) {
        /*return of({
            derived_at: '',
            stats: {}
        } as StatsResponse);*/
        return this.statisticsService.getReadStatsApiV1ReadStatsNoderefIdGet(nodeRef);
    }
    getByMissingAttribute(
        nodeRef: string,
        type: Type,
        attribute: MissingField | 'count',
    ): Observable<Node[]> {
        if (type === Type.Material) {
            return this.collectionsService.getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet(
                nodeRef,
                attribute as MissingMaterialField,
            );
        } else if (type === Type.Collection) {
            if (attribute === 'count') {
                return this.collectionsService.getDescendantCollectionsMaterialsCountsApiV1CollectionsNoderefIdStatsDescendantCollectionsMaterialsCountsGet(
                    nodeRef,
                );
            } else {
                return this.collectionsService.getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet(
                    nodeRef,
                    attribute as MissingCollectionField,
                );
            }
        }
        throw new Error('Unexpected type ' + type);
    }
}

export enum Type {
    Material,
    Collection,
}
