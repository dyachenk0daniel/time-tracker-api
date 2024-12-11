import dotenv from 'dotenv';

dotenv.config();

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

const authConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
}

export default authConfig;