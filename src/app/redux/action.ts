import { AppAction, AppStore } from './index';

export namespace AppActions {

  export function updateMessage(message: string): void {
    AppStore.dispatch({
      type: AppAction.Types.updateMessage,
      message,
    } as AppAction.DataSets.UpdateMessage);
  }

}
