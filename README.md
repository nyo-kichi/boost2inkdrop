# boost2inkdrop

Migrate from Boostnote(old) to Inkdrop

## How to use

Before you migrate to Inkdrop, you must install and build on your machine.

At first, fetch this repository from github.

Install dependence modules to `node_modules`.

```sh
$ npm install
```

Build boost2inkdrop to `.build` directory.

```sh
$ npm run build
```

Create [`init.js`](https://docs.inkdrop.app/manual/the-init-file), the following code:

```js:init.js
const path = require('path');
const ope = require('/path/to/boost2inkdrop/.build/src/operations');

const BOOST_DIR = path.resolve('/path/to/Boostnote/dir');

async function main() {
    await ope.migrate({
        boostDir: BOOST_DIR,
        storage: 'my-storage',
    });
}
main();
```
