import { NextFunction, Request, Response } from 'express';
import { isIpInRange } from './isIpInRange';
import { HttpStatus } from '../../httpMeta/src';
import { LooseObject } from '../../../common/types';
import { LoggerInterface } from '../../logger/src';
import { WILDCARD_IP } from './constants';

interface Config {
  whitelist: string[],
  blacklist: string[],
  ipGetter?: (req: Request) => string,
  response?: {
    statusCode?: HttpStatus,
    body: string | number | LooseObject,
  },
  logger?: LoggerInterface,
}

export const makeIpFilterMiddleware = (config: Config) => (req: Request, res: Response, next: NextFunction) => { // eslint-disable-line consistent-return
  const
    { response } = validateConfig(config),
    ip = defineIp(req, config);

  if (ip) {
    const isAllowed = isIpAllowed(ip, config);

    if (isAllowed) {
      return next();
    }
  }

  const
    statusCode = response?.statusCode || HttpStatus.FORBIDDEN,
    body = response?.body;

  logError(ip, config);

  res.status(statusCode);

  if (body) {
    res.send(body);
  } else {
    res.send();
  }
};

/*** Lib ***/

function defineIp(req: Request, config: Config): string | null {
  const { ipGetter } = config;

  if (ipGetter) {
    return ipGetter(req);
  }

  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
}

function isIpAllowed(ip: string, config: Config): boolean {
  const { whitelist, blacklist } = config;

  if (whitelist) {
    return whitelist.indexOf(WILDCARD_IP) > -1 ? true : isIpInRange(ip, whitelist);
  }

  return !isIpInRange(ip, blacklist);
}

function validateConfig(config: Config): Config {
  if (!config.whitelist && !config.blacklist) {
    throw new Error('Missing whitelist or blacklist');
  } else if (config.whitelist && config.blacklist) {
    throw new Error('One of whitelist OR blacklist is supported in config');
  }
  return config;
}

function logError(ip: string | null, config: Config) {
  const { whitelist, blacklist, logger } = config;

  if (logger) {
    let errorArgs;

    if (ip) {
      const [listLabel, listValue] = whitelist ? ['whitelist', whitelist] : ['blacklist', blacklist];
      errorArgs = [
        `Access denied to IP address '%s' according to ${listLabel} '%j'`,
        ip,
        listValue,
      ];
    } else {
      errorArgs = ['Access denied due to IP could not be defined'];
    }

    // @ts-ignore
    logger.error(...errorArgs);
  }
}
