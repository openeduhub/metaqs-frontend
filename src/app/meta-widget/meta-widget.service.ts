import {Injectable} from "@angular/core";
import {Node} from "./meta-widget.component";
import {LearningMaterial} from "../api";
import {environment} from "../../environments/environment";

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

    openNode(node: Node){
        const id =
            (node as LearningMaterial).noderef_id;
        if ((node as LearningMaterial).type === 'ccm:io') {
            window.open(
                (node as LearningMaterial).www_url ||
                environment.eduSharingPath + '/components/render/' + encodeURIComponent(id) + '?ticket=' + encodeURIComponent(this.ticket),
            );
        } else {
            window.open(
                environment.eduSharingPath + '/components/collections?id=' + encodeURIComponent(id) + '&ticket=' + encodeURIComponent(this.ticket),
            );
        }
    }
}
