import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    CollectionsService, MaterialsService,
    MissingCollectionField,
    MissingMaterialField,
    StatisticsService,
} from './api';
import {HttpClient} from "@angular/common/http";
import {Node} from "./meta-widget/meta-widget.component";
import {MissingField} from "./widget-node-list/widget-node-list";
import {environment} from "../environments/environment";
import { AnalyticsService } from './api-analytics';
import {ValidationStatsResponseCollectionValidationStats} from "./api/model/validationStatsResponseCollectionValidationStats";
import {StatsResponse} from "./api/model/statsResponse";
import {ValidationStatsResponseMaterialValidationStats} from "./api/model/validationStatsResponseMaterialValidationStats";

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
        private materialsService: MaterialsService,
        private statisticsService: StatisticsService,
        private analyticsService: AnalyticsService,
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
        return this.analyticsService.readStatsValidationNoderefIdValidationGet(nodeRef);
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
        return this.analyticsService.readStatsValidationCollectionNoderefIdValidationCollectionsGet(nodeRef);
    }
    getCollectionMaterialStats(
        nodeRef: string
    ): Observable<Array<ValidationStatsResponseMaterialValidationStats>> {
        if(environment.useDummyValues) {
            return of([{
                noderef_id: '1',
                validation_stats: {
                    title: {
                        missing: ['a','b']
                    },
                    description: {
                        missing: ['a']
                    }
                }
                }]);
        }
        return this.analyticsService.readStatsValidationNoderefIdValidationGet(nodeRef);
    }
    getStatisticsFacettePerCollection(
        nodeRef: string
    ): Observable<StatsResponse> {
        if(environment.useDummyValues) {
            return of({
                derived_at: '',
                stats: {}
            } as StatsResponse);
        }
        return this.analyticsService.readStatsNoderefIdGet(nodeRef);
    }
    getByMissingAttribute(
        nodeRef: string,
        type: Type,
        attribute: MissingField | 'count',
    ): Observable<Node[]> {
        if (type === Type.Material) {
            return this.materialsService.filterMaterialsWithMissingAttributes(
                nodeRef,
                attribute as MissingMaterialField,
            );
        } else if (type === Type.Collection) {
            if (attribute === 'count') {
                return this.statisticsService.materialCountsTree(
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
    getScore(
        nodeRef: string,
    ): Observable<Score> {
        return this.statisticsService.score(nodeRef) as Observable<Score>;
    }
}
export type Score = {
    score: number
};
export enum Type {
    Material,
    Collection,
}
