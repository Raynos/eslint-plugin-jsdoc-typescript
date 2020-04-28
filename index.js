const requireClassField = require('./rules/require-class-field')

module.exports = {
  rules: {
    'require-class-field': requireClassField
  },
  rulesConfig: {
    'require-class-field': 2
  }
}
