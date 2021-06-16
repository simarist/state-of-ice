export class ReversibleAction {
  constructor (
    readonly forward: () => void,
    readonly backward: () => void
  ) { }
}
