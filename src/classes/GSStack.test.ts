import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import { GSStack } from './GSStack'
import { DEFAULT_COMPARATOR } from '../types/Comparator'
import { _GSSNode } from './GSSNode'

describe('GSStack: constructor', () => {
  it('succeeds without a comparator', () => {
    expect(new GSStack()).not.toBeUndefined()
  })

  it('sets DEFAULT_COMPARATOR as the default comparator', () => {
    expect(new GSStack()['comparator']).toEqual(DEFAULT_COMPARATOR)
  })

  it('starts with no layers', () => {
    expect(new GSStack()['levels'].length).toBe(0)
  })
})

describe('GSStack: push', () => {
  it('pushes to level = 0 when prev = undefined', () => {
    const value = 5
    const stack = new GSStack()
    const node = stack.push(value)

    expect(node).not.toBeUndefined()
    expect(node.level).toBe(0)
    expect(stack['levels'][0].find(value, stack['comparator'])).toBe(node)
  })

  it('pushes above prev when prev != undefined', () => {
    const stack = new GSStack()
    const prev = stack.push(1)
    const node = stack.push(2, prev)

    expect(node).not.toBeUndefined()
    expect(node.level).toBe(1)
    expect(node.degPrev()).toBe(1)
    expect(prev.hasHigherLevelNext()).toBe(true)
  })
})

describe('GSStack: pop', () => {
  it('successfully removes a 1-cycle', () => {
    const stack = new GSStack<number>()
    const node = stack.push(5)

    expect(stack.pop(node)).toBe(true)
  })

  it('fails to remove a bottom node', () => {
    const stack = new GSStack<number>()
    const prevNode = stack.push(0)
    const nextNode = stack.push(1, prevNode)

    expect(stack.pop(prevNode)).toBe(false)
    expect(nextNode.degPrev()).toBe(1)
    expect(prevNode.degNext()).toBe(1)
  })
})

describe('GSStack: integration', () => {
  let stack: GSStack<number>

  beforeEach(() => {
    stack = new GSStack()
  })

  it('mimics a stack: pushing', () => {
    const N = 500
    const native: number[] = []
    let prev: _GSSNode<number> | undefined

    for (const value of new Array(N).fill(0).map((_, i) => i)) {
      prev = stack.push(value, prev)
      native.push(value)

      expect(native[native.length - 1]).toEqual(value)
      expect(prev.value).toEqual(value)
    }
  })

  it('mimics a stack: push, and remove', () => {
    const N = 5
    const values = new Array(N).fill(0).map((_, i) => i)
    const native: number[] = []
    let prev: _GSSNode<number> | undefined

    for (const value of values) {
      prev = stack.push(value, prev)
      native.push(value)
    }

    while (!stack.empty() && native.length > 0) {
      const value = native.pop()
      const nextPrev = Object.values(prev?.prev ?? {})[0]
      stack.pop(prev!)

      expect(prev?.value).toEqual(value)
      prev = nextPrev
    }

    expect(stack.empty()).toBe(true)
    expect(native.length).toBe(0)
  })
})
