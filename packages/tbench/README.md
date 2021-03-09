## Overview

A "test bench" tools set for testing JavaScript / TypeScript code with comfort.  
Based on [sinon.js](https://sinonjs.org/) library.  
All mocks are [sinon stubs](https://sinonjs.org/releases/v9.2.4/stubs/).

### Features
- convenient API
- unit test itself

## Mocks

### `ModuleMock`

Mocks any JavaScript module.

#### API

````javascript
function ModuleMock(
  module: string | Object,
  sinon: SinonSandbox = sinon.createSandbox(),
)
````

- `module`: npm module name or custom module
- `sinon`: custom instance of `SinonSandbox`

#### NPM module

```javascript
import * as fs from 'fs'
import { ModuleMock } from '@libj/tbench'

const mock = ModuleMock('fs')
mock.existsSync.withArgs('/foo/bar.json').returns(true)

fs.existsSync('/foo/bar.json') // => true
```

#### Custom module

```javascript
// myFoo.js
export const myFoo = () => 'foo'
```

```javascript
// myBar.js
import { myFoo } from './myFoo.js'

export const myBar = () => myFoo()
```

```javascript
// myBar.test.js
import { ModuleMock } from '@libj/tbench'
import * as MyFooModule from './myFoo.js'
import { myBar } from './myBar.js'

describe('myBar()', () => {
  it('calls myFoo()', () => {
    const mock = ModuleMock(MyFooModule).myFoo
    mock.returns('The Foooo')

    expect(myBar()).toBe('The Foooo')
  })
})
```

#### More examples

See in [specs](https://github.com/sepo27/libj/tree/master/packages/tbench/src/mock/module).

### `ClassMock`

Mocks instances of classes.

#### API

```javascript
function ClassMock(module: Object)
function ClassMock(module: Object, spec: Object)
function ClassMock(module: Object, spec: Object, sinon: SinonSandbox)
function ClassMock(module: Object, sinon: SinonSandbox)
```

- `module`: Custom module which holds class export
- `spec`: Specification object on how to mock the instance of class
- `sinon`: custom instance of `SinonSandbox`

#### Asserting constructor call

```javascript
// MyFooClass.js
export class MyFooClass {}
```

```javascript
// myBar.js
import { MyFooClass } from './MyFooClass'

export const myBar = arg => new MyFooClass(arg)
```

```javascript
// myBar.test.js
import { ClassMock } from '@libj/tbench'
import * as MyFooClassModule from './MyFooClass'
import { myBar } from './myBar'

describe('myBar()', () => {
  it('constructs class with arg', () => {
    const mock = ClassMock(MyFooClassModule)

    myBar('Foxy Lady')

    expect(mock.$constructor.calledOnce).toBeTruthy()
    expect(mock.$constructor.getCall(0).args).toEqual(['Foxy Lady'])
  })
})
```

*(!) CAUTION: This will not differentiate if class has been called with or without `new` !*

#### Mock class instance properties

```javascript
// MyFooClass.js
export class MyFooClass {
  constructor() {
    this.foo = 'Initial Foo'
    this.bar = 'Initial Bar'
  }
}
```

```javascript
// myBar.js
import { MyFooClass } from './MyFooClass'

export const myBar = () => new MyFooClass()
```

```javascript
// myBar.test.js
import { ClassMock } from '@libj/tbench'
import * as MyFooClassModule from './MyFooClass'
import { myBar } from './myBar'

describe('myBar()', () => {
  it('proxies class instance properties', () => {
    const mock = ClassMock(MyFooClassModule, {
      foo: 'The Foo',
      bar: null,
    })
    mock.foo
    mock.bar.value('At the Bar')

    const res = myBar()

    expect(res.foo).toBe('The Foo')
    expect(res.bar).toBe('At the Bar')
  })
})
```

*(i) Mind how mock values are initialized for `foo` and `bar` props*  
*(i) Mock property has to be accessed even if initialized to trigger mocking*  
*(i) It is always possible to overwrite initialized values at any time with any conditions (see [sinon stubs](https://sinonjs.org/releases/v9.2.4/stubs/))*  
*(i) See respective [specs](https://github.com/sepo27/libj/tree/master/packages/tbench/src/mock/class) for more examples*

#### Mock class instance methods

```javascript
// MyFooClass.js
export class MyFooClass {
  foo() {}
  bar() {}
}
```

```javascript
// myBar.js
import { MyFooClass } from './MyFooClass'

export const myBar = () => new MyFooClass()
```

```javascript
// myBar.test.js
import { ClassMock } from '@libj/tbench'
import * as MyFooClassModule from './MyFooClass'
import { myBar } from './myBar'

describe('myBar()', () => {
  it('proxies class instance methods', () => {
    const mock = ClassMock(MyFooClassModule, {
      'foo()': null,
      'bar()': 'The Bar from Method',
    })
    mock.foo.returns('And The Foo')
    mock.bar

    const o = myBar()

    expect(o.foo()).toBe('And The Foo')
    expect(o.bar()).toBe('The Bar from Method')
  })
})
```

*(i) Method mocks are denoted using parenthesis*  
*(i) Mind how mock values are initialized for `foo()` and `bar()` methods*  
*(i) It is always possible to overwrite initialized values at any time with any constraints*  
*(i) See respective [specs](https://github.com/sepo27/libj/tree/master/packages/tbench/src/mock/class) for more examples*

#### Restoring single mock only

```javascript
// test.js
import { ClassMock } from '@libj/tbench'

describe('FooTest', () => {
  let mock

  beforeEach(() => {
    mock = ClassMock(FooClassModule)
  })

  afterEach(() => {
    mock.$restore()
  })
});
```

*(i) Applies to both `ModuleMock` / `ClassMock`*

### Restoring all mocks at once

This can be controlled via custom sinon instance

```javascript
// test.js
import * as sinonLib from 'sinon'
import { ModuleMock, ClassMock } from '@libj/tbench'

describe('FooTest', () => {
  let sinon, moduleMock, classMock

  beforeEach(() => {
    sinon = sinonLib.createSandbox()
    moduleMock = ModuleMock('fs', sinon)
    classMock = ClassMock(FooClassModule, sinon)
  })

  afterEach(() => {
    sinon.restore()
  })
});

```

### Using in pure NodeJS code

In order for mocks to be working in raw nodejs code imports should be done using module as whole.

```javascript
// foo.js
const foo = () => {}

module.exports = { foo }
```

```javascript
// bar.js
const FooModule = require('./foo.js')

const bar = () => FooModule.foo()

module.exports = { bar }
```

*(i) Notice how import is done in `bar.js`*  
*(i) This is applied to both `ModuleMock` and `ClassMock`*
