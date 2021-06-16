export function prettyAnyLog (object: any): void {
  console.log('%c' + JSON.stringify(object, null, 2), 'color: #ecf0f1; background: #171a23; display: block; padding: 2px; border-radius: 2px;')
}

export function mapLog (map: Map<string, string>): string {
  let out = ''

  map.forEach((value, key) => {
    value = stringSnippet(value)
    out += `[${key}: ${value}]`
  })

  return out
}

export function stringSnippet (value: string): string {
  if (value.length > 20) { value = value.substring(0, 20) + '...' }
  return value
}
