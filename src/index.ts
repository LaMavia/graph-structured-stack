import { GSSLevel } from './classes/GSSLevel'
import { GSSNode } from './classes/GSSNode'
import { Comparator, DEFAULT_COMPARATOR } from './types/Comparator'

export class GSStack<T> {
  levels: GSSLevel<T>[]
  comparator: (a: T, b: T) => boolean

  constructor(comparator: Comparator<T> = DEFAULT_COMPARATOR) {
    this.comparator = comparator
    this.levels = []
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
    if (node.hasHigherLevelNext()) {
      return false
    }

    this.levels[node.level].remove(node)
    const isLevelEmpty = this.levels[node.level].length() === 0
    const isLastLevel = this.levels.length === node.level + 1

    if (isLastLevel && isLevelEmpty) {
      this.levels.pop()
    }
    return true
  }

  empty(): boolean {
    return this.levels.length === 0
  }
}
