'use strict'

const classFieldRule = require('../rules/require-class-field.js')
const constructorPropRule = require('../rules/require-constructor-property.js')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 2018 }
})
ruleTester.run('require-class-field', classFieldRule, {
  valid: [
    `class Foo {
      foo;
      constructor () {
        this.foo = 42
      }
    }`,
    `class Foo {
      constructor()
    }`,
    `class Test {
      a;
      b;
      c;
      constructor () {
        this.a = 1
        this.b = 2
        this.c = 3
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

ruleTester.run('require-constructor-property', constructorPropRule, {
  valid: [
    `class Foo {
      constructor () {
        /** @type {number} */
        this.foo = 42
      }
    }`,
    `class Foo {
      constructor()
    }`,
    `class Test {
      constructor () {
        /** @type {number} */
        this.a = 1
        /** @type {string} */
        this.b = 2
        /** @type {boolean} */
        this.c = 3
      }
    }`,
    `const Foo = class {
      constructor () {
        /** @type {number} */
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
        message: 'Class Foo is missing jsdoc for this.foo = ',
        type: 'MethodDefinition'
      }]
    },
    {
      code: `class Foo {
        constructor () {
          /** @private */
          this.foo = 42
        }
      }`,
      errors: [{
        message: 'Class Foo is missing type declaration for this.foo = ',
        type: 'MethodDefinition'
      }]
    },
    {
      code: `class Foo {
        constructor () {
          /***/
          this.foo = 42
        }
      }`,
      errors: [{
        message: 'Class Foo is has invalid jsdoc for this.foo = ',
        type: 'MethodDefinition'
      }]
    },
    {
      code: `class Foo {
        constructor () {
          /** @type */
          this.foo = 42
        }
      }`,
      errors: [{
        message: 'Class Foo has empty type declaration for this.foo = ',
        type: 'MethodDefinition'
      }]
    },
    {
      code: `const Foo = class {
        constructor () {
          this.foo = 42
        }
      }`,
      errors: [{
        message: 'Class <anon> is missing jsdoc for this.foo = ',
        type: 'MethodDefinition'
      }]
    }
  ]
})

/* eslint no-console: 0 */
console.log('ok')
