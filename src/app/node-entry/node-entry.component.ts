import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-node-entry',
  templateUrl: './node-entry.component.html',
  styleUrls: ['./node-entry.component.scss']
})
export class NodeEntryComponent implements OnInit {
  @Input() node: any;
  constructor() { }

  ngOnInit(): void {
  }

}
