import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Input, OnInit} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {CollectionTreeNode, MetaApiService} from "../meta-api.service";
import {StatsResponse} from "../api";

interface CollectionTreeNodeEntry extends CollectionTreeNode{
    title: string;
    data: {
        search: {[key: string]: number};
        collection: {[key: string]: number};
    }
    level: number;
}
@Component({
    selector: 'app-tree-table',
    templateUrl: './tree-table.component.html',
    styleUrls: ['./tree-table.component.scss'],
})
export class TreeTableComponent implements OnInit {
    readonly COLLECTION_POSTFIX = '_collection';
    readonly SEARCH_POSTFIX = '_search';
    @Input() collectionId: string;

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

    columns: {id: string; label: string;}[];
    lrtCombinedSKOS: any;

    constructor(
        private readonly metaApi: MetaApiService
    ) {}
    flatten(flat: CollectionTreeNode[], collector: CollectionTreeNodeEntry[] = [], level = 1): CollectionTreeNodeEntry[] {
        flat.forEach((f) => {
            const entry = f as CollectionTreeNodeEntry ;
            entry.level = level;
            collector.push(entry);
            this.flatten(entry.children, collector, level + 1);
        })
        return collector;

    }
    collectFacettes(stats: StatsResponse): string[] {
        const facettes = new Set<string>();
        for(const id of Object.keys(stats.stats)) {
            const element = stats.stats[id] as any;
            Object.keys(element.search).forEach(e => facettes.add(e));
            Object.keys(element.material_types).forEach(e => facettes.add(e));
        }
        console.log(facettes);
        return [...facettes];
    }
    async ngOnInit() {
        const data = await this.metaApi.getTree(this.collectionId).toPromise();
        const stats = await this.metaApi.getStatistics(this.collectionId).toPromise();
        // const facettes = this.collectFacettes(stats);
        const mappings: any = {
            'n-a': 'Keine Angabe',
            'total': 'Gesamt',
        }
        this.lrtCombinedSKOS = (await this.metaApi.getCombinedVocab().toPromise()).hasTopConcept;
        const facettes = this.lrtCombinedSKOS.map((skos: any) => {
            return {
                id: skos.id,
                label: skos.prefLabel.de
            }
        });
        console.log(facettes);

        this.columns = facettes;
        this.columns = this.columns.sort((a, b) => {
            return Object.keys(mappings).indexOf(a.id) <= Object.keys(mappings).indexOf(b.id) ? 1 : -1;
        })
        const dataFlat = this.flatten(data);
        const lrtData = this.mapLRTData(dataFlat, stats);
        console.log(lrtData);
        this.dataSource.data = lrtData;
        /*
        this.treeTable.getCollectionTree(this.collectionId).subscribe((collectionTree) => {
            this.dataSource.data = collectionTree.rootNodes;
        });
         */
    }

    hasChild = (_: number, node: CollectionTreeNodeEntry) => node.children?.length;

    getColumnIds() {
        return ['title'].concat(this.columns.map(c => c.id));
    }
    getColumnIdsSplitted() {
        return this.getColumnIds().map(c => [c + this.SEARCH_POSTFIX, c + this.COLLECTION_POSTFIX]).reduce((a,b) => a.concat(b));
    }

    private mapLRTData(dataFlat: CollectionTreeNodeEntry[], stats: StatsResponse) {
        dataFlat.map((d) => {
            d.data = {
                search: this.collectHits(this.lrtCombinedSKOS, stats.stats[d.noderef_id]['search']),
                collection: this.collectHits(this.lrtCombinedSKOS, stats.stats[d.noderef_id]['material_types'])
            };
        });
        console.log(dataFlat);
        return dataFlat;
    }

    private collectHits(skos: any, stat: { [p: string]: number }) {
        //console.log(stat);
        let data: {[key: string]: number} = {
            total: stat['total']
        };
        skos.forEach((s: any) => {
            const count = s.relatedMatch.map(
                (r: any) => {
                    return (stat[r.id]  || 0) as number
                }).
            reduce((a: number, b: number) => a + b);
            data[s.id] = count;
        });
        return data;
    }
}
