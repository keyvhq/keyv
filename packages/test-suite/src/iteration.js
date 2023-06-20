'use strict'

const { setTimeout } = require('timers/promises')

const keyvIteratorTests = (test, Keyv, store) => {
  test.beforeEach(async () => {
    const keyv = new Keyv({ store: store() })
    await keyv.clear()
  })

  test.serial('.iterator() returns an asyncIterator', t => {
    const keyv = new Keyv({ store: store() })
    t.true(typeof keyv.iterator()[Symbol.asyncIterator] === 'function')
  })

  test.serial('iterator() iterates over all values', async t => {
    const keyv = new Keyv({ store: store() })
    const map = new Map(
      Array.from({ length: 5 })
        .fill(0)
        .map((x, i) => [String(i), String(i + 10)])
    )
    const toResolve = []
    for (const [key, value] of map) {
      toResolve.push(keyv.set(key, value))
    }

    await Promise.all(toResolve)
    t.plan(map.size)
    for await (const [key, value] of keyv.iterator()) {
      const doesKeyExist = map.has(key)
      const isValueSame = map.get(key) === value
      t.true(doesKeyExist && isValueSame)
    }
  })

  test.serial(
    "iterator() doesn't yield values from other namespaces",
    async t => {
      const KeyvStore = store()

      const keyv1 = new Keyv({ store: KeyvStore, namespace: 'keyv1' })
      const map1 = new Map(
        Array.from({ length: 5 })
          .fill(0)
          .map((x, i) => [String(i), String(i + 10)])
      )
      const toResolve = []
      for (const [key, value] of map1) {
        toResolve.push(keyv1.set(key, value))
      }

      await Promise.all(toResolve)

      const keyv2 = new Keyv({ store: KeyvStore, namespace: 'keyv2' })
      const map2 = new Map(
        Array.from({ length: 5 })
          .fill(0)
          .map((x, i) => [String(i), String(i + 11)])
      )
      toResolve.length = 0
      for (const [key, value] of map2) {
        toResolve.push(keyv2.set(key, value))
      }

      await Promise.all(toResolve)

      t.plan(map2.size)
      for await (const [key, value] of keyv2.iterator()) {
        const doesKeyExist = map2.has(key)
        const isValueSame = map2.get(key) === value
        t.true(doesKeyExist && isValueSame)
      }
    }
  )

  test.serial(
    "iterator() doesn't yield expired values, and deletes them",
    async t => {
      const keyv = new Keyv({ store: store() })
      const map = new Map(
        Array.from({ length: 5 })
          .fill(0)
          .map((x, i) => [String(i), String(i + 10)])
      )
      const toResolve = []
      for (const [key, value] of map) {
        toResolve.push(keyv.set(key, value, 200))
      }

      await Promise.all(toResolve)
      await setTimeout(250)
      for await (const entry of keyv.iterator()) {
        t.fail('Found an expired value' + entry)
      }
      t.pass()
    }
  )
}

module.exports = keyvIteratorTests
