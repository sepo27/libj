import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { axiosRetry } from '../lib/axiosRetry';
import {
  GetRequestOptions, HtpRequestOptionsBearerAuth,
  HttpClientConfig,
  HttpRequestOptions,
  HttpResponse,
  HttpRetryConfig,
  HttpSubmitArgs,
} from './types';
import { LooseObject } from '../../../../common/types';
import { HttpForm } from '../form/HttpForm';
import { HttpMethod, HttpError, makeHttpBearerAuth } from '../../../httpMeta/src';
import { HttpConfigError } from '../error/HttpConfigError';
import { httpLoggerInterceptor } from '../interceptors/httpLoggerInterceptor';
import { makeUri } from '../../../makeUri/src';
import { UrlEncodedHttpForm } from '../form/UrlEncodedHttpForm';

export class HttpClient {
  constructor(config: HttpClientConfig = {}) {
    this.baseConfig = this.processRequestOptions(config);
    this.agent = axios.create(this.baseConfig);

    // Attach logger

    const { logger } = config;
    if (logger) {
      httpLoggerInterceptor(this.agent, logger);
    }

    // Configure retry logic

    if (config.retry) {
      axiosRetry(this.agent, config.retry);
    }
  }

  /*** Public ***/

  public get<D = LooseObject>(url: string, options: GetRequestOptions = {}): Promise<HttpResponse<D>> {
    const finalUrl = options.query ? makeUri(url, { query: options.query }) : url;

    return this.request<D>(finalUrl, {
      ...options,
      method: HttpMethod.GET,
    });
  }

  public post<D = LooseObject>(...args: HttpSubmitArgs): Promise<HttpResponse<D>> {
    const { url, data: inData, options: inOptions = {} } = this.extractSubmitArgs(args);

    let data, options;

    if (inData instanceof UrlEncodedHttpForm) {
      data = inData.toBody();
      options = {
        ...inOptions,
        headers: {
          ...(inOptions.headers),
          ...inData.getHeaders(),
        },
      };
    } else {
      data = inData;
      options = inOptions;
    }

    return this.request<D>(url, {
      ...options,
      method: HttpMethod.POST,
      data,
    });
  }

  public request<D = LooseObject>(
    url: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<D>> {
    return this.agent
      .request<D, HttpResponse<D>>({
        ...this.processRequestOptions(options),
        url,
      })
      .catch(err => {
        if (err.response) {
          const { status, data, headers } = err.response as HttpResponse;
          throw new HttpError(status, { body: data, headers });
        }
        throw err;
      });
  }

  public get interceptors() { return this.agent.interceptors; }

  public setRetry(config: HttpRetryConfig) {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /*** Private ***/

  private agent: AxiosInstance;
  private baseConfig: AxiosRequestConfig = {};
  private retryConfig: HttpRetryConfig = {};

  private processRequestOptions(inOptions: HttpRequestOptions) {
    const options = { ...inOptions };

    if (options.data instanceof HttpForm) {
      if (
        !options.method
        || [HttpMethod.PUT, HttpMethod.POST, HttpMethod.PATCH].indexOf(options.method as HttpMethod) < 0
      ) {
        throw new HttpConfigError('Form data is only allowed with POST / PUT / PATCH methods');
      }

      options.headers = {
        ...options.headers,
        ...options.data.getHeaders(),
      };
    }

    if (this.baseConfig.data) {
      options.data = { ...this.baseConfig.data, ...options.data };
    }

    if (options.cookies) {
      if (!options.headers) {
        options.headers = {};
      }

      const cookiesArr = Object
        .keys(options.cookies)
        .map(cookieName => `${cookieName}=${options.cookies[cookieName]}`);

      if (!options.headers.Cookie) {
        options.headers.Cookie = [];
      } else if (!Array.isArray(options.headers.Cookie)) {
        options.headers.Cookie = [options.headers.Cookie];
      }

      options.headers.Cookie = options.headers.Cookie.concat(cookiesArr);
    }

    // Handle retry config

    const retryConfig = { ...this.retryConfig };

    if (options.retry) {
      Object.assign(retryConfig, options.retry);
      delete options.retry;
    }

    if (Object.keys(retryConfig).length) {
      options['axios-retry'] = retryConfig;
    }

    // Handle Bearer auth token

    if (inOptions.auth && (inOptions.auth as HtpRequestOptionsBearerAuth).bearerToken) {
      options.headers = {
        ...options.headers,
        Authorization: makeHttpBearerAuth((inOptions.auth as HtpRequestOptionsBearerAuth).bearerToken),
      };
      delete options.auth;
    }

    return options as AxiosRequestConfig;
  }

  private extractSubmitArgs(args: HttpSubmitArgs): { url: string, data: any, options: HttpRequestOptions } {
    let url, data = {}, options = {};

    if (args.length === 1) {
      url = args[0];
    } else if (args.length === 2) {
      ([url, data] = args);
    } else if (args.length === 3) {
      ([url, data, options] = args);
    }

    return { url, data, options };
  }
}
