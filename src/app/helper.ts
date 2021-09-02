import {LearningMaterial} from "./api";
import {environment} from "../environments/environment";
import { Node } from './meta-widget/meta-widget.component';

export class Helper {
    static openNode(node: Node){
        const id =
            (node as LearningMaterial).noderef_id;
        if ((node as LearningMaterial).type === 'ccm:io') {
            window.open(
                (node as LearningMaterial).www_url ||
                environment.eduSharingPath + '/components/render/' + encodeURIComponent(id),
            );
        } else {
            window.open(
                environment.eduSharingPath + '/components/collections?id=' + encodeURIComponent(id),
            );
        }
    }
}
