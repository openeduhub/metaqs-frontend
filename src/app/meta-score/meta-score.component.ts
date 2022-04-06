import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MetaApiService, Score } from '../meta-api.service';
import { MetaWidgetService } from '../meta-widget/meta-widget.service';

@Component({
    selector: 'app-meta-score',
    templateUrl: './meta-score.component.html',
    styleUrls: ['./meta-score.component.scss'],
})
export class MetaScoreComponent implements OnInit, OnDestroy {
    score: Score;

    private destroyed$ = new Subject<void>();

    constructor(
        private readonly metaApi: MetaApiService,
        private readonly metaWidget: MetaWidgetService,
    ) {}

    ngOnInit(): void {
        this.metaWidget
            .observeCollectionId()
            .pipe(
                takeUntil(this.destroyed$),
                switchMap((collectionId) => this.metaApi.getScore(collectionId)),
            )
            .subscribe((score) => (this.score = score));
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    getQuality() {
        return this.score.score > 90 ? 'good' : this.score.score > 60 ? 'mediocore' : 'poor';
    }
}
