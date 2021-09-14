import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    CollectionsService,
    MissingCollectionField,
    MissingMaterialField,
    StatisticsService,
    StatsResponse,
    ValidationStatsResponseCollectionValidationStats, ValidationStatsResponseMaterialValidationStats,
} from './api';
import {HttpClient} from "@angular/common/http";
import {Node} from "./meta-widget/meta-widget.component";
import {MissingField} from "./widget-node-list/widget-node-list";
import {environment} from "../environments/environment";

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
        if(environment.useDummyValues) {
            return of([
                {
                    noderef_id: '1',
                    title: 'Test 1',
                    children: [],
                },
                {
                    noderef_id: '2',
                    title: 'Test 2',
                    children: [],
                }]);
        }
        return (this.collectionsService.getPortalTree(nodeRef) as Observable<CollectionTreeNode[]>);
    }
    getStatisticsMaterialPerCollection(
        nodeRef: string
    ) {
        if(environment.useDummyValues) {
            return of({
                derived_at: '',
                stats: {}
            } as StatsResponse);
        }
        return this.statisticsService.readStatsValidation(nodeRef);
    }
    getCollectionValidation(
        nodeRef: string
    ): Observable<ValidationStatsResponseCollectionValidationStats[]> {
        if(environment.useDummyValues) {
            return of([{
                noderef_id: '1',
                validation_stats: {
                    title: [],
                    description: ['missing'],
                    educontext: ['missing'],
                    keywords: ['missing'],
                },
            },
            {
                noderef_id: '2',
                validation_stats: {
                    title: [],
                    description: ['too_few'],
                },
            }]);
        }
        return this.statisticsService.readStatsValidationCollection(nodeRef);
    }
    getCollectionMaterialStats(
        nodeRef: string
    ): Observable<Array<ValidationStatsResponseMaterialValidationStats>> {
        if(environment.useDummyValues) {
            return of([{
                noderef_id: '1',
                validation_stats: {
                    title: {
                        missing: 5
                    },
                    description: {
                        missing: 2
                    }
                }
                }]);
        }
        return this.statisticsService.readStatsValidation(nodeRef);
    }
    getStatisticsFacettePerCollection(
        nodeRef: string
    ) {
        if(environment.useDummyValues) {
            return of({
                derived_at: '',
                stats: {}
            } as StatsResponse);
        }
        return this.statisticsService.readStats(nodeRef);
    }
    getByMissingAttribute(
        nodeRef: string,
        type: Type,
        attribute: MissingField | 'count',
    ): Observable<Node[]> {
        if (type === Type.Material) {
            return this.collectionsService.filterMaterialsWithMissingAttributes(
                nodeRef,
                attribute as MissingMaterialField,
            );
        } else if (type === Type.Collection) {
            if (attribute === 'count') {
                return this.collectionsService.materialCountsTree(
                    nodeRef,
                );
            } else {
                return this.collectionsService.filterCollectionsWithMissingAttributes(
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
