import { AxiosInstance } from 'axios';
import { LoggerInterface } from '../../../../common/LoggerInterface';

export function httpLoggerInterceptor(agent: AxiosInstance, logger: LoggerInterface) {
  agent.interceptors.response.use(
    response => {
      const { url, method } = response.config;

      const message = `[Http] ${method.toUpperCase()} ${url} ${response.status} ${response.statusText}`;

      logger.info(message);

      return response;
    },
    error => {
      const { url, method } = error.config;

      const message = `[Http] ${method.toUpperCase()} ${url} ${error.response.status} ${error.response.statusText}`;

      logger.error(message);

      throw error;
    },
  );
}
