import { describe, it, expect } from '@jest/globals'
import { GSStack } from '.'
import { DEFAULT_COMPARATOR } from './types/Comparator'

describe('GSStack: constructor', () => {
  it('succeeds without a comparator', () => {
    expect(new GSStack()).not.toBeUndefined()
  })

  it('sets DEFAULT_COMPARATOR as the default comparator', () => {
    expect(new GSStack().comparator).toEqual(DEFAULT_COMPARATOR)
  })

  it('pushes a default layer', () => {
    expect(new GSStack().levels.length).toBe(1)
  })
})

describe('GSStack: push', () => {
  it('pushes to level = 0 when prev = undefined', () => {
    const value = 5
    const stack = new GSStack()
    const node = stack.push(value)

    expect(node).not.toBeUndefined()
    expect(node.level).toBe(0)
    expect(stack.levels[0].find(value, stack.comparator)).toBe(node)
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
