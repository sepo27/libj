import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LooseObject } from '../../../../common/types';
import { LoggerInterface } from '../../../logger/src';

export interface HttpRequestOptions extends AxiosRequestConfig {
  method?: any, // TODO: find out the way to strictly type it
}

export interface GetRequestOptions extends HttpRequestOptions {
  query?: LooseObject, // TODO: import proper type from make-uri
}

type LoggerSettingRequestDataLogMapper = (data: any) => any;
export type { LoggerSettingRequestDataLogMapper as HttpClientLoggerSettingRequestDataLogMapper };

interface LoggerSettingOptions {
  requestDataLog?: boolean | LoggerSettingRequestDataLogMapper,
}
export { LoggerSettingOptions as HttpClientLoggerSettingOptions };

type LoggerSetting = LoggerInterface | { logger: LoggerInterface, options: LoggerSettingOptions };
export { LoggerSetting as HttpClientLoggerSetting };

export interface HttpClientConfig extends HttpRequestOptions {
  logger?: LoggerSetting,
}

export type HttpHeaders = LooseObject;

export interface HttpResponse<D = LooseObject> extends AxiosResponse<D> {
  headers: HttpHeaders,
}

export type HttpSubmitArgs = [string] | [string, any] | [string, any, HttpRequestOptions];

export interface HttpLoggerSession {
  reqConfig: HttpRequestOptions,
  response: HttpResponse,
}
