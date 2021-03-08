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

Login with public scope:
```bash
npm login --scope @libj
```

First, publish with public access manually:
```bash
cd packages/<name>
npm publish --access public
```

Then further publishes:

```bash
npm run publish
```
