import { describe, it, expect } from '@jest/globals'
import { GSSNode } from './GSSNode'
import { GSSLevel } from './GSSLevel'
import { DEFAULT_COMPARATOR } from '../types/Comparator'

describe('GSSNode: constructor', () => {
  const value = 1
  const level = 0

  it('starts with empty prev', () =>
    expect(new GSSLevel(level).push(value, DEFAULT_COMPARATOR).degPrev()).toBe(
      0,
    ))
  it('starts with empty next', () =>
    expect(new GSSLevel(level).push(value, DEFAULT_COMPARATOR).degNext()).toBe(
      0,
    ))
})

type Writable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? Writable<T[K]> : T[K]
}

const methods = [
  ['addPrev', 'degPrev'],
  ['addNext', 'degNext'],
] as const

describe.each(methods as Writable<typeof methods>)(
  'GSSNode: %s',
  (add, has) => {
    it('adds a node', () => {
      const level = new GSSLevel(0)
      const mainNode = level.push(5, DEFAULT_COMPARATOR)
      const otherNode = level.push(1, DEFAULT_COMPARATOR)

      mainNode[add](otherNode)

      expect(mainNode[has]()).toBe(1)
    })

    it("doesn't add if the node already exists", () => {
      const level = new GSSLevel(0)
      const mainNode = level.push(5, DEFAULT_COMPARATOR)
      const otherNode = level.push(0, DEFAULT_COMPARATOR)

      mainNode[add](otherNode)
      mainNode[add](otherNode)

      expect(mainNode[has]()).toBe(1)
    })
  },
)

describe('GSSNode: hasHigherLevelNext', () => {
  it('returns false when has no next nodes', () => {
    const node = new GSSLevel(0).push(5, DEFAULT_COMPARATOR)

    expect(node.hasHigherLevelNext()).toBe(false)
  })

  it('returns true when has a lower level', () => {
    const node = new GSSLevel(0).push(1, DEFAULT_COMPARATOR)

    expect(node.hasHigherLevelNext()).toBe(false)
  })
})
