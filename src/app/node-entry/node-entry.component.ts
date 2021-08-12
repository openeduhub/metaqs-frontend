import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {LearningMaterial} from "../api";
import {environment} from "../../environments/environment";
import {Node} from "../meta-widget/meta-widget.component";

@Component({
  selector: 'app-node-entry',
  templateUrl: './node-entry.component.html',
  styleUrls: ['./node-entry.component.scss']
})
export class NodeEntryComponent implements OnInit {
  @Input() node: Node;
  @Output() edit = new EventEmitter<Node>();

  constructor() { }

  ngOnInit(): void {
  }

  openNode(node: Node) {
    if(node.type === 'ccm:io') {
      window.open((node as LearningMaterial).www_url || environment.eduSharingPath + '/components/render/' + encodeURIComponent(node.node_ref_id));
    } else {
      window.open(environment.eduSharingPath + '/components/collections?id=' + encodeURIComponent(node.node_ref_id));
    }
  }
}
