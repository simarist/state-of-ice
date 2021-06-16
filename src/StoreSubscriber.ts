export interface StoreSubscriber {
  add: (
    key: string,
  ) => void

  remove: (
    key: string,
  ) => void

  update: (
    key: string,
    field: string,
    value: string,
  ) => void
}
