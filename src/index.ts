import './app/app-view';
import * as ES6Promise from "es6-promise";
import * as sw from './app/service-worker';
import { config } from './app/config';

ES6Promise.polyfill();

window.addEventListener('load', () => {
  console.log('environment:', config.environment);
  sw.init();
});
