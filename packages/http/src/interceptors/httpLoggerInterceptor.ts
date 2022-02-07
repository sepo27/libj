import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  HttpClientLoggerSetting,
  HttpClientLoggerSettingOptions,
  HttpClientLoggerSettingRequestDataLogMapper,
} from '../client/types';
import { LoggerInterface } from '../../../logger/src';
import { isBool } from '../../../../common/isType/isType';

export function httpLoggerInterceptor(agent: AxiosInstance, loggerSetting: HttpClientLoggerSetting) {
  const { logger, options: loggerOptions } = parseLoggerSetting(loggerSetting);

  agent.interceptors.response.use(
    response => {
      // @ts-ignore
      const message = `[http] ${makeEndpoint(response.config)} ${response.status} ${response.statusText}`;

      logger.info(message);

      return response;
    },
    error => {
      const suffix = error.response
        ? `${error.response.status} ${error.response.statusText}`
        : error.toString();

      const message = `[http] ${makeEndpoint(error.config, loggerOptions)} ${suffix}`;

      logger.error(message);

      throw error;
    },
  );
}

/*** Lib ***/

function parseLoggerSetting(
  logger: HttpClientLoggerSetting,
): { logger: LoggerInterface, options: HttpClientLoggerSettingOptions } {
  return ('options' in logger) ? logger : { logger, options: {} };
}

function makeEndpoint(
  { method, baseURL, url, data }: AxiosRequestConfig,
  loggerOptions?: HttpClientLoggerSettingOptions,
): string {
  const
    uri = baseURL ? `${baseURL}${url}` : url,
    parts = [method.toUpperCase(), uri];

  if (loggerOptions?.requestDataLog) {
    const finalData = isBool(loggerOptions.requestDataLog)
      ? data
      : (loggerOptions.requestDataLog as HttpClientLoggerSettingRequestDataLogMapper)(data);

    parts.push(JSON.stringify(finalData));
  }

  return parts.join(' ');
}
