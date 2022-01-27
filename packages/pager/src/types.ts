export type PagerRequest<T = any> = (page: number, perPage: number) => Promise<T[]>;

export interface PagerOptions {
  perPage?: number,
  initialPage?: number,
}
