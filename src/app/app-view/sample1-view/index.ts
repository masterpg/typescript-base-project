const { customElement, query } = Polymer.decorators;

import '@polymer/paper-button/paper-button';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import '../../../styles/base-styles';
import './contact-list';
import * as api from '../../../api';

@customElement('sample1-view')
export class Sample1View extends GestureEventListeners(PolymerElement) {

  static get template() {
    return html`
      <style include="base-styles">
        :host {
          display: block;
        }

        .main {
          margin: 24px;
        }

        .main[sp-layout] {
          margin: 12px;
        }

        paper-button {
          font-size: 14px;
          color: var(--paper-indigo-500);
          --paper-button: {
            margin: 0;
            padding: 0;
          }
        }
      </style>

      <iron-media-query query="(max-width: 640px)" query-matches="{{__spLayout}}"></iron-media-query>

      <div class="main" sp-layout$="{{__spLayout}}">
        <paper-button on-click="__buttonOnClick">Load contacts</paper-button>
        <contact-list contacts="[[__contacts]]"></contact-list>
      </div>
    `;
  }

  //----------------------------------------------------------------------
  //
  //  Variables
  //
  //----------------------------------------------------------------------

  __contacts: api.Contact[] = [];

  __spLayout: boolean = false;

  //----------------------------------------------------------------------
  //
  //  Lifecycle callbacks
  //
  //----------------------------------------------------------------------

  constructor() {
    super();
  }

  //----------------------------------------------------------------------
  //
  //  Event handlers
  //
  //----------------------------------------------------------------------

  async __buttonOnClick(e) {
    const contacts = await api.fetchContacts();
    this.__contacts = contacts;
  }
}
