import { ReversibleAction } from './ReversibleAction'

export class UndoRedo {
  private readonly actions: ReversibleAction[] = []
  private depth = 0

  constructor (
    private readonly limit: number = 3
  ) { }

  // action that is passed here needs to be already executed forward
  // there is a reason why it is not execuited here - it has to do with the order of things in the commit method
  add (
    action: ReversibleAction
  ): void {
    // action.forward();

    if (this.depth !== 0) {
      this.actions.splice(-this.depth, this.depth)
      this.depth = 0
    }

    this.actions.push(action)

    if (this.actions.length > this.limit) {
      this.actions.shift()
    }
  }

  undo (): void {
    const index = this.actions.length -
            this.depth -
            1

    if (index < 0 || index >= this.actions.length) { return }

    this.depth++

    const action = this.actions[index].backward
    action()
  }

  redo (): void {
    const index = this.actions.length -
            this.depth

    if (index < 0 || index >= this.actions.length) { return }

    this.depth--

    const action = this.actions[index].forward
    action()
  }
}
