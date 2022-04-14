import { Injectable } from '@angular/core';
import { Node } from './meta-widget.component';
import { LearningMaterial } from '../api';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MetaWidgetService {
    private collectionIdSubject = new BehaviorSubject<string | null>(null);
    private ticketSubject = new BehaviorSubject<string | null>(null);

    init(collectionId: string, ticket: string) {
        this.collectionIdSubject.next(collectionId);
        this.ticketSubject.next(ticket);
    }

    getCollectionId() {
        return this.collectionIdSubject.value as string;
    }

    observeCollectionId(): Observable<string> {
        return this.collectionIdSubject.pipe(
            filter((collectionId): collectionId is string => collectionId !== null),
        );
    }

    getTicket() {
        return this.ticketSubject.value as string;
    }

    openNode(node: Node) {
        const id = (node as LearningMaterial).noderef_id;
        window.open(
            (node as LearningMaterial).www_url ||
                environment.eduSharingPath +
                    '/components/editorial-desk/?mode=render&viewType=single&ids=' +
                    encodeURIComponent(id) +
                    '&ticket=' +
                    encodeURIComponent(this.getTicket()),
        );
    }
}
