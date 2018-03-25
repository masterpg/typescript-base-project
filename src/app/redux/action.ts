import { AppAction, AppStore } from "./index";

export namespace AppActions {

  export function updateMessage(message: string): void {
    AppStore.dispatch(<AppAction.DataSets.UpdateMessage>{
      type: AppAction.Types.updateMessage,
      message: message,
    });
  }

}