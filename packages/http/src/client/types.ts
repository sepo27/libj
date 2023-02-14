import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';
import { LooseObject } from '../../../../common/types';
import { LoggerInterface } from '../../../logger/src';

export type HttpRetryConfig = IAxiosRetryConfig;

export interface HtpRequestOptionsBearerAuth {
  bearerToken: string
}

export interface HttpRequestOptions extends Omit<AxiosRequestConfig, 'auth'> {
  method?: any, // TODO: find out the way to strictly type it
  cookies?: LooseObject,
  retry?: HttpRetryConfig,
  auth?: { username: string, password: string } | HtpRequestOptionsBearerAuth
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

export type AxiosHttpError = AxiosError;
