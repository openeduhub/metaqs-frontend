import { Pipe, PipeTransform } from '@angular/core';
import {environment} from "../environments/environment";
import {Node} from "./meta-widget/meta-widget.component";

@Pipe({
  name: 'nodeImageUrl'
})
export class NodeImageUrlPipe implements PipeTransform {

  transform(value: Node, args = {
              width: 200, height: 200
            }
  ): string {
    return environment.eduSharingPath + '/preview?nodeId=' + encodeURIComponent(value.node_ref_id) +
      '&crop=true&maxWidth='+encodeURIComponent(args.width)+"&maxHeight="+encodeURIComponent(args.height);
  }

}
