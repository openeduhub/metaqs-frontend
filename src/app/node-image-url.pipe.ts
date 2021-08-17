import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../environments/environment';
import { Node } from './meta-widget/meta-widget.component';
import { CollectionMaterialsCount, LearningMaterial } from './api';

@Pipe({
    name: 'nodeImageUrl',
})
export class NodeImageUrlPipe implements PipeTransform {
    transform(
        value: Node,
        args = {
            width: 200,
            height: 200,
        },
    ): string {
        const id =
            (value as LearningMaterial).node_ref_id ??
            (value as CollectionMaterialsCount).collection_id;
        return (
            environment.eduSharingPath +
            '/preview?nodeId=' +
            encodeURIComponent(id) +
            '&crop=true&maxWidth=' +
            encodeURIComponent(args.width) +
            '&maxHeight=' +
            encodeURIComponent(args.height)
        );
    }
}
