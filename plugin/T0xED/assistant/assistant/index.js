import Assistant from './core/Assistant'
import { manualSleep } from './core/tools'

export const createAssistant = function (options, modules) {
  let assistant = new Assistant(options, modules)
  return assistant
}

export const createGetAssistant = function (options, modules) {
  let assistant = null
  return function (type = 'get') {
    if (type == 'destory') {
      assistant = null
    } else if (type == 'get') {
      if (!assistant) {
        assistant = createAssistant(options, modules)
      }
      return assistant
    } else if (type == 'mutli') {
      if (!assistant) {
        assistant = getChannelAssistant()
      }
      return assistant
    }
  }
}

const getChannelAssistant = async function () {
  let assistant = ''
  const assistantChannel = new BroadcastChannel('assistant')
  await manualSleep((res) => {
    assistantChannel.onmessage = function (event) {
      assistant = event.data
      res()
    }
    assistantChannel.postMessage('getAssistant')
  })
  return assistant
}
