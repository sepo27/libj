export interface LooseObject {
  [key: string]: any
}

export interface MapS<V = any> {
  [key: string]: V,
}

export type ValueOf<T> = T[keyof T];
