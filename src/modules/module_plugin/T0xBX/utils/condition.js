const analyseSyntax = (expression) => {
  const operators = ['!=', '>=', '<=', '>', '<', '=']
    for(let operator of operators) {
      const parts = expression.split(operator)
      if(parts.length > 1) {
        return {
          key: parts[0].replace(/\{|\}/g, ''),
          value: parts[1],
          operator
        }
      }
    }
    return {
      key: expression
    }
}

const analyseConditions = (expressions) => {
  const operators = ['&&']
  let conditions = {}
  for(let operator of operators) {
    if(expressions.indexOf(operator) > -1) {
      const parts = expressions.split(operator)
      for(let part of parts) {
        Object.assign(conditions, analyseSyntax(part))
      }
      return conditions
    }

  }
  return _formatCondition(analyseSyntax(expressions))
}

const _formatCondition = ({key, value, operator}) => {
  let o = {}
  o[key] = {}
  if(operator && value) {
    o[key]['operator'] = operator
    o[key]['value'] = value
  }
  return o
}

const compare = (operator, a, b) => {
  let result = null
    switch(operator) {
      case '=':
        result = a == b
        break
      case '!=':
        result = a != b
        break
      case '>=':
        result = a >= b
        break
      case '<=':
        result = a <= b
        break
      case '>':
        result = a > b
        break
      case '<':
        result = a < b
      default:
        break
    }
    return result
}

const conditionsSatisfied = (context, conditions) => {
  let  conditionSatisfied = true

  for(let key in conditions) {
    const {value, operator} = conditions[key]
    if(value == undefined || operator == undefined) {
      conditionSatisfied = context[key]
    } else {
      conditionSatisfied = compare(operator, context[key], value)
    }
    
    if(!conditionSatisfied) {
      break
    }
  }
  return conditionSatisfied
}

exports.analyseSyntax = analyseSyntax
exports.compare = compare
exports.conditionsSatisfied = conditionsSatisfied
exports.analyseConditions = analyseConditions