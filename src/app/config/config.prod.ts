import { Config, Environment } from "./";

export class CurrentConfig implements Config {
  environment = Environment.prod;
  apiInfo = {
    protocol: 'http',
    host: '0.0.0.0',
    port: 5001,
  }
}
