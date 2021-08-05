import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MetaApiService} from "../meta-api.service";

export enum Mode {
  MaterialsNoTitle = 'MaterialsNoTitle',
  MaterialsNoLicense = 'MaterialsNoLicense',
  MaterialsNoDiscipline = 'MaterialsNoDiscipline',
  MaterialsNoContext = 'MaterialsNoContext',
  MaterialsNoKeywords = 'MaterialsNoKeywords',
  CollectionsNoDescription = 'CollectionsNoDescription',
  CollectionsNoKeywords = 'CollectionsNoKeywords',
  CollectionsNoContent = 'CollectionsNoContent',
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
ModeDetails[Mode.MaterialsNoDiscipline] = {
  title: 'Materialien ohne Fachgebiet'
};
ModeDetails[Mode.MaterialsNoContext] = {
  title: 'Materialien ohne Bildungsstufe'
};
ModeDetails[Mode.MaterialsNoKeywords] = {
  title: 'Materialien ohne Schlagworte'
};
ModeDetails[Mode.CollectionsNoDescription] = {
  title: 'Sammlungen ohne Beschreibungstext'
};
ModeDetails[Mode.CollectionsNoKeywords] = {
  title: 'Sammlungen ohne Schlagworte'
};
ModeDetails[Mode.CollectionsNoContent] = {
  title: 'Sammlungen ohne Inhalt'
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
    console.log('refresh');
  }
}
