import { Pool } from 'pg';
import { Repository } from '@infrastructure/repositories/types';
import { User } from '@entities/user/types';

class UserRepository implements Repository<User> {
  constructor(private readonly dbPool: Pool) {}

  async getAll(): Promise<User[]> {
    const query = 'SELECT * FROM users';
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.dbPool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.dbPool.query(query, [email]);
    return result.rows[0] || null;
  }

  async create(item: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const query = `
            INSERT INTO users (name, email, password, created_at)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
    const values = [item.name, item.email, item.password, new Date().toISOString()];

    const result = await this.dbPool.query(query, values);
    return result.rows[0];
  }

  async update(id: number, item: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }

    const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${index} RETURNING *;
        `;
    values.push(id);

    const result = await this.dbPool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.dbPool.query(query, [id]);

    if (!result.rowCount) {
      return false;
    }

    return result.rowCount > 0;
  }
}

export default UserRepository;
