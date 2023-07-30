import { GSSLevel } from './classes/GSSLevel'
import { GSSNode } from './classes/GSSNode'
import { Comparator, DEFAULT_COMPARATOR } from './types/Comparator'

export class GSStack<T> {
  levels: GSSLevel<T>[]
  comparator: (a: T, b: T) => boolean

  constructor(comparator: Comparator<T> = DEFAULT_COMPARATOR) {
    this.comparator = comparator
    this.levels = [new GSSLevel(0)]
  }

  /**
   *
   * @param value Value to be pushed.
   * @param prev Node preceding the new node.
   * @returns Returns a newly pushed node or a reference to an existing node.
   */
  push(value: T, prev?: GSSNode<T>): GSSNode<T> {
    const level = (prev?.level ?? -1) + 1
    if (this.levels.length === level) {
      this.levels.push(new GSSLevel(level))
    }

    const node =
      this.levels[level].find(value, this.comparator) ??
      this.levels[level].push(value)

    if (prev !== undefined) {
      node.addPrev(prev)
    }

    return node
  }

  /**
   * Removes the given node from the stack.
   * Returns `false` when trying to remove a non-toplevel node,
   * which is referenced by higher-level nodes.
   * Returns `true` if the node was successfully removed.
   *
   * @param node Node to remove.
   */
  pop(node: GSSNode<T>): boolean {
    if (
      this.levels.length > node.level + 1 &&
      node.degNext() > 0 &&
      node.hasHigherLevelNext()
    ) {
      return false
    }

    this.levels[node.level].remove(node)
    return true
  }
}
