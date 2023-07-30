import { describe, it, expect } from '@jest/globals'
import { DEFAULT_COMPARATOR } from '../types/Comparator'
import { GSSLevel } from './GSSLevel'
import { GSSNode } from './GSSNode'

describe('GSSLevel: constructor', () => {
  const EMPTY_RECORD = {}

  // Initial conditions
  it('starts with empty nodes', () =>
    expect(new GSSLevel(0).nodes).toEqual(EMPTY_RECORD))
  it('starts with iota = 0', () => expect(new GSSLevel(0).iota).toBe(0))
})

describe('GSS: push', () => {
  it('adds node', () => {
    const level = new GSSLevel<number>(0)
    const node = level.push(5, DEFAULT_COMPARATOR)

    expect(Object.values(level.nodes).length).toBe(1)
    expect(level.nodes[node.id]).toBe(node)
  })
})

describe('GSS: find', () => {
  it('returns undefined when empty', () => {
    const level = new GSSLevel<number>(0)

    expect(level.find(0, DEFAULT_COMPARATOR)).toBeUndefined()
  })

  it("returns undefined when the value doesn't exist", () => {
    const valueA = 5
    const valueB = 0
    const level = new GSSLevel<number>(0)
    level.push(valueA)

    expect(level.find(valueB, DEFAULT_COMPARATOR)).toBeUndefined()
  })

  it('returns node reference if the value exists', () => {
    const value = 50
    const level = new GSSLevel<number>(0)
    const node = level.push(value)

    // testing reference validity, not just structural equality
    expect(level.find(value)).toBe(node)
  })
})

describe('GSS: remove', () => {
  it("doesn't fail if the node doesn't exist", () => {
    const level = new GSSLevel<number>(0)
    const node = level.push(0)

    try {
      expect(level.remove(node)).toBeUndefined()
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  it('removes existing node', () => {
    const level = new GSSLevel<number>(0)
    const value = 0
    const node = level.push(value)

    level.remove(node)

    expect(level.find(value)).toBeUndefined()
    expect(Object.values(level.nodes).length).toBe(0)
  })

  it("fixes others' next, and prev", () => {
    const level0 = new GSSLevel<number>(0)
    const level1 = new GSSLevel<number>(1)
    const nodeA = level0.push(0)
    const nodeB = level1.push(1)

    // create a 2-cycle
    nodeB.addPrev(nodeA)
    nodeB.addNext(nodeA)

    level1.remove(nodeB)

    expect(nodeA.degNext()).toBe(0)
    expect(nodeA.degPrev()).toBe(0)
  })
})
