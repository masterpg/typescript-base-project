const { customElement, query } = Polymer.decorators;

import '../../styles/base-styles';
import './contact-list';
import '@polymer/paper-button/paper-button';
import '@polymer/polymer/polymer';
import * as api from '../../api';
import * as sw from '../service-worker';
import * as view from './index.html';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { html } from '@polymer/polymer/lib/utils/html-tag';

@customElement('app-view')
export class AppView extends GestureEventListeners(PolymerElement) {

  static get template() {
    return view;
  }

  //----------------------------------------------------------------------
  //
  //  Variables
  //
  //----------------------------------------------------------------------

  __contacts: api.Contact[] = [];

  //----------------------------------------------------------------------
  //
  //  Lifecycle callbacks
  //
  //----------------------------------------------------------------------

  constructor() {
    super();

    sw.addStateChangeListener(this.__swOnStateChange);
  }

  //----------------------------------------------------------------------
  //
  //  Event handlers
  //
  //----------------------------------------------------------------------

  __swOnStateChange(info) {
    console.log(info);
  }

  async __buttonOnClick(e) {
    const contacts = await api.fetchContacts();
    this.__contacts = contacts;
  }
}
