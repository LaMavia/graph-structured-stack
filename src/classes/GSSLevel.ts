import { Comparator, DEFAULT_COMPARATOR } from '../types/Comparator'
import { GSSNode } from './GSSNode'

export class GSSLevel<T> {
  iota = 0
  nodes: Record<number, GSSNode<T>> = {}

  constructor(public number: number) {}

  // O(n)
  find(
    value: T,
    comparator: Comparator<T> = DEFAULT_COMPARATOR,
  ): GSSNode<T> | undefined {
    for (const key in this.nodes) {
      const node = this.nodes[key]

      if (comparator(node.value, value)) {
        return node
      }
    }

    return undefined
  }

  // O(n)
  push(value: T, comparator: Comparator<T> = DEFAULT_COMPARATOR): GSSNode<T> {
    let node = this.find(value, comparator)
    if (node === undefined) {
      node = new GSSNode(this.number, value, ++this.iota)
      this.nodes[node.id] = node
    }

    return node
  }

  // O(1)
  remove(node: GSSNode<T>): void {
    // node.prev.forEach(prevNode =>
    //   prevNode.next.splice(
    //     prevNode.next.findIndex(otherNode => otherNode === node),
    //     1,
    //   ),
    // )

    this.nodes[node.id].delete()
    delete this.nodes[node.id]
  }
}
