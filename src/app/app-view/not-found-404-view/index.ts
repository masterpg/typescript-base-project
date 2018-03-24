import '@polymer/paper-button/paper-button';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import '../../../styles/base-styles';
import { customElement } from '../../../polymer-decorators';

@customElement('not-found-404-view')
export class NotFound404View extends GestureEventListeners(PolymerElement) {

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          padding: 10px 20px;
        }
      </style>

      Oops you hit a 404. <a href="[[rootPath]]">Head back to home.</a>
    `;
  }
}
