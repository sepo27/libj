## Overview

A "test bench" tools set for testing JavaScript / TypeScript code with comfort.
Based on [sinon.js](https://sinonjs.org/) library.
All mocks are [sinon stubs](https://sinonjs.org/releases/v9.2.4/stubs/).

## Mocks

### `ModuleMock`

Provides a way to mock any JavaScript module.

#### NPM module

```javascript
import * as fs from 'fs'

const mock = ModuleMock('fs')
mock.existsSync.withArgs('/foo/bar.json').returns(true)

fs.existsSync('/foo/bar.json') // => true
```

#### Custom module

```javascript
// myFoo.js
export const myFoo = () => 'foo'

// main.js
import * as MyFooModule from './myFoo.js'
import { myFoo } from './myFoo.js'

const mock = ModuleMock(MyFooModule)
mock.myFoo.returns('The Foo')

myFoo() // => 'The Foo'
```
