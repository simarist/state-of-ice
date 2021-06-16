export interface Reader {
  get: (key: string) => Map<string, string> | undefined
  getKeys: () => string[]
}
