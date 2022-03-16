import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Input, OnInit} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {CollectionTreeNode, MetaApiService} from "../meta-api.service";
import {StatsResponse} from "../api-analytics";
import {Node} from "../meta-widget/meta-widget.component";
import {Helper} from "../helper";
import {environment} from "../../environments/environment";
import {MetaWidgetService} from "../meta-widget/meta-widget.service";
import {CollectionTreeNodeEntry, Tree} from "../tree";

export interface CollectionTreeNodeStatsEntry extends CollectionTreeNodeEntry{
    data: {
        search: {[key: string]: number};
        collection: {[key: string]: number};
    }
}
@Component({
    selector: 'app-tree-search-counts',
    templateUrl: './tree-search-counts.html',
    styleUrls: ['./tree-search-counts.scss'],
})
export class TreeSearchCounts implements OnInit {
    readonly COLLECTION_POSTFIX = '_collection';
    readonly SEARCH_POSTFIX = '_search';
    readonly THRESHOLD_ERROR = 1;
    readonly THRESHOLD_WARN = 3;

    /*
    private _transformer = (node: CollectionTreeNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            data: node.data,
            level: level,
        };
    };

    treeControl = new NestedTreeControl<CollectionTreeNodeEntry>(
        (node) => node.children,
        // (node) => node.expandable,
    );
    /*
    treeFlattener = new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children,
    );
     */

    dataSource = new MatTreeNestedDataSource<CollectionTreeNodeEntry>();

    columns: {id: string, icon: string; label: string;}[];
    lrtCombinedSKOS: any;
    private lrtData: CollectionTreeNodeEntry[];

    constructor(
        private readonly metaApi: MetaApiService,
        private readonly metaWidget: MetaWidgetService
    ) {}
    collectFacettes(stats: StatsResponse): string[] {
        const facettes = new Set<string>();
        for(const id of Object.keys(stats.stats)) {
            const element = stats.stats[id] as any;
            Object.keys(element.search).forEach(e => facettes.add(e));
            Object.keys(element.material_types).forEach(e => facettes.add(e));
        }
        return [...facettes];
    }
    filter(){
        this.dataSource.data = this.lrtData.filter((l) =>
            l.title.toLowerCase().includes(this.searchToken.toLowerCase())
        );
    }
    async ngOnInit() {
        const data = await this.metaApi.getTree(this.metaWidget.getCollectionId()).toPromise();
        const stats = await this.metaApi.getStatisticsFacettePerCollection(this.metaWidget.getCollectionId()).toPromise();
        this.lrtCombinedSKOS = (await this.metaApi.getCombinedVocab().toPromise()).hasTopConcept;
        // @TODO: adopt to new icons
        const icons: any = {
            'c8e52242-361b-4a2a-b95d-25e516b28b45': 'worksheet',
            '38774279-af36-4ec2-8e70-811d5a51a6a1': 'video',
            '39197d6f-dfb1-4e82-92e5-79f906e9d2a9': 'audio',
            'b8fb5fb2-d8bf-4bbe-ab68-358b65a26bed': 'image',
            '0b2d7dec-8eb1-4a28-9cf2-4f3a4f5a511b': 'exercise',
            '8526273b-2b21-46f2-ac8d-bbf362c8a690': 'lesson_planning',
        }
        const facettes = this.lrtCombinedSKOS.map((skos: any) => {
            return {
                id: skos.id,
                icon: icons[skos.id.split('/')[skos.id.split('/').length - 1]],
                label: skos.prefLabel.de
            }
        });

        this.columns = [{
            id:'total', icon: 'total', label: 'Gesamt',
        }].concat(facettes)

        const dataFlat: CollectionTreeNodeStatsEntry[] = Tree.flatten(data);
        this.lrtData = this.mapLRTData(dataFlat, stats);
        this.filter();
        /*
        this.treeTable.getCollectionTree(this.collectionId).subscribe((collectionTree) => {
            this.dataSource.data = collectionTree.rootNodes;
        });
         */
    }

    searchToken = '';

    getColumnIds() {
        return ['title'].concat(this.columns.map(c => c.id));
    }
    getColumnIdsSplitted() {
        return this.getColumnIds().map(c => [c + this.COLLECTION_POSTFIX, c + this.SEARCH_POSTFIX]).reduce((a,b) => a.concat(b));
    }

    private mapLRTData(dataFlat: CollectionTreeNodeStatsEntry[], stats: StatsResponse) {
        dataFlat.map((d) => {
            d.data = {
                search: this.collectHits(this.lrtCombinedSKOS, stats.stats[d.noderef_id]?.['search']),
                collection: this.collectHits(this.lrtCombinedSKOS, stats.stats[d.noderef_id]?.['material_types'])
            };
        });
        return dataFlat;
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
    private collectHits(skos: any, stat: { [p: string]: number }) {
        let data: {[key: string]: number} = {
            total: stat?.['total']
        };
        return stat;
        /*
        skos.forEach((s: any) => {
            const count = s.relatedMatch.map(
                (r: any) => {
                    return (stat?.[r.id]  || 0) as number
                }).
            reduce((a: number, b: number) => a + b);
            data[s.id] = count;
        });*/
        return data;
    }

    getCount(element: CollectionTreeNodeStatsEntry, column: string) {
        return element.data
            [column.includes('_search') ? 'search' : 'collection']
            [this.getColumnId(column)] || 0
    }

    getColumnId(column: string) {
        return column.replace(this.SEARCH_POSTFIX, '').replace(this.COLLECTION_POSTFIX, '');
    }

    showSearch(element: CollectionTreeNodeEntry, column: string) {
        const id = this.getColumnId(column);
        const query = element.title;
        const parameters: any = {};
        if(id !== 'total') {
            parameters['ccm:oeh_lrt_aggregated'] = [id];
        }
        window.open(
            environment.eduSharingPath + '/components/editorial-desk?mode=audit&' +
            'q=' + encodeURIComponent(query) + '&' +
            'title=' + encodeURIComponent('MetaQS - Suchergebnisse für "' + query + '"') + '&' +
            'filters=' + encodeURIComponent(JSON.stringify(parameters)) + '&' +
            'panel=contents&tab=4&' +
            'ticket=' + this.metaWidget.getTicket() || '',
            '_BLANK'
        )
    }

    showCollectionItems(element: CollectionTreeNodeEntry, column: string) {
        const id = this.getColumnId(column);
        console.log(element.noderef_id);
        const parameters: any = {
            'virtual:collection_id': [element.noderef_id],
        };
        if(id !== 'total') {
            parameters['ccm:oeh_lrt_aggregated'] = [id];
        }
        window.open(
            environment.eduSharingPath + '/components/editorial-desk?mode=audit&' +
            'title=' + encodeURIComponent('MetaQS - Sammlungsinhalte für "' + element.title + '"') + '&' +
            'filters=' + encodeURIComponent(JSON.stringify(parameters)) + '&' +
            '&panel=contents&tab=4&',
            '_BLANK'
        )
    }
}
