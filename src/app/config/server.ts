import * as process from "node:process";

export interface ServerConfig {
  host: string;
  port: number;
  apiPath: string;
}

const serverConfig: ServerConfig = {
  host: process.env.HOST || 'localhost',
  port: Number(process.env.PORT) || 3000,
  apiPath: '/api',
}

export default serverConfig;