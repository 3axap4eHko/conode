# CoNode

0-Deps, simple and fast context library for NodeJS

[![Build Status][github-image]][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Coverage Status][codecov-image]][codecov-url]
[![Maintainability][codeclimate-image]][codeclimate-url]
[![Snyk][snyk-image]][snyk-url]

## Table of Contents

  - [Features](#features)
  - [Installing](#installing)
  - [Examples](#examples)
  - [License](#license)

## Features

- Provides useful wrappers of [AsyncLocalStorage](https://nodejs.org/api/async_context.html)
- Supports TypeScript typings
- Supports CommonJS and ES Module systems

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

Class approach
```typescript
import { contextualize, Context } from '../index';

const action = () => {
  const service = Service.getContext();
  console.log(service.getSomething());
};

class Service extends Context() {
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
[github-url]: https://github.com/3axap4eHko/conode/actions/workflows/cicd.yml
[github-image]: https://github.com/3axap4eHko/conode/actions/workflows/cicd.yml/badge.svg
[codecov-url]: https://codecov.io/gh/3axap4eHko/conode
[codecov-image]: https://codecov.io/gh/3axap4eHko/conode/branch/master/graph/badge.svg?token=JZ8QCGH6PI
[codeclimate-url]: https://codeclimate.com/github/3axap4eHko/conode/maintainability
[codeclimate-image]: https://api.codeclimate.com/v1/badges/0ba20f27f6db2b0fec8c/maintainability
[snyk-url]: https://snyk.io/test/npm/conode/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/3axap4eHko/conode.svg?maxAge=43200

