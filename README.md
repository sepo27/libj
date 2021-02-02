## Rationale

A utility function to build a valid URI.

### Features
- [RFC-3986](https://tools.ietf.org/html/rfc3986) compliant
- clean API
- base uri support
- validation
- battery of unit tests applied

## `makeUri()` API

### Parameters

Name | Type | Example
-----|------|--------
scheme | `string` | ``` makeUri({ scheme: 'http:' }) ```
authority | `string` | ``` makeUri({ authority: 'user@some.host:333' }) ```
authority | `{host: string, user?: string, port?: number }` | ``` makeUri({ authority: { host: 'some.com', user: 'user', port: 333 } }) ```
path | `string` | ``` makeUri({ path: '/foo/bar' }) ```
path | `{ template: string, params: Object }` | ``` makeUri({ path: { template: '/foo/:bar', params: { bar: 'my-bar' } } }) ```
path | `string[]` | ``` makeUri({ path: ['foo', 'bar'] }) ``` => `/foo/bar`
query | `Object` | ``` makeUri({ query: { foo: 'bar' } }) ``` => `foo=bar`
query | `{ $data: Object, $options: { encode: boolean } }` | ``` makeUri({ query: { $data: { foo: 'bar' }, $options: { encode: true } } }) ```
query | `{ $data: Object, $options: { encode: { include: string[] } } }` | ``` makeUri({ query: { $data: { foo: 'bar' }, $options: { encode: { include: ['foo'] } } } }) ```
query | `{ $data: Object, $options: { encode: { exclude: string[] } } }` | ``` makeUri({ query: { $data: { foo: 'bar' }, $options: { exclude: { include: ['foo'] } } } }) ```
fragment | `Object` | ``` makeUri({ path: '/foo', fragment: { foxy: 'lady' } }) ``` => `/foo#foxy=lady`
fragment | See query `$data` with `$options` above |

### Base uri

Basic usage
```javascript
  makeUri('http://some.host/path', { query: { foo: 'bar' } })
  // => http://some.host/path?foo=bar
```

Append path
```javascript
  makeUri('https://host.com/foo', { path: '/bar' })
  // => https://host.com/foo/bar
```

## Developing

### WebStorm IDE Setup

To suppress logs in tests add the following env variable to jest run template:
```bash
LIBJ_SKIP_TEST_LOG=1
```

### Versioning

```bash
npm run version
```

### Publishing

```bash
npm run publish
```
