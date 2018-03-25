import './app/app-view';
import * as sw from './app/service-worker'
import { config } from './app/config';

window.addEventListener('load', () => {
  console.log('environment:', config.environment);
  sw.init();
});
