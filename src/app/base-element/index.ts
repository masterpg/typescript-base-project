import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { GestureEventListeners, GestureEventListenersConstructor } from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { AppActions, AppPolymerReduxMixin } from "../redux";

/**
 * エレメントのベースクラスです。
 */
export class BaseElement extends AppPolymerReduxMixin(PolymerElement) {
  get actions() {
    return AppActions;
  }
}

/**
 * UIエレメントのベースクラスです。
 */
export class BaseUIElement extends GestureEventListeners(BaseElement) {}
