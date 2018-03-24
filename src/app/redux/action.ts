import { AppAction } from "./index";

export namespace AppActions {

  export function updateMessage(message: string): AppAction.DataSets.UpdateMessage {
    return {
      type: AppAction.Types.updateMessage,
      message: message,
    };
  }

}