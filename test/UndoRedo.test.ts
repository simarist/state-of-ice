import { UndoRedo } from '../src/UndoRedo'

let undoRedo: UndoRedo
let text: string

beforeEach(() => {
  undoRedo = new UndoRedo()
  text = ''
})

test('simple undo and redo', () => {
  const rev1 = {
    forward: () => { text = text + '+1' },
    backward: () => { text = text + '-1' }
  }

  rev1.forward()
  undoRedo.add(rev1)

  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.redo()
  undoRedo.redo()
  undoRedo.redo()
  undoRedo.redo()

  expect(text).toEqual('+1-1+1')
})

test('default limit', () => {
  const rev1 = {
    forward: () => { text = text + '+1' },
    backward: () => { text = text + '-1' }
  }
  const rev2 = {
    forward: () => { text = text + '+2' },
    backward: () => { text = text + '-2' }
  }
  const rev3 = {
    forward: () => { text = text + '+3' },
    backward: () => { text = text + '-3' }
  }
  const rev4 = {
    forward: () => { text = text + '+4' },
    backward: () => { text = text + '-4' }
  }

  rev1.forward()
  undoRedo.add(rev1)
  rev2.forward()
  undoRedo.add(rev2)
  rev3.forward()
  undoRedo.add(rev3)
  rev4.forward()
  undoRedo.add(rev4)
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()

  expect(text).toEqual('+1+2+3+4-4-3-2')
})

test('stack cut-off from bottom', () => {
  const rev1 = {
    forward: () => { text = text + '+1' },
    backward: () => { text = text + '-1' }
  }
  const rev2 = {
    forward: () => { text = text + '+2' },
    backward: () => { text = text + '-2' }
  }
  const rev3 = {
    forward: () => { text = text + '+3' },
    backward: () => { text = text + '-3' }
  }
  const rev4 = {
    forward: () => { text = text + '+4' },
    backward: () => { text = text + '-4' }
  }

  rev1.forward()
  undoRedo.add(rev1)
  rev2.forward()
  undoRedo.add(rev2)
  rev3.forward()
  undoRedo.add(rev3)
  rev4.forward()
  undoRedo.add(rev4)

  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.redo()
  undoRedo.redo()
  undoRedo.redo()
  undoRedo.redo()
  undoRedo.redo()

  expect(text).toEqual('+1+2+3+4-4-3-2+2+3+4')
})

test('stack cut-off from top', () => {
  const rev1 = {
    forward: () => { text = text + '+1' },
    backward: () => { text = text + '-1' }
  }
  const rev2 = {
    forward: () => { text = text + '+2' },
    backward: () => { text = text + '-2' }
  }
  const rev3 = {
    forward: () => { text = text + '+3' },
    backward: () => { text = text + '-3' }
  }
  const rev4 = {
    forward: () => { text = text + '+4' },
    backward: () => { text = text + '-4' }
  }

  rev1.forward()
  undoRedo.add(rev1)
  rev2.forward()
  undoRedo.add(rev2)
  rev3.forward()
  undoRedo.add(rev3)

  undoRedo.undo()
  undoRedo.undo()

  rev4.forward()
  undoRedo.add(rev4)

  undoRedo.undo()
  undoRedo.undo()
  undoRedo.undo()
  undoRedo.redo()
  undoRedo.redo()
  undoRedo.redo()
  expect(text).toEqual('+1+2+3-3-2+4-4-1+1+4')
})
