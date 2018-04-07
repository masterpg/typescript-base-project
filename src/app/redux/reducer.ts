import * as Redux from 'redux';
import { AppAction, AppState } from './index';

type ActionMethod = (state: AppState, action: Redux.Action) => AppState;

/**
 * ReduxのReducerとなる関数で、現在のアプリケーションの状態変更をうながすトリガーが
 * 発生した場合にコールされます。
 * @param state 現在のアプリケーションの状態を保持するデータです。
 * @param action アプリケーションの状態に対する変更のアクションです。
 */
export function reducer(state: AppState, action: Redux.Action): AppState {
  if (!state) return __initialState;

  // アクションに対する処理を行うメソッドを取得
  const actionType = action.type as AppAction.Types;
  const actionMethod = actions[actionType] as ActionMethod;
  if (!actionMethod) {
    console.error(`A method associated with the type of action '${action.type}' was not found.`);
    return __initialState;
  }

  // アクションの処理を実行
  return actionMethod(state, action);
}

const actions = {
  [AppAction.Types.updateMessage]: (state: AppState, action: AppAction.DataSets.UpdateMessage) => {
    return Object.assign(new AppState(state), { message: action.message }) as AppState;
  },
};

/**
 * アプリケーションの初期状態のオブジェクトです。
 */
const __initialState: AppState = new AppState();
