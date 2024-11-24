export interface ServerConfig {
  port: number;
  apiPath: string;
}

const serverConfig: ServerConfig = {
  port: 3000,
  apiPath: '/api',
}

export default serverConfig;