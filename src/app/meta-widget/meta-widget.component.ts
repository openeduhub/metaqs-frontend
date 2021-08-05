import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MetaApiService} from "../meta-api.service";

export enum Mode {
  MaterialsNoTitle = 'MaterialsNoTitle',
  MaterialsNoLicense = 'MaterialsNoLicense',
  MaterialsNoDiscipline = 'MaterialsNoDiscipline',
  MaterialsNoContext = 'MaterialsNoContext',
  MaterialsNoKeywords = 'MaterialsNoKeywords',
}

export type ModeDetail = {
  title: string
};
const ModeDetails: { [key: string]: ModeDetail } = {};
ModeDetails[Mode.MaterialsNoTitle] = {
  title: 'Materialien ohne Titel'
};
ModeDetails[Mode.MaterialsNoLicense] = {
  title: 'Materialien ohne Lizenz'
};
@Component({
  selector: 'app-meta-widget',
  templateUrl: './meta-widget.component.html',
  styleUrls: ['./meta-widget.component.scss']
})
export class MetaWidgetComponent implements OnInit, OnChanges {
  @Input() collectionid: string;
  @Input() mode: Mode;
  modeDetail: ModeDetail;
  nodes: any[];
  constructor(
    private metaApi: MetaApiService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.modeDetail = ModeDetails[this.mode.toString()];
    this.refresh();
  }

  refresh() {

  }
}
