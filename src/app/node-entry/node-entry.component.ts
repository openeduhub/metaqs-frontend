import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {LearningMaterial} from "../api";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-node-entry',
  templateUrl: './node-entry.component.html',
  styleUrls: ['./node-entry.component.scss']
})
export class NodeEntryComponent implements OnInit {
  @Input() node: LearningMaterial;
  @Output() edit = new EventEmitter<LearningMaterial>();

  constructor() { }

  ngOnInit(): void {
  }

  openNode(node: LearningMaterial) {
    window.open(node.www_url || environment.eduSharingPath+'/components/render/'+encodeURIComponent(node.node_ref_id));
  }
}
