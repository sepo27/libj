import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoggerInterface } from '../../../../common/LoggerInterface';

export function httpLoggerInterceptor(agent: AxiosInstance, logger: LoggerInterface) {
  agent.interceptors.response.use(
    response => {
      const message = `[http] ${makeEndpoint(response.config)} ${response.status} ${response.statusText}`;

      logger.info(message);

      return response;
    },
    error => {
      const suffix = error.response
        ? `${error.response.status} ${error.response.statusText}`
        : error.toString();

      const message = `[http] ${makeEndpoint(error.config)} ${suffix}`;

      logger.error(message);

      throw error;
    },
  );
}

/*** Lib ***/

function makeEndpoint({ method, baseURL, url }: AxiosRequestConfig): string {
  const uri = baseURL ? `${baseURL}${url}` : url;
  return `${method.toUpperCase()} ${uri}`;
}
