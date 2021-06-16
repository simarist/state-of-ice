import { StoreSubscriber } from './StoreSubscriber'
import { ReversibleAction } from './ReversibleAction'
import { Packet } from './Packet'
import { Sheet } from './Sheet'
import { Reader } from './Reader'

export class StateCategory implements Reader {
  private readonly sheet: Sheet
  private readonly bindings: Set<StoreSubscriber>

  constructor (
    keyPrefix: string
  ) {
    this.sheet = new Sheet(keyPrefix)
    this.bindings = new Set()
  }

  bind (
    storeSubscriber: StoreSubscriber
  ): void {
    this.bindings.add(storeSubscriber)

    this.sheet.getKeys().forEach(key => {
      this.notifyAdd(key)
    })
  }

  push (
    data: Map<string, string>
  ): Packet {
    return new Packet(() => {
      const key = this.sheet.generateKey()

      const forward = (): void => {
        this.sheet.push(key, data)
        this.notifyAdd(key)
      }

      const backward = (): void => {
        this.sheet.remove(key)
        this.notifyRemove(key)
      }

      return new ReversibleAction(forward, backward)
    })
  }

  insert (
    data: Map<string, string>,
    index: number
  ): Packet {
    return new Packet(() => {
      const key = this.sheet.generateKey()

      const forward = (): void => {
        this.sheet.insert(key, data, index)
        this.notifyAdd(key)
      }

      const backward = (): void => {
        this.sheet.remove(key)
        this.notifyRemove(key)
      }

      return new ReversibleAction(forward, backward)
    })
  }

  pushWithKey (
    key: string,
    data: Map<string, string>
  ): Packet {
    return new Packet(() => {
      const forward = (): void => {
        this.sheet.push(key, data)
        this.notifyAdd(key)
      }

      const backward = (): void => {
        this.sheet.remove(key)
        this.notifyRemove(key)
      }

      return new ReversibleAction(forward, backward)
    })
  }

  remove (
    key: string
  ): Packet {
    return new Packet(() => {
      const oldData = this.sheet.get(key)
      const oldIndex = this.sheet.getKeys().indexOf(key)

      if (oldData === undefined) { return undefined }

      const forward = (): void => {
        this.sheet.remove(key)
        this.notifyRemove(key)
      }

      const backward = (): void => {
        this.sheet.insert(key, oldData, oldIndex)
        this.notifyAdd(key)
      }

      return new ReversibleAction(forward, backward)
    })
  }

  move (
    key: string,
    index: number
  ): Packet {
    return new Packet(() => {
      const oldIndex = this.sheet.getKeys().indexOf(key)

      if (index === oldIndex) { return undefined }

      const forward = (): void => {
        this.sheet.move(key, index)
        this.notifyRemove(key)
        this.notifyAdd(key)
      }

      const backward = (): void => {
        this.sheet.move(key, oldIndex)
        this.notifyRemove(key)
        this.notifyAdd(key)
      }

      return new ReversibleAction(forward, backward)
    })
  }

  update (
    key: string,
    field: string,
    value: string
  ): Packet {
    return new Packet(() => {
      const oldValue = this.sheet.get(key)?.get(field)

      if (oldValue === undefined) { return undefined } // TODO ie if the key is valid and or field is valid

      if (value === oldValue) { return undefined }

      const forward = (): void => {
        this.sheet.update(key, field, value)
        this.notifyUpdate(key, field, value)
      }

      const backward = (): void => {
        this.sheet.update(key, field, oldValue)
        this.notifyUpdate(key, field, oldValue)
      }

      return new ReversibleAction(forward, backward)
    })
  }

  get (
    key: string
  ): Map<string, string> | undefined {
    return this.sheet.get(key)
  }

  getKeys (): string[] {
    return this.sheet.getKeys()
  }

  /// TODO after I added for each check if i still need get, get keys, also in the sheet
  forEach (
    callbackfn: (data: Map<string, string>, key: string) => void
  ): void {
    this.sheet.forEach(callbackfn)
  }

  private notifyAdd (
    key: string
  ): void {
    this.bindings.forEach(subscriber => {
      subscriber.add(key)
    })
  }

  private notifyRemove (
    key: string
  ): void {
    this.bindings.forEach(subscriber => {
      subscriber.remove(key)
    })
  }

  private notifyUpdate (
    key: string,
    field: string,
    value: string
  ): void {
    this.bindings.forEach(subscriber => {
      subscriber.update(key, field, value)
    })
  }
}
