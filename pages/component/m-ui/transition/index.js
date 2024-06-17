import { MxComponent } from '../common/component'
import { transition } from '../mixins/transition'
MxComponent({
  classes: [
    'enter-class',
    'enter-active-class',
    'enter-to-class',
    'leave-class',
    'leave-active-class',
    'leave-to-class',
  ],
  mixins: [transition(true)],
})
