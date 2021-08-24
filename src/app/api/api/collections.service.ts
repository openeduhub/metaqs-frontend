/**
 * \"MetaQS API\"
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { AppModelsCollectionAttribute } from '../model/models';
import { AppModelsLearningMaterialAttribute } from '../model/models';
import { Collection } from '../model/models';
import { CollectionMaterialsCount } from '../model/models';
import { HTTPValidationError } from '../model/models';
import { LearningMaterial } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Get Child Collections With Missing Attributes
     * @param noderefId 
     * @param missingAttr 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet(noderefId: string, missingAttr: AppModelsCollectionAttribute, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<Collection>>;
    public getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet(noderefId: string, missingAttr: AppModelsCollectionAttribute, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<Collection>>>;
    public getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet(noderefId: string, missingAttr: AppModelsCollectionAttribute, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<Collection>>>;
    public getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet(noderefId: string, missingAttr: AppModelsCollectionAttribute, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (noderefId === null || noderefId === undefined) {
            throw new Error('Required parameter noderefId was null or undefined when calling getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet.');
        }
        if (missingAttr === null || missingAttr === undefined) {
            throw new Error('Required parameter missingAttr was null or undefined when calling getChildCollectionsWithMissingAttributesApiV1CollectionsNoderefIdPendingSubcollectionsMissingAttrGet.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<Collection>>(`${this.configuration.basePath}/api/v1/collections/${encodeURIComponent(String(noderefId))}/pending-subcollections/${encodeURIComponent(String(missingAttr))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Child Materials With Missing Attributes
     * @param noderefId 
     * @param missingAttr 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet(noderefId: string, missingAttr: AppModelsLearningMaterialAttribute, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<LearningMaterial>>;
    public getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet(noderefId: string, missingAttr: AppModelsLearningMaterialAttribute, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<LearningMaterial>>>;
    public getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet(noderefId: string, missingAttr: AppModelsLearningMaterialAttribute, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<LearningMaterial>>>;
    public getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet(noderefId: string, missingAttr: AppModelsLearningMaterialAttribute, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (noderefId === null || noderefId === undefined) {
            throw new Error('Required parameter noderefId was null or undefined when calling getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet.');
        }
        if (missingAttr === null || missingAttr === undefined) {
            throw new Error('Required parameter missingAttr was null or undefined when calling getChildMaterialsWithMissingAttributesApiV1CollectionsNoderefIdPendingMaterialsMissingAttrGet.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<LearningMaterial>>(`${this.configuration.basePath}/api/v1/collections/${encodeURIComponent(String(noderefId))}/pending-materials/${encodeURIComponent(String(missingAttr))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Collections
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCollectionsApiV1CollectionsGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<any>;
    public getCollectionsApiV1CollectionsGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<any>>;
    public getCollectionsApiV1CollectionsGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<any>>;
    public getCollectionsApiV1CollectionsGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<any>(`${this.configuration.basePath}/api/v1/collections`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Descendant Collections Materials Counts
     * @param noderefId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDescendantCollectionsMaterialsCountsApiV1CollectionsNoderefIdStatsDescendantCollectionsMaterialsCountsGet(noderefId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<CollectionMaterialsCount>>;
    public getDescendantCollectionsMaterialsCountsApiV1CollectionsNoderefIdStatsDescendantCollectionsMaterialsCountsGet(noderefId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<CollectionMaterialsCount>>>;
    public getDescendantCollectionsMaterialsCountsApiV1CollectionsNoderefIdStatsDescendantCollectionsMaterialsCountsGet(noderefId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<CollectionMaterialsCount>>>;
    public getDescendantCollectionsMaterialsCountsApiV1CollectionsNoderefIdStatsDescendantCollectionsMaterialsCountsGet(noderefId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (noderefId === null || noderefId === undefined) {
            throw new Error('Required parameter noderefId was null or undefined when calling getDescendantCollectionsMaterialsCountsApiV1CollectionsNoderefIdStatsDescendantCollectionsMaterialsCountsGet.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<CollectionMaterialsCount>>(`${this.configuration.basePath}/api/v1/collections/${encodeURIComponent(String(noderefId))}/stats/descendant-collections-materials-counts`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Portals
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPortalsApiV1CollectionsTreeGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<object>>;
    public getPortalsApiV1CollectionsTreeGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<object>>>;
    public getPortalsApiV1CollectionsTreeGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<object>>>;
    public getPortalsApiV1CollectionsTreeGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<object>>(`${this.configuration.basePath}/api/v1/collections/tree`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
