import axios, { AxiosInstance } from 'axios';
import { GetRequestOptions, HttpClientConfig, HttpRequestOptions, HttpResponse, HttpSubmitArgs } from './types';
import { LooseObject } from '../../../../common/types';
import { HttpForm } from '../form/HttpForm';
import { HttpMethod, HttpError } from '../../../httpMeta/src';
import { HttpConfigError } from '../error/HttpConfigError';
import { httpLoggerInterceptor } from '../interceptors/httpLoggerInterceptor';
import { makeUri } from '../../../makeUri/src';

export class HttpClient {
  constructor(config: HttpClientConfig = {}) {
    this.agent = axios.create(config);

    // Attach logger

    const { logger } = config;
    if (logger) {
      httpLoggerInterceptor(this.agent, logger);
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
    const { url, data, options } = this.extractSubmitArgs(args);

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
        ...this.processOptions(options),
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

  /*** Private ***/

  private agent: AxiosInstance;

  private processOptions(inOptions) {
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

    return options;
  }

  private extractSubmitArgs(args: HttpSubmitArgs) {
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
