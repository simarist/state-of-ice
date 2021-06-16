import { ReversibleAction } from './ReversibleAction'

// It is a magic packet, because its content is created when it is unpacked.

export class Packet {
  constructor (
    private readonly runnable: () => ReversibleAction | undefined
  ) { }

  unpack (): ReversibleAction | undefined {
    return this.runnable()
  }
}
