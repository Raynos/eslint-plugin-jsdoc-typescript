'use strict'

const rule = require('../rules/require-class-field.js')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 2018 }
})
ruleTester.run('require-class-field', rule, {
  valid: [
    `class Foo {
      foo;
      constructor () {
        this.foo = 42
      }
    }`,
    `const Foo = class {
      foo;
      constructor () {
        this.foo = 42
      }
    }`
  ],
  invalid: [
    {
      code: `class Foo {
        constructor () {
          this.foo = 42
        }
      }`,
      errors: [{
        message: 'Class Foo is missing property declaration for foo',
        type: 'ClassDeclaration'
      }]
    },
    {
      code: `const Foo = class {
        constructor () {
          this.foo = 42
        }
      }`,
      errors: [{
        message: 'Class <anon> is missing property declaration for foo',
        type: 'ClassExpression'
      }]
    }
  ]
})

/* eslint no-console: 0 */
console.log('ok')
