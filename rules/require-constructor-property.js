'use strict'

const parseComment = require('comment-parser')

const getJsDocComment = require('./util.js')

module.exports = {
  create: function (context) {
    const sourceCode = context.getSourceCode()

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
      let constructor
      for (const statement of body) {
        if (statement.kind !== 'constructor') {
          continue
        }

        constructor = statement

        if (!statement.value.body || !statement.value.body.body) {
          continue
        }
        const constructorBody = statement.value.body.body
        fields = findFields(sourceCode, constructorBody)
        break
      }

      if (!fields) return

      for (const info of fields) {
        const fieldName = info.fieldName
        const comment = info.comment

        const id = node.id
        const className = id ? id.name : '<anon>'
        if (!comment) {
          const msg = `Class ${className} is missing jsdoc ` +
            `for this.${fieldName} = `
          context.report({
            node: constructor,
            message: msg
          })
          continue
        }

        const parsed = parseComment(
          `/*${comment.value}*/`)

        if (!parsed || parsed.length === 0) {
          const msg = `Class ${className} is has invalid jsdoc for ` +
            `this.${fieldName} = `
          context.report({
            node: constructor,
            message: msg
          })
          continue
        }

        const tags = []
        for (const jsdoc of parsed) {
          tags.push(...jsdoc.tags)
        }

        let typeTag = null
        for (const tag of tags) {
          if (tag.tag === 'type') {
            typeTag = tag
            break
          }
        }

        if (!typeTag) {
          const msg = `Class ${className} is missing type ` +
            `declaration for this.${fieldName} = `
          context.report({
            node: constructor,
            message: msg
          })
          continue
        }

        if (!typeTag.type) {
          const msg = `Class ${className} has empty type ` +
            `declaration for this.${fieldName} = `
          context.report({
            node: constructor,
            message: msg
          })
          continue
        }
      }
    }
  }
}

function findFields (sourceCode, constructorBody) {
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

    const comment = getJsDocComment(sourceCode, statement, {
      minLines: 0,
      maxLines: 1
    })

    out.push({
      fieldName: prop.name,
      comment: comment
    })
  }

  return out
}
