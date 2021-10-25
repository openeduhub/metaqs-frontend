import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {MetaWidgetService} from "./meta-widget.service";
import {Collection, CollectionMaterialsCount, LearningMaterial} from "../api";

export enum Mode {
    Score = 'Score',
    MaterialsNoTitle = 'MaterialsNoTitle',
    MaterialsNoLicense = 'MaterialsNoLicense',
    MaterialsNoDiscipline = 'MaterialsNoDiscipline',
    MaterialsNoContext = 'MaterialsNoContext',
    MaterialsNoKeywords = 'MaterialsNoKeywords',
    CollectionsNoDescription = 'CollectionsNoDescription',
    CollectionsNoKeywords = 'CollectionsNoKeywords',
    CollectionsNoContent = 'CollectionsNoContent',
    CollectionsTreeSearchCounts = 'CollectionsTreeSearchCounts',
    CollectionsTreeStats = 'CollectionsTreeStats',
}
export type Node = LearningMaterial | Collection | CollectionMaterialsCount;

@Component({
    selector: 'app-meta-widget',
    templateUrl: './meta-widget.component.html',
    styleUrls: ['./meta-widget.component.scss'],
    providers: [MetaWidgetService]
})
export class MetaWidgetComponent implements OnInit, OnChanges {
    readonly Mode = Mode;
    @Input() collectionid: string;
    @Input() mode: Mode;
    @Input() ticket: string;

    constructor(
        private widgetService: MetaWidgetService
    ) {

    }

    getModeComponent(){
        if(this.mode === Mode.CollectionsTreeSearchCounts){
            return 'treeCount';
        }
        if(this.mode === Mode.CollectionsTreeStats){
            return 'treeStats';
        }
        if(this.mode === Mode.Score){
            return 'score';
        }
        return 'widgetNode';
    }

    ngOnInit(): void {
        this.widgetService.init(this.collectionid, this.ticket);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.widgetService.init(this.collectionid, this.ticket);
    }

}
