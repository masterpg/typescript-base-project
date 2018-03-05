import './app/app-view';
import * as sw from './app/service-worker'

window.addEventListener('load', () => {
  sw.init();
});
