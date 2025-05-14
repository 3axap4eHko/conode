# CoNode

0-deps async context management for Node.js

[![Build Status][github-image]][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Coverage Status][codecov-image]][codecov-url]

## Table of Contents

  - [Features](#features)
  - [Installing](#installing)
  - [Examples](#examples)
  - [License](#license)

## Features

- Zero dependencies  
- Lightweight wrappers around [AsyncLocalStorage](https://nodejs.org/api/async_hooks.html)  
- Full TypeScript support  
- Works in CommonJS and ES Module environments  

## Installing

Using yarn:

```bash
yarn add conode
```

Using npm:

```bash
yarn add conode
```

## Examples

Quick start
```typescript
import { createContext } from 'conode';

interface RequestContext { userId: string }

const reqCtx = createContext<RequestContext>();

async function handleRequest() {
  console.log(reqCtx.getContext()?.userId);
}

await reqCtx.contextualize({ userId: 'abc123' }, handleRequest);
// Logs: 'abc123'
```

Functional approach
```typescript
import { createContext } from '../index';
const auth = createContext();

const action = () => {
  const jwt = auth.getContext();
  console.log(jwt);
};

auth.contextualize(jwt, action);
```

Class approach with decorator
```typescript
import { contextualize, Contextable } from '../index';

const action = () => {
  const service = Service.getContext();
  console.log(service.getSomething());
};

class Service extends Contextable() {
  @contextualize
  async run() {
    await action();
  }
  getSomething() {
    return 'something';
  }
}

const service = new Service();

service.run();
```

## License

License [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
Copyright (c) 2022-present Ivan Zakharchanka

[npm-url]: https://www.npmjs.com/package/conode
[downloads-image]: https://img.shields.io/npm/dw/conode.svg?maxAge=43200
[npm-image]: https://img.shields.io/npm/v/conode.svg?maxAge=43200
[github-url]: https://github.com/3axap4eHko/conode/actions/workflows/build.yml
[github-image]: https://github.com/3axap4eHko/conode/actions/workflows/build.yml/badge.svg
[codecov-url]: https://codecov.io/gh/3axap4eHko/conode
[codecov-image]: https://codecov.io/gh/3axap4eHko/conode/branch/master/graph/badge.svg?token=JZ8QCGH6PI

