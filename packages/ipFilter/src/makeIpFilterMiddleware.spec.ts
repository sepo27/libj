import * as sinonLib from 'sinon';
import * as IsAllowedIpModule from './isIpInRange';
import { makeIpFilterMiddleware } from './makeIpFilterMiddleware';
import { HttpStatus } from '../../httpMeta/src';
import { LoggerInterface } from '../../logger/src';
import { ModuleMock } from '../../tbench/src';
import { WILDCARD_IP } from './constants';

describe('makeIpFilterMiddleware()', () => {
  let sinon, mock;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
    mock = {
      req: {
        headers: {},
        socket: {},
      },
      res: makeResMock(),
      next: sinonLib.spy(),
      isIpInRange: sinon.stub(IsAllowedIpModule, 'isIpInRange'),
      logger: ModuleMock(new DummyLogger(), sinon),
    };
  });

  afterEach(() => {
    sinon.restore();
    mock = null;
  });

  it('allows whitelisted ip', () => {
    const
      ip = '1.2.3.4',
      whitelist = ['1.2.3.4'];

    mock.isIpInRange.returns(true);
    mock.req.headers['x-forwarded-for'] = ip;

    callMiddleware({ whitelist });

    expect(mock.isIpInRange.calledOnce).toBeTruthy();
    expect(mock.isIpInRange.getCall(0).args).toEqual([ip, whitelist]);
    expect(mock.next.calledOnce).toBeTruthy();
  });

  it('rejects non-whitelisted ip', () => {
    mock.isIpInRange.returns(false);
    mock.req.headers['x-forwarded-for'] = '3.3.3.3';

    callMiddleware({ whitelist: [] });

    assertReject();
  });

  it('allows whitelisted ip through wildcard', () => {
    const
      ip = '1.2.3.4',
      whitelist = [WILDCARD_IP];

    mock.req.headers['x-forwarded-for'] = ip;

    callMiddleware({ whitelist });

    expect(mock.isIpInRange.notCalled).toBeTruthy();
    expect(mock.next.calledOnce).toBeTruthy();
  });

  it('allows non-blacklisted ip', () => {
    const
      ip = '1.2.3.4',
      blacklist = ['8.8.8.8'];

    mock.isIpInRange.returns(false);
    mock.req.headers['x-forwarded-for'] = ip;

    callMiddleware({ blacklist });

    expect(mock.isIpInRange.calledOnce).toBeTruthy();
    expect(mock.isIpInRange.getCall(0).args).toEqual([ip, blacklist]);
    expect(mock.next.calledOnce).toBeTruthy();
  });

  it('rejects blacklisted ip', () => {
    mock.isIpInRange.returns(true);
    mock.req.headers['x-forwarded-for'] = '2.2.2.2';

    callMiddleware({ blacklist: ['2.2.2.2'] });

    assertReject();
  });

  it('falls back to request socket IP when identifying an IP', () => {
    const ip = '4.3.2.1';

    mock.req.socket.remoteAddress = ip;

    callMiddleware({ whitelist: [] });

    expect(mock.isIpInRange.calledOnce).toBeTruthy();
    expect(mock.isIpInRange.getCall(0).args[0]).toEqual(ip);
  });

  it('ables to configure custom ip getter', () => {
    const ip = '3.4.5.6';

    mock.req.headers['custom-ip-field'] = ip;

    callMiddleware({
      whitelist: [],
      ipGetter: req => req.headers['custom-ip-field'],
    });

    expect(mock.isIpInRange.calledOnce).toBeTruthy();
    expect(mock.isIpInRange.getCall(0).args[0]).toEqual(ip);
  });

  it('rejects by default for whitelist if IP cannot be defined', () => {
    callMiddleware({ whitelist: [] });
    assertReject();
  });

  it('rejects by default for blacklist if IP cannot be defined', () => {
    callMiddleware({ blacklist: [] });
    assertReject();
  });

  it('ables to configure response status code', () => {
    mock.isIpInRange.returns(false);
    callMiddleware({ whitelist: [], response: { statusCode: HttpStatus.UNAUTHORIZED } });

    assertReject({ status: HttpStatus.UNAUTHORIZED });
  });

  it('ables to configure response body message', () => {
    const resBody = { foo: 'bar' };

    mock.isIpInRange.returns(false);
    callMiddleware({ whitelist: [], response: { body: resBody } });

    assertReject({ body: resBody });
  });

  it('logs error with whitelist', () => {
    const
      ip = '1.1.2.2',
      whitelist = ['3.3.3.3'];

    mock.req.headers['x-forwarded-for'] = ip;
    mock.isIpInRange.returns(false);

    callMiddleware({ whitelist, logger: mock.logger });

    expect(mock.logger.error.calledOnce).toBeTruthy();
    expect(mock.logger.error.getCall(0).args).toEqual([
      "Access denied to IP address '%s' according to whitelist '%j'",
      ip,
      whitelist,
    ]);
  });

  it('logs error with blacklist', () => {
    const
      ip = '1.1.2.2',
      blacklist = ['1.1.2.2'];

    mock.req.headers['x-forwarded-for'] = ip;
    mock.isIpInRange.returns(true);

    callMiddleware({ blacklist, logger: mock.logger });

    expect(mock.logger.error.calledOnce).toBeTruthy();
    expect(mock.logger.error.getCall(0).args).toEqual([
      "Access denied to IP address '%s' according to blacklist '%j'",
      ip,
      blacklist,
    ]);
  });

  it('logs error when ip is not defined', () => {
    mock.isIpInRange.returns(false);

    callMiddleware({ whitelist: [], logger: mock.logger });

    expect(mock.logger.error.calledOnce).toBeTruthy();
    expect(mock.logger.error.getCall(0).args).toEqual([
      'Access denied due to IP could not be defined',
    ]);
  });

  it('errors out when no whitelist neither blacklist is configured', () => {
    expect(() => callMiddleware()).toThrowError(new Error('Missing whitelist or blacklist'));
  });

  it('errors out when both whitelist and blacklist are configured', () => {
    expect(() => callMiddleware({ whitelist: [], blacklist: [] }))
      .toThrowError(new Error('One of whitelist OR blacklist is supported in config'));
  });

  /*** Lib ***/

  function makeResMock() {
    const res: any = {};
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    return res;
  }

  function callMiddleware(config: any = {}) {
    makeIpFilterMiddleware(config)(mock.req, mock.res, mock.next);
  }

  function assertReject({ status = HttpStatus.FORBIDDEN, body = null } = {}) {
    expect(mock.next.called).toBeFalsy();
    expect(mock.res.status.calledOnce).toBeTruthy();
    expect(mock.res.status.getCall(0).args).toEqual([status]);
    expect(mock.res.send.calledOnce).toBeTruthy();

    const expectedSendArgs = body ? [body] : [];

    expect(mock.res.send.getCall(0).args).toEqual(expectedSendArgs);
  }
});

class DummyLogger implements LoggerInterface {
  debug() {}
  error() {}
  info() {}
  log() {}
  warn() {}
}
