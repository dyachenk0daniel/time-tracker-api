import serverConfig, { ServerConfig } from './server';
import authConfig, { AuthConfig } from './auth';

interface Config {
  server: ServerConfig;
  auth: AuthConfig;
}

const config: Config = {
  server: serverConfig,
  auth: authConfig,
};

export default config;
