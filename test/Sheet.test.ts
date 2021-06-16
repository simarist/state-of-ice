import { Sheet } from '../src/Sheet'

test('', () => {
  const sheet = new Sheet('person')
  const key = sheet.generateKey()
  sheet.push(key, new Map([['name', 'jan'], ['age', '20']]))

  expect(
    sheet.get('person1')
  ).toEqual(
    new Map([['name', 'jan'], ['age', '20']])
  )
})

test('', () => {
  const sheet = new Sheet('person')
  const key = sheet.generateKey()
  sheet.push(key, new Map([['name', 'jan'], ['age', '20']]))

  const key2 = sheet.generateKey()
  sheet.push(key2, new Map([['name', 'bob'], ['age', '23']]))

  expect(
    sheet.get('person1')
  ).toEqual(
    new Map([['name', 'jan'], ['age', '20']])
  )
})

test('', () => {
  const sheet = new Sheet('person')
  const key = sheet.generateKey()
  sheet.push(key, new Map([['name', 'jan'], ['age', '20']]))

  const key2 = sheet.generateKey()
  sheet.push(key2, new Map([['name', 'bob'], ['age', '23']]))

  expect(
    sheet.getKeys()
  ).toEqual(
    ['person1', 'person2']
  )
})
