import { State } from '../src/State'

test('add entity', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']]))
  ])

  expect(
    personState.get('person1')
  ).toEqual(
    new Map([['name', 'jan'], ['age', '20']])
  )
})

test('add more entities', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.push(new Map([['name', 'bob'], ['age', '23']]))
  ])

  expect(
    personState.get('person2')
  ).toEqual(
    new Map([['name', 'bob'], ['age', '23']])
  )
})

test('update field', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.update('person1', 'name', 'bob')
  ])

  expect(
    personState.get('person1')
  ).toEqual(
    new Map([['name', 'bob'], ['age', '20']])
  )
})

test('remove entity', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.remove('person1')
  ])

  expect(
    personState.getKeys()
  ).toEqual(
    []
  )
})

test('insert entity at the start', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.push(new Map([['name', 'bob'], ['age', '23']])),
    personState.insert(new Map([['name', 'tom'], ['age', '26']]), 0)
  ])

  expect(
    personState.getKeys()
  ).toEqual(
    ['person3', 'person1', 'person2']
  )
})

test('move entity', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.push(new Map([['name', 'bob'], ['age', '23']])),
    personState.move('person2', 0)
  ])

  expect(
    personState.getKeys()
  ).toEqual(
    ['person2', 'person1']
  )
})

test('undo', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.push(new Map([['name', 'bob'], ['age', '23']]))
  ])

  state.undo()

  expect(
    personState.getKeys()
  ).toEqual(
    []
  )
})

test('undo', () => {
  const state = new State(new Set(['person', 'book']))

  const personState = state.open('person')

  if (personState === undefined) { return fail() }

  state.commit([
    personState.push(new Map([['name', 'jan'], ['age', '20']])),
    personState.push(new Map([['name', 'bob'], ['age', '23']]))
  ])

  state.undo()
  state.redo()

  expect(
    personState.getKeys()
  ).toEqual(
    ['person1', 'person2']
  )
})
