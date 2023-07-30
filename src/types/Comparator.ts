export type Comparator<T> = (a: T, b: T) => boolean

export const DEFAULT_COMPARATOR: Comparator<unknown> = (a, b) => a === b
