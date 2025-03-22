import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import redis from '@infrastructure/redis';
import { User } from './types';

class UserUtils {
    static async comparePasswords(inputPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(inputPassword, hashedPassword);
    }

    static generateAccessToken(user: Pick<User, 'id' | 'name'>) {
        return jwt.sign({ id: user.id, name: user.name }, config.auth.jwtSecret, {
            expiresIn: config.auth.jwtExpiresIn,
        });
    }

    static async generateRefreshToken(userId: string) {
        const refreshToken = jwt.sign({ userId }, config.auth.refreshSecret, {
            expiresIn: config.auth.refreshExpiresIn,
        });

        await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', config.auth.refreshExpiresIn);

        return refreshToken;
    }

    static verifyAccessToken(token: string) {
        return jwt.verify(token, config.auth.jwtSecret) as { id: string };
    }

    static async verifyRefreshToken(token: string) {
        const decoded = jwt.verify(token, config.auth.refreshSecret) as { userId: string };

        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

        if (storedToken !== token) {
            throw new Error('Refresh token is invalid or expired');
        }

        return decoded;
    }

    static async revokeRefreshToken(userId: string) {
        await redis.del(`refreshToken:${userId}`);
    }
}

export default UserUtils;
