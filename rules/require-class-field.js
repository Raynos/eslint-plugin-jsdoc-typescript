'use strict'

module.exports = {
  create: function (context) {
    return {
      ClassDeclaration: function (node) {
        checkClass(node)
      },
      ClassExpression: function (node) {
        checkClass(node)
      }
    }

    function checkClass (node) {
      const body = node.body.body

      let fields
      for (const statement of body) {
        if (statement.kind !== 'constructor') {
          continue
        }

        if (!statement.value.body || !statement.value.body.body) {
          continue
        }
        const constructorBody = statement.value.body.body
        fields = findFields(constructorBody)
        break
      }

      if (!fields) return

      for (const fieldName of fields) {
        let classProp
        for (const statement of body) {
          if (statement.type !== 'ClassProperty') {
            continue
          }

          if (statement.key.type !== 'Identifier') {
            continue
          }

          if (statement.key.name !== fieldName) {
            continue
          }

          classProp = statement
          break
        }

        if (!classProp || classProp.key.name !== fieldName) {
          const id = node.id
          const className = id ? id.name : '<anon>'

          const msg = `Class ${className} is missing property ` +
            `declaration for ${fieldName}`
          context.report({
            node: node,
            message: msg
          })
        }
      }
    }
  }
}

function findFields (constructorBody) {
  const out = []

  for (const statement of constructorBody) {
    if (statement.type !== 'ExpressionStatement') {
      continue
    }

    if (statement.expression.type !== 'AssignmentExpression') {
      continue
    }

    const expr = statement.expression
    if (!expr.left ||
        expr.left.type !== 'MemberExpression' ||
        !expr.left.object ||
        expr.left.object.type !== 'ThisExpression'
    ) {
      continue
    }

    const prop = expr.left.property
    if (prop.type !== 'Identifier') {
      continue
    }

    out.push(prop.name)
  }

  return out
}
