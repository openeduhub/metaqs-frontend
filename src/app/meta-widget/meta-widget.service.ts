import { Injectable } from '@angular/core';
import { Node } from './meta-widget.component';
import { LearningMaterial } from '../api';
import { environment } from '../../environments/environment';

@Injectable()
export class MetaWidgetService {
    private collectionId: string;
    private ticket: string;

    init(collectionId: string, ticket: string) {
        this.collectionId = collectionId;
        this.ticket = ticket;
    }

    getCollectionId() {
        return this.collectionId;
    }

    getTicket() {
        return this.ticket;
    }

    openNode(node: Node) {
        const id = (node as LearningMaterial).noderef_id;
        window.open(
            (node as LearningMaterial).www_url ||
                environment.eduSharingPath +
                    '/components/editorial-desk/?mode=render&viewType=single&ids=' +
                    encodeURIComponent(id) +
                    '&ticket=' +
                    encodeURIComponent(this.ticket),
        );
    }
}
