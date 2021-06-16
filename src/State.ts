import { ReversibleAction } from './ReversibleAction'
import { Packet } from './Packet'
import { UndoRedo } from './UndoRedo'
import { StateCategory } from './StateCategory'

export class State {
  private readonly state: Map<string, StateCategory>
  private readonly undoRedo: UndoRedo = new UndoRedo()

  constructor (
    categories: Set<string>,
    private readonly verbose: boolean = true
  ) {
    this.state = new Map()
    categories.forEach(category => {
      this.state.set(
        category, new StateCategory(category))
    })
  }

  open (
    category: string
  ): StateCategory | undefined {
    return this.state.get(category)
  }

  undo (): void {
    if (this.verbose) {
      console.log('%c[undo]', 'color: #7f8c8d')
    }

    this.undoRedo.undo()
  }

  redo (): void {
    if (this.verbose) {
      console.log('%c[redo]', 'color: #7f8c8d')
    }

    this.undoRedo.redo()
  }

  commit (
    packets: Packet[]
  ): void {
    if (this.verbose) {
      console.log('%c[commit]', 'color: #7f8c8d')
    }

    const forwardActions: Array<() => void> = []
    const backwardActions: Array<() => void> = []

    // unpack all packets
    packets.forEach(packet => {
      const reversibleAction = packet.unpack()

      if (reversibleAction === undefined) { return }

      // now execute an action that will actually change the state, aka go forward
      reversibleAction.forward()

      forwardActions.push(() => reversibleAction.forward())
      backwardActions.unshift(() => reversibleAction.backward())
    })

    // if there is nothing in the packets, dont do anything, so that undoredo is not poluted
    if (forwardActions.length <= 0) { return }

    // create a single reversible action that from the contents of the packets
    const cumulativeForwardAction = (): void => {
      forwardActions.forEach(action => action())
    }

    const cumulativeBackwardAction = (): void => {
      backwardActions.forEach(action => action())
    }

    const cumulativeReversibleAction = new ReversibleAction(
      cumulativeForwardAction,
      cumulativeBackwardAction)

    // commit the reversible action to the undoredo stack
    this.undoRedo.add(cumulativeReversibleAction)
  }

  getStateJSON (
    version: string
  ): string {
    const out: any = {}

    out.version = version
    out.state = {}

    this.state.forEach((stateCategory, category) => {
      const stateCategoryObject: any = {}

      stateCategory.forEach((data, key) => {
        const dataObject: any = {}

        data.forEach((value, field) => {
          dataObject[field] = value
        })

        stateCategoryObject[key] = dataObject
      })

      out.state[category] = stateCategoryObject
    })

    return JSON.stringify(out, null, 2)
  }
}
