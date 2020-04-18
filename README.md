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
const { migrate } = require('/path/to/boost2inkdrop/.build/src');

const BOOST_DIR = path.join(process.env.HOME, '/path/to/Boostnote/dir');

async function main() {
    await migrate({
        boostDir: BOOST_DIR,
        storage: 'my-storage',
    });
}
main();
```

Try launching Inkdrop.  
Notes is migrated from Boostnote to Inkdrop as "migration.xxx" notebook.

![screenshot](https://raw.githubusercontent.com/nyo-kichi/boost2inkdrop/master/docs/inkdrop-migration.png)

## Notice

If "migration.xxx" notebook doesn't exist in your Inkdrop sidebar, try adding new Notebooks (e.g. foo).  
"migration.xxx" notebook apear in sidebar.
