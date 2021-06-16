// keyed ordered data records type of structure

import { mapLog, stringSnippet } from './utils/log'

export class Sheet {
  private readonly entities: Map<string, Map<string, string>>
  private readonly keys: string[]

  constructor (
    private readonly keyPrefix: string,
    private readonly verbose: boolean = true
  ) {
    this.entities = new Map()
    this.keys = []
  }

  push (
    key: string,
    data: Map<string, string>
  ): void {
    if (!this.keys.includes(key)) { this.keys.push(key) }
    this.entities.set(key, data)

    if (this.verbose) {
      console.log(`%c  push: ${this.keyPrefix}.${key} ${mapLog(data)}`, 'color: #27ae60')
    }
  }

  insert (
    key: string,
    data: Map<string, string>,
    index: number
  ): void {
    this.keys.splice(index, 0, key)
    this.entities.set(key, data)

    if (this.verbose) {
      console.log(`%c  insert: ${this.keyPrefix}.${key} at ${index} ${mapLog(data)}`, 'color: #27ae60')
    }
  }

  remove (
    key: string
  ): void {
    const index = this.keys.indexOf(key)
    if (index > -1) { this.keys.splice(index, 1) }
    this.entities.delete(key)

    if (this.verbose) {
      console.log(`%c  remove: ${this.keyPrefix}.${key}`, 'color: #e74c3c')
    }
  }

  move (
    key: string,
    index: number
  ): void {
    const oldIndex = this.keys.indexOf(key)
    if (oldIndex > -1) {
      this.keys.splice(oldIndex, 1)
      this.keys.splice(index, 0, key)
    }

    if (this.verbose) {
      console.log(`%c  move: ${this.keyPrefix}.${key} to ${index}`, 'color: #3498db')
    }
  }

  update (
    key: string,
    field: string,
    value: string
  ): void {
    this.entities.get(key)?.set(field, value)

    if (this.verbose) {
      console.log(`%c  update: ${this.keyPrefix}.${key}.${field} set to '${stringSnippet(value)}'`, 'color: #f39c12')
    }
  }

  get (
    key: string
  ): Map<string, string> | undefined {
    const map = this.entities.get(key)
    if (map === undefined) { return undefined }
    return new Map(map)
  }

  getKeys (): string[] {
    return [...this.keys]
  }

  forEach (
    callbackfn: (data: Map<string, string>, key: string) => void
  ): void {
    this.entities.forEach(callbackfn)
  }

  generateKey (): string {
    let keyNumber = this.keys.length
    let key: string

    do {
      keyNumber++
      key = `${this.keyPrefix}${keyNumber}`
    } while (this.keys.includes(key))

    return key
  }
}
