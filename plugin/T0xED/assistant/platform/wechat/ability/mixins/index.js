import mapState from './mapState'
import mapMethod from './mapMethod'

const assistantBehavior = function (ast, stateMap, methodMap) {
  return [Behavior(
    mapState(ast, stateMap)
  ), Behavior(
    mapMethod(ast, methodMap)
  )]
}

export default assistantBehavior
