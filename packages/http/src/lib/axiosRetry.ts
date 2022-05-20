import axiosRetryLib, { IAxiosRetryConfig } from 'axios-retry';
import { AxiosInstance, AxiosStatic } from 'axios';

// Wrapper for the tests

export const axiosRetry = (axios: AxiosStatic | AxiosInstance, params: IAxiosRetryConfig = {}) =>
  axiosRetryLib(axios, params);
