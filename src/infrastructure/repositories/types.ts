export interface Repository<T> {
  getAll(): Promise<T[]>;

  getById(id: number): Promise<T | null>;

  create(item: T): Promise<T>;

  update(id: number, item: Partial<T>): Promise<T | null>;

  delete(id: number): Promise<boolean>;
}
