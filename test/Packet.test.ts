import { Packet } from '../src/Packet'
import { ReversibleAction } from '../src/ReversibleAction'

test('', () => {
  const foo = new Packet(() => {
    console.log('packet')

    const forward = (): void => {
      console.log('forward')
    }

    const backward = (): void => {
      console.log('backward')
    }

    return new ReversibleAction(forward, backward)
  })

  foo.unpack()?.forward()
})
