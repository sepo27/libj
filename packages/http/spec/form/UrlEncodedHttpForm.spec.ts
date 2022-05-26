import * as sinonLib from 'sinon';
import { makeUri } from '../../../makeUri/src/makeUri';
import { UrlEncodedHttpForm } from '../../src/form/UrlEncodedHttpForm';

describe('UrlEncodedHttpForm', () => {
  let sinon: sinonLib.SinonSandbox;

  beforeEach(() => {
    sinon = sinonLib.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('toBody() returns url encoded data', () => {
    const
      data = { foo: 'bar', baz: 'xyz abc' },
      form = new UrlEncodedHttpForm(data);

    expect(form.toBody()).toEqual(makeUri({ query: { $data: data, $options: { encode: true } } }));
  });

  it('getHeaders() returns respective content type header', () => {
    expect(new UrlEncodedHttpForm({}).getHeaders()).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  });
});
