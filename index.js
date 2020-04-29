const requireClassField = require('./rules/require-class-field')
const requireConstructorProperty = require('./rules/require-constructor-property')

module.exports = {
  rules: {
    'require-class-field': requireClassField,
    'require-constructor-property': requireConstructorProperty
  },
  rulesConfig: {
    'require-class-field': 2,
    'require-constructor-property': 2
  }
}
