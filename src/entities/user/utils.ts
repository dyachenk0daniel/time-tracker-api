import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@app/config';
import { User } from './types';

class UserUtils {
    static async comparePasswords(inputPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(inputPassword, hashedPassword);
    }

    static verifyToken(token: string) {
        return jwt.verify(token, config.auth.jwtSecret) as { id: string };
    }

    static generateToken<T extends Pick<User, 'id' | 'name'>>(user: T) {
        return jwt.sign(
            {
                id: user.id,
                name: user.name,
            },
            config.auth.jwtSecret,
            { expiresIn: config.auth.jwtExpiresIn }
        );
    }
}

export default UserUtils;
