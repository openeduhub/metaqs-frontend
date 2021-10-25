import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MetaApiService, Score} from "../meta-api.service";
import {MetaWidgetService} from "../meta-widget/meta-widget.service";

@Component({
    selector: 'app-meta-score',
    templateUrl: './meta-score.component.html',
    styleUrls: ['./meta-score.component.scss']
})
export class MetaScoreComponent implements OnInit {
    score: Score;
    constructor(
        private readonly metaApi: MetaApiService,
        private readonly metaWidget: MetaWidgetService
    ) { }

    async ngOnInit() {
        this.score = await this.metaApi.getScore(this.metaWidget.getCollectionId()).toPromise();
    }

    getQuality() {
        return this.score.score > 90 ? 'good' : this.score.score > 60 ? 'mediocore' : 'poor';
    }
}
