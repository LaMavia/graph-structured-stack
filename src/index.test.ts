import { beforeAll, describe, expect, it } from "@jest/globals"
import { GSSNode, GSStack } from "."

describe("GSStack: example", () => {
  // https://en.wikipedia.org/wiki/Graph-structured_stack
  const stack = new GSStack<number>()
  const nodes: Record<number, GSSNode<number>> = {}

  beforeAll(() => {
    // {7,3,1,0}
    nodes[0] = stack.push(0)
    nodes[1] = stack.push(1, nodes[0])
    nodes[3] = stack.push(3, nodes[1])
    nodes[7] = stack.push(7, nodes[3])

    // {7,4,1,0}
    nodes[4] = stack.push(4, nodes[1])
    nodes[7] = stack.push(7, nodes[4]) // 7 isn't duplicated, as it ends up in the same layer

    // {7,5,2,0}
    nodes[2] = stack.push(2, nodes[0])
    nodes[5] = stack.push(5, nodes[2])
    nodes[7] = stack.push(7, nodes[5])

    // {8,6,2,0}
    nodes[6] = stack.push(6, nodes[2])
    nodes[8] = stack.push(8, nodes[6])
  })

  it('has the right degrees: prev', () => {
    expect(nodes[7].degPrev()).toBe(3)
    expect(nodes[8].degPrev()).toBe(1)
    expect(nodes[3].degPrev()).toBe(1)
    expect(nodes[4].degPrev()).toBe(1)
    expect(nodes[5].degPrev()).toBe(1)
    expect(nodes[6].degPrev()).toBe(1)
    expect(nodes[1].degPrev()).toBe(1)
    expect(nodes[2].degPrev()).toBe(1)
    expect(nodes[0].degPrev()).toBe(0)
  })

  it('has the right degrees: next', () => {
    expect(nodes[7].degNext()).toBe(0)
    expect(nodes[8].degNext()).toBe(0)
    expect(nodes[3].degNext()).toBe(1)
    expect(nodes[4].degNext()).toBe(1)
    expect(nodes[5].degNext()).toBe(1)
    expect(nodes[6].degNext()).toBe(1)
    expect(nodes[1].degNext()).toBe(2)
    expect(nodes[2].degNext()).toBe(2)
    expect(nodes[0].degNext()).toBe(2)
  })

  it('has the right prevSet', () => {
    expect(nodes[7])
  })
})
