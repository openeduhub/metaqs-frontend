import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tree, TreeNode, TreeRawData } from './tree';

export type CollectionTreeNode = TreeNode<CollectionData>;
export type CollectionTree = Tree<CollectionData>;

interface CollectionsResponse {
    item_id: string;
    q: RawCollection[];
}

interface RawCollection extends CollectionData {
    id: string;
    path: string[];
}

export interface CollectionData {
    title: string;
    count_total_resources: number;
    // count_waiting_resources: number;
    // count_query_results?: number;
}

@Injectable({
    providedIn: 'root',
})
export class TreeTableService {
    constructor(private readonly http: HttpClient) {}

    getCollectionTree(id: string): Observable<Tree<CollectionData>> {
        return this.getCollections(id).pipe(
            map((collections) => Tree.generateTree(this.mapCollections(id, collections))),
        );
    }

    // TODO: Merge with other API endpoints.
    private getCollections(id: string): Observable<RawCollection[]> {
        const baseUrl = 'metaqs-api';
        const url = `${baseUrl}/collections/${id}/collections`;
        return this.http.get<CollectionsResponse>(url).pipe(map((response) => response.q));
    }

    private mapCollections(
        rootId: string,
        collections: RawCollection[],
    ): TreeRawData<CollectionData>[] {
        return collections.map((collection) => {
            const { id, path, ...data } = collection;
            const parent = path[path.length - 1];
            if (parent === rootId) {
                return { id, data };
            } else {
                return { id, parent, data };
            }
        });
    }
}
