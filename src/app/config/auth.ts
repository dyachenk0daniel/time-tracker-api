import dotenv from 'dotenv';

dotenv.config();

export interface AuthConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: number;
}

const authConfig: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.REFRESH_SECRET as string,
    refreshExpiresIn: parseInt(process.env.REFRESH_EXPIRES_IN || '604800', 10), // 7 days in seconds
};

export default authConfig;
