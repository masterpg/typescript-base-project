const { customElement, property, query } = Polymer.decorators;

import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-location/iron-location';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { html } from '@polymer/polymer/lib/utils/html-tag';
import { location } from 'lived-js-front';

import '../../styles/base-styles';
import './not-found-404-view';
import './sample1-view';
import './sample2-view';
import './sample3-view';
import * as sw from '../service-worker';

@customElement('app-view')
export class AppView extends GestureEventListeners(PolymerElement) {

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
          margin-right: 10px;
        }

        iron-pages {
          height: 100%;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>

      <iron-location path="{{__locationPath}}"></iron-location>

      <app-drawer-layout narrow="{{__narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[__narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[__page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="sample1-view" href="[[rootPath]]sample1-view">View One</a>
            <a name="sample2-view" href="[[rootPath]]sample2-view">View Two</a>
            <a name="sample3-view" href="[[rootPath]]sample3-view">View Three</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout>

          <app-header slot="header" condenses reveals effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="icons:menu" drawer-toggle></paper-icon-button>
              <div main-title>My App</div>
            </app-toolbar>
          </app-header>

          <iron-pages
              selected="[[__page]]"
              attr-for-selected="name"
              fallback-selection="not-found-404-view"
              role="main">
            <sample1-view name="sample1-view"></sample1-view>
            <sample2-view name="sample2-view"></sample2-view>
            <sample3-view name="sample3-view"></sample3-view>
            <not-found-404-view name="not-found-404-view"></not-found-404-view>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  //----------------------------------------------------------------------
  //
  //  Variables
  //
  //----------------------------------------------------------------------

  __page: string = '';

  @property({ observer: '__locationPathChanged' })
  __locationPath: string = '';

  __locationPathChanged(newValue: string, oldValue: string) {
    const locationData = new location.LocationData(window.location);
    const paths = location.split(locationData.path);
    if (paths.length === 0) {
      this.__page = 'sample1-view';
    } else {
      this.__page = paths[0];
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.__drawer.persistent) {
      this.__drawer.close();
    }
  }

  __narrow: boolean = false;

  //--------------------------------------------------
  //  Elements
  //--------------------------------------------------

  @query('#drawer')
  // @ts-ignore
  __drawer: HTMLElement | any;

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
}
