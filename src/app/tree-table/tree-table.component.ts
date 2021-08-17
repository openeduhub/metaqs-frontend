import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CollectionData, CollectionTreeNode, TreeTableService } from './tree-table.service';

interface CollectionFlatNode {
    data: CollectionData;
    expandable: boolean;
    level: number;
}

@Component({
    selector: 'app-tree-table',
    templateUrl: './tree-table.component.html',
    styleUrls: ['./tree-table.component.scss'],
})
export class TreeTableComponent implements OnInit {
    @Input() collectionId: string;

    private _transformer = (node: CollectionTreeNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            data: node.data,
            level: level,
        };
    };

    treeControl = new FlatTreeControl<CollectionFlatNode>(
        (node) => node.level,
        (node) => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children,
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    columns = ['title', 'count_total_resources'];

    constructor(private readonly treeTable: TreeTableService) {}

    ngOnInit(): void {
        this.treeTable.getCollectionTree(this.collectionId).subscribe((collectionTree) => {
            this.dataSource.data = collectionTree.rootNodes;
        });
    }

    hasChild = (_: number, node: CollectionFlatNode) => node.expandable;
}
