const { customElement, query } = Polymer.decorators;

import '../../styles/base-styles';
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

  __posts: api.Post[] = [];

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
    const posts = await api.getPosts();
    posts.forEach((item, index, list) => {
      console.log('id:', item.id, ', title:', item.title, ', author:', item.author);
    });
    this.__posts = posts;
  }
}
