import { Pool } from 'pg';
import { User } from '@entities/user/types';
import { DateUtils } from '@shared/utils';

class UserRepository {
    constructor(private readonly dbPool: Pool) {}

    private transformUser(user: Record<string, unknown>) {
        return {
            ...user,
            createdAt: DateUtils.convertDateToISOString(user.created_at as Date) || '',
            updatedAt: DateUtils.convertDateToISOString(user.updated_at as Date),
        } as User;
    }

    async getAll(): Promise<User[]> {
        const query = 'SELECT * FROM users';
        const result = await this.dbPool.query(query);

        return result.rows.map((row) => this.transformUser(row));
    }

    async getById(id: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.dbPool.query(query, [id]);
        const user = result.rows[0];

        if (!user) {
            return null;
        }

        return this.transformUser(user);
    }

    async getByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await this.dbPool.query(query, [email]);
        const user = result.rows[0];

        if (!user) {
            return null;
        }

        return this.transformUser(user);
    }

    async create(item: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const query = `
            INSERT INTO users (name, email, password, created_at)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [item.name, item.email, item.password, new Date().toISOString()];
        const result = await this.dbPool.query(query, values);
        return this.transformUser(result.rows[0]);
    }

    async update(user: User): Promise<User> {
        const query = `
            UPDATE users
            SET name       = $1,
                email      = $2,
                password   = $3,
                created_at = $4,
                updated_at = $5
            WHERE id = $6 RETURNING *;
        `;
        const values = [user.name, user.email, user.password, user.createdAt, user.updatedAt, user.id];
        const result = await this.dbPool.query(query, values);
        return this.transformUser(result.rows[0]);

    }

    async delete(id: string): Promise<boolean> {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await this.dbPool.query(query, [id]);

        if (!result.rowCount) {
            return false;
        }

        return result.rowCount > 0;
    }
}

export default UserRepository;
