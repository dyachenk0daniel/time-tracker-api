import serverConfig, { ServerConfig } from './server';

interface Config {
  server: ServerConfig;
}

const config: Config = {
  server: serverConfig,
};

export default config;
