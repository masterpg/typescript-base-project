export enum Environment {
  prod = 'prod',
  dev = 'dev',
}

export interface Config {
  environment: Environment;
  apiInfo: { protocol: string, host: string, port: number };
}

import { CurrentConfig } from './config.dev';

export const config: Config = new CurrentConfig();
