import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CollectionMaterialsCount, LearningMaterial } from '../api';
import { environment } from '../../environments/environment';
import { Node } from '../meta-widget/meta-widget.component';
import {Helper} from "../helper";
import {MetaWidgetService} from "../meta-widget/meta-widget.service";

@Component({
    selector: 'app-node-entry',
    templateUrl: './node-entry.component.html',
    styleUrls: ['./node-entry.component.scss'],
})
export class NodeEntryComponent implements OnInit {
    @Input() node: Node;
    @Output() edit = new EventEmitter<Node>();

    constructor(
        private metaWidget: MetaWidgetService
    ) {}

    ngOnInit(): void {}

    openNode(node: Node) {
        this.metaWidget.openNode(node);
    }

    isCollectionCount() {
        return (this.node as CollectionMaterialsCount).materials_count !== undefined;
    }
}
