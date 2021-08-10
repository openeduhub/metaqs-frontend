import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MetaApiService, Type} from "../meta-api.service";
import {Attribute, LearningMaterial} from "../api";
import {environment} from "../../environments/environment";

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
  title: string,
  type: Type,
  attribute?: Attribute
};
const ModeDetails: { [key: string]: ModeDetail } = {};
ModeDetails[Mode.MaterialsNoTitle] = {
  title: 'Materialien ohne Titel',
  type: Type.Material,
  attribute: Attribute.Cclomtitle
};
ModeDetails[Mode.MaterialsNoLicense] = {
  title: 'Materialien ohne Lizenz',
  type: Type.Material,
};
ModeDetails[Mode.MaterialsNoDiscipline] = {
  title: 'Materialien ohne Fachgebiet',
  type: Type.Material,
  attribute: Attribute.Ccmtaxonid
};
ModeDetails[Mode.MaterialsNoContext] = {
  title: 'Materialien ohne Bildungsstufe',
  type: Type.Material,
  attribute: Attribute.Ccmeducationalcontext
};
ModeDetails[Mode.MaterialsNoKeywords] = {
  title: 'Materialien ohne Schlagworte',
  type: Type.Material,
  attribute: Attribute.CclomgeneralKeyword
};
ModeDetails[Mode.CollectionsNoDescription] = {
  title: 'Sammlungen ohne Beschreibungstext',
  type: Type.Collection,
};
ModeDetails[Mode.CollectionsNoKeywords] = {
  title: 'Sammlungen ohne Schlagworte',
  type: Type.Collection,
  attribute: Attribute.CclomgeneralKeyword
};
ModeDetails[Mode.CollectionsNoContent] = {
  title: 'Sammlungen ohne Inhalt',
  type: Type.Collection,
};
@Component({
  selector: 'app-meta-widget',
  templateUrl: './meta-widget.component.html',
  styleUrls: ['./meta-widget.component.scss']
})
export class MetaWidgetComponent implements OnInit, OnChanges {
  readonly Mode = Mode;
  @Input() collectionid: string;
  @Input() mode: Mode;
  data: LearningMaterial[];
  modeDetail: ModeDetail;
  count: number|null = 0;
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

  async refresh() {
    if(this.modeDetail.attribute) {
      this.data = await this.metaApi.getByMissingAttribute(this.collectionid, this.modeDetail.type, this.modeDetail.attribute).toPromise()
    } else {
      console.warn('missing mode ' + this.modeDetail);
    }
    //this.data = [{name: 'Test'}] as any;
    console.log('refresh', this.count);
  }

  editNode(node: LearningMaterial) {
    let action: string;
    if(this.mode === Mode.MaterialsNoLicense) {
      action = 'OPTIONS.LICENSE';
    } else {
      action = 'OPTIONS.EDIT';
    }
    const win = window.open(environment.eduSharingPath+'/components/render/'+encodeURIComponent(node.node_ref_id)+'?action='+action)
    if(win) {
      win.onunload = () => {
        this.refresh();
        // give the elastic index some more time, and try again
        setTimeout(() => this.refresh(), 5000);
      }
    }
  }
}
