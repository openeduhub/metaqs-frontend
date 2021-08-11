import { Injectable } from '@angular/core';
import {Attribute, CollectionsService} from "./api";

@Injectable({
  providedIn: 'root'
})
export class MetaApiService {

  constructor(
    private collectionsService: CollectionsService
  ) { }
  getByMissingAttribute(nodeRef: string, type: Type, attribute: Attribute) {
    if(type === Type.Material) {
      return this.collectionsService.getChildMaterialsWithMissingAttributesApiV1CollectionsNodeRefIdPendingMaterialsMissingAttrGet(nodeRef, attribute);
    } else if (type === Type.Collection) {
      //return this.collectionsService.getChildMaterialsWithMissingAttributesApiV1CollectionsNodeRefIdPendingMaterialsMissingAttrGet()
    }
    throw new Error('Unexpected type ' + type);
  }
}
export enum Type {
  Material,
  Collection
}
