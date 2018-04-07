import * as Redux from 'redux';
import { default as PolymerRedux, PolymerReduxMixin } from 'polymer-redux/polymer-redux';

/**
 * アプリケーションの状態を表現するクラスです。
 */
export class AppState {

  constructor(source?: AppState) {
    this.assign(source);
  }

  message: string = '';

  assign(source?: AppState) {
    Object.assign(this, source);
  }
}

/**
 * アクション関連の情報が定義される場所です。
 */
export namespace AppAction {

  /**
   * アクションのタイプを表す列挙型です。
   */
  export enum Types {
    updateMessage = '__updateMessage',
  }

  /**
   * アクションのデータ型一覧です。
   */
  export namespace DataSets {
    export interface UpdateMessage extends Redux.Action {
      message: string;
    }
  }
}

import { reducer } from './reducer';

/**
 * アプリケーションの状態を保持するオブジェクトです。
 */
export const AppStore: Redux.Store<AppState> = Redux.createStore(reducer);

/**
 * PolymerエレメントにReduxの機能を組み込むためのMixinです。
 */
export const AppPolymerReduxMixin: PolymerReduxMixin<AppState> = PolymerRedux(AppStore);

import { AppActions } from './action';

export {
  AppActions,
};
