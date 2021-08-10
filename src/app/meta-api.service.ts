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
      return this.collectionsService.getMaterialsWithMissingAttributesApiV1CollectionsNodeRefIdPendingMaterialsMissingAttrGet(nodeRef, attribute);
    }
    throw new Error('Unexpected type ' + type);
  }
}
export enum Type {
  Material,
  Collection
}
