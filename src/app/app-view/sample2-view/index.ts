import '@polymer/paper-button/paper-button';
import '@polymer/polymer/polymer';
import * as view from './index.html';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';

import '../../../styles/base-styles';
import { customElement } from '../../../polymer-decorators';

@customElement('sample2-view')
export class Sample2View extends GestureEventListeners(PolymerElement) {

  static get template() {
    return view;
  }
}
