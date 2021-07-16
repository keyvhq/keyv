# @keyv/test-suite [<img width="100" align="right" src="https://ghcdn.rawgit.org/microlinkhq/keyv/master/media/logo-sunset.svg" alt="keyv">](https://github.com/microlinkhq/keyv)

Complete [AVA](https://github.com/avajs/ava) test suite to test a [Keyv](https://github.com/microlinkhq/keyv) storage adapter for API compliance.

## Usage

### Install

Install AVA, Keyv and `@keyv/test-suite` as development dependencies.

```shell
npm install --save-dev ava keyv @keyv/test-suite
```

Then update `keyv` and `@keyv/test-suite` versions to `*` in `package.json` to ensure you're always testing against the latest version.

### Create Test File

`test.js`

```js
import test from 'ava'
import keyvTestSuite from '@keyv/test-suite'
import Keyv from 'keyv'
import KeyvStore from './'

const store = () => new KeyvStore()
keyvTestSuite(test, Keyv, store)
```

Where `KeyvStore` is your storage adapter.

Set your test script in `package.json` to `ava`.
```json
"scripts": {
  "test": "ava"
}
```

### Test on Active Node.js LTS and Higher

An example configuration for Travis CI would look like this:

`.travis.yml`

```yaml
language: node_js
node_js:
  - '8'
  - '6'
  - '4'
script: npm test
```

## Example

Take a look at [redis](https://github.com/microlinkhq/redis) for an example of an existing storage adapter using `@keyv/test-suite`.

## License

**@keyvhq/test-suite** © [Microlink](https://microlink.io), Released under the [MIT](https://github.com/microlinkhq/keyv/blob/master/LICENSE.md) License.<br/>
Authored and maintained by [Microlink](https://microlink.io) with help from [contributors](https://github.com/microlinkhq/keyv/contributors).

> [microlink.io](https://microlink.io) · GitHub [@MicrolinkHQ](https://github.com/microlinkhq) · Twitter [@microlinkhq](https://twitter.com/microlinkhq)
