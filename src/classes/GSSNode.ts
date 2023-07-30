export class GSSNode<T> {
  prev: Record<number, GSSNode<T>> = {}
  next: Record<number, GSSNode<T>> = {}
  private prevLength = 0
  private nextLength = 0

  constructor(
    public level: number,
    public value: T,
    public readonly id: number,
  ) {}

  addPrev(node: GSSNode<T>): void {
    if (node.id in this.prev) {
      return
    }

    this.prevLength++
    this.prev[node.id] = node
    node.addNext(this)
  }

  addNext(node: GSSNode<T>): void {
    if (node.id in this.next) {
      return
    }

    this.nextLength++
    this.next[node.id] = node
    node.addPrev(this)
  }

  removePrev(node: GSSNode<T>): void {
    if (!(node.id in this.prev)) {
      return
    }

    this.prevLength--
    delete this.prev[node.id]
    node.removeNext(this)
  }

  removeNext(node: GSSNode<T>): void {
    if (!(node.id in this.next)) {
      return
    }

    this.nextLength--
    delete this.next[node.id]
    node.removePrev(this)
  }

  degPrev(): number {
    return this.prevLength
  }

  degNext(): number {
    return this.nextLength
  }

  delete() {
    for (const nextNodeKey in this.next) {
      this.next[nextNodeKey].removePrev(this)
    }

    for (const prevNodeKey in this.prev) {
      this.prev[prevNodeKey].removeNext(this)
    }
  }

  hasHigherLevelNext(): boolean {
    for (const nextNodeId in this.next) {
      if (this.next[nextNodeId].level > this.level) {
        return true
      }
    }

    return false
  }
}
