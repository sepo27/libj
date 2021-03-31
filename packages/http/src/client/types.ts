import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LooseObject } from '../../../../common/types';

export interface HttpRequestOptions extends AxiosRequestConfig {}

export interface HttpClientConfig extends HttpRequestOptions {}

export type HttpHeaders = LooseObject;

export interface HttpResponse<D = LooseObject> extends AxiosResponse<D> {
  headers: HttpHeaders,
}

export type HttpSubmitArgs = [string] | [string, any] | [string, any, HttpRequestOptions];
