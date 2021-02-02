import { makeUri } from '../src/makeUri';
import { MakeUriError } from '../src/MakeUriError';

const
  scheme = 'http',
  host = 'my.happy.world',
  port = 3222,
  user = 'sepo';

describe('makeUri()', () => {
  it('with scheme & str authority', () => {
    expect(makeUri({ scheme, authority: host })).toEqual('http://my.happy.world');
  });

  it('with scheme & str authority: host & port', () => {
    expect(makeUri({ scheme, authority: `${host}:${port}` })).toEqual('http://my.happy.world:3222');
  });

  it('with scheme & str authority: host & port & user', () => {
    expect(makeUri({
      scheme,
      authority: `${user}@${host}:${port}`,
    })).toEqual('http://sepo@my.happy.world:3222');
  });

  it('sanitizes slag scheme', () => {
    expect(makeUri({ scheme: 'https:', authority: host })).toEqual('https://my.happy.world');
  });

  it('sanitizes slag scheme #2', () => {
    expect(makeUri({ scheme: 'ftp://', authority: host })).toEqual('ftp://my.happy.world');
  });

  it('with scheme & obj authority host', () => {
    expect(makeUri({ scheme, authority: { host } })).toEqual('http://my.happy.world');
  });

  it('with scheme & obj authority: host & port', () => {
    expect(makeUri({ scheme, authority: { host, port } })).toEqual('http://my.happy.world:3222');
  });

  it('with scheme & obj authority: host & port & user', () => {
    expect(makeUri({
      scheme,
      authority: { host, port, user },
    })).toEqual('http://sepo@my.happy.world:3222');
  });

  it('errors out authority-less scheme', () => {
    expect(() => makeUri({
      scheme: 'http',
    })).toThrow(new MakeUriError('Missing authority for scheme.'));
  });
});
