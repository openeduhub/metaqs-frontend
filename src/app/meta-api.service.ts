import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    AppModelsCollectionAttribute,
    AppModelsLearningMaterialAttribute,
    CollectionsService,
} from './api';
import { Attribute, Node } from './meta-widget/meta-widget.component';

@Injectable({
    providedIn: 'root',
})
export class MetaApiService {
    constructor(private collectionsService: CollectionsService) {}

    getByMissingAttribute(
        nodeRef: string,
        type: Type,
        attribute: Attribute | 'count',
    ): Observable<Node[]> {
        if (type === Type.Material) {
            return this.collectionsService.getChildMaterialsWithMissingAttributesApiV1CollectionsNodeRefIdPendingMaterialsMissingAttrGet(
                nodeRef,
                attribute as AppModelsLearningMaterialAttribute,
            );
        } else if (type === Type.Collection) {
            if (attribute === 'count') {
                return this.collectionsService.getDescendantCollectionsMaterialsCountsApiV1CollectionsNodeRefIdStatsDescendantCollectionsMaterialsCountsGet(
                    nodeRef,
                );
            } else {
                return this.collectionsService.getChildCollectionsWithMissingAttributesApiV1CollectionsNodeRefIdPendingSubcollectionsMissingAttrGet(
                    nodeRef,
                    attribute as AppModelsCollectionAttribute,
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
