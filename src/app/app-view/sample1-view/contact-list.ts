import '@polymer/iron-image/iron-image';
import '@polymer/iron-list/iron-list';
import '@polymer/paper-button/paper-button';
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import '../../../styles/base-styles';
import * as api from '../../../api';
import { AppPolymerReduxMixin } from "../../redux";
import { customElement, property, computed, query, observe } from '../../../polymer-decorators';

@customElement('contact-list')
export class ContactList extends GestureEventListeners(AppPolymerReduxMixin(PolymerElement)) {

  static get template() {
    return html`
      <style include="base-styles">
      </style>

      <iron-list items="[[contacts]]" as="contact" scroll-target="document">
        <template>
          <contact-list-item contact="[[contact]]" tabindex$="[[tabIndex]]"></contact-list-item>
        </template>
      </iron-list>
    `;
  }

  @property({ type: Array })
  contacts: api.Contact[] = [];
}


@customElement('contact-list-item')
export class ContactListItem extends GestureEventListeners(AppPolymerReduxMixin(PolymerElement)) {

  static get template() {
    return html`
      <style include="base-styles">
        .item {
          @apply --layout-horizontal;
          padding: 20px;
          border-radius: 8px;
          background-color: white;
          border: 1px solid #ddd;
          max-width: 800px;
          margin: 16px auto 0 auto;
        }

        .item:focus {
          outline: 0;
          border-color: #333;
        }

        .avatar {
          height: 40px;
          width: 40px;
          border-radius: 20px;
          box-sizing: border-box;
          background-color: #DDD;
        }

        .pad {
          padding: 0 16px;
          @apply --layout-flex;
          @apply --layout-vertical;
        }

        .primary {
          font-size: 16px;
          font-weight: bold;
        }

        .secondary {
          font-size: 14px;
        }

        .dim {
          color: gray;
        }
      </style>

      <div class="item" tabindex$="[[tabIndex]]">
        <iron-image class="avatar" sizing="contain" src="[[contact.image]]"></iron-image>
        <div class="pad">
          <div class="primary">[[__fullName]]</div>
          <template is="dom-if" if="{{!__editingShortText}}">
            <div class="secondary" on-tap="__shortTextOnTap">[[contact.shortText]]</div>
          </template>
          <template is="dom-if" if="{{__editingShortText}}">
            <input id="editingShortTextInput" type="text" value="{{contact.shortText::input}}" on-blur="__shortTextOnBlur">
          </template>
          <div class="secondary dim">[[contact.longText]]</div>
        </div>
      </div>
    `;
  }

  //----------------------------------------------------------------------
  //
  //  Variables
  //
  //----------------------------------------------------------------------

  __editingShortText: boolean = false;

  @query('#editingShortTextInput')
  // @ts-ignore
  __editingShortTextInput: HTMLInputElement;

  // @ts-ignore computedプロパティの引数エラーになるが原因不明
  @computed('contact.first', 'contact.last')
  get __fullName(): string {
    return `${this.contact.first} ${this.contact.last}`;
  }

  //----------------------------------------------------------------------
  //
  //  Properties
  //
  //----------------------------------------------------------------------

  @property()
  // @ts-ignore
  contact: api.Contact;

  //----------------------------------------------------------------------
  //
  //  Event handlers
  //
  //----------------------------------------------------------------------

  __shortTextOnTap() {
    this.__editingShortText = true;
    setTimeout(() => {
      this.__editingShortTextInput.focus();
    }, 1);
  }

  __shortTextOnBlur() {
    this.__editingShortText = false;
  }

  @observe('contact.shortText')
  __contactOnChange(newValue: string) {
    console.log(`contact.shortText changed to ${newValue}`);
  }
}
