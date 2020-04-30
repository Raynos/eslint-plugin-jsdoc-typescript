# eslint-plugin-jsdoc-typescript

This plugin adds new `jsdoc` rules specifically for using
typescript with `checkJs` & jsdoc comments.

## Rule: `require-class-field`

This enforces that your classes have class field declaration.
This syntax only works in node 12 & later.

## Rule: `require-constructor-property`

This rule enforces that all properties assigned to `this` in
the `constructor` of a class have a jsdoc `@type` annotation.

e.g.

```js
class Test {
  constructor () {
    /** @type {number} */
    this.a = 1
    /** @type {string} */
    this.b = 2
    /** @type {boolean} */
    this.c = 3
  }
}
```

This is useful for the same reason being explicit with your
function return types is useful. You don't want to rely too
much on type inference as it.

Being explicit makes refactoring and changes easier to review
as you know what it was before and what it will be.
