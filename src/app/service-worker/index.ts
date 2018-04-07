//----------------------------------------------------------------------
//
//  Definition
//
//----------------------------------------------------------------------

export enum ChangeState {
  installed = 'installed',
  cached = 'cached',
}

export type StateChangeLister = (info: StateChangeInfo) => void;

export interface StateChangeInfo {
  state: ChangeState;
  message: string;
}

//----------------------------------------------------------------------
//
//  Variables
//
//----------------------------------------------------------------------

const __stateChangeListeners: StateChangeLister[] = [];

//----------------------------------------------------------------------
//
//  Methods
//
//----------------------------------------------------------------------

/**
 * ServiceWorkerの状態が変化した際のリスナを登録します。
 * @param listner
 */
export function addStateChangeListener(listner: StateChangeLister): void {
  __stateChangeListeners.push(listner);
}

/**
 * ServiceWorkerの初期化を行います。
 */
export function init(): void {
  if (!('serviceWorker' in navigator)) return;

  const base = window.document.querySelector('html > head > base') as HTMLBaseElement;
  if (!base) {
    console.error('<base> element not found.');
    return;
  }

  navigator.serviceWorker.register('service-worker.js', { scope: base.href }).then((reg) => {
    // service-worker.jsに変更があった際のハンドラ
    reg.onupdatefound = () => {
      const installingServiceWorker = reg.installing;
      if (!installingServiceWorker) return;
      // ServiceWorkerの状態が変更された際のハンドラ
      installingServiceWorker.onstatechange = () => {
        stateChangeFor(installingServiceWorker);
      };
    };
  });
}

//----------------------------------------------------------------------
//
//  Internal methods
//
//----------------------------------------------------------------------

function stateChangeFor(serviceWorker: ServiceWorker): void {
  let info: StateChangeInfo | null = null;
  switch (serviceWorker.state) {
    case 'installed':
      // この判定では、古いコンテンツが除去され、新しいコンテンツがキャッシュに追加された状態を示す。
      // 必要であれば「新しいコンテンツが利用可能になったのでリフレッシュしてください」とユーザー
      // に促すのに最適な場所である
      if (navigator.serviceWorker.controller) {
        info = {
          state: ChangeState.installed,
          message: 'サイトの更新が見つかりました。再読み込みを行ってください。',
        };
      }
      // この判定では、全てのコンテンツがプリキャッシュされた状態を示す。
      // 必要であれば「コンテンツはキャッシュされたのでオフラインで使用できます」とユーザーに
      // 通知するのに最適な場所である。
      else {
        info = {
          state: ChangeState.cached,
          message: 'サイトがオフラインで利用可能な状態になりました。',
        };
      }
      break;
  }
  if (!info) return;
  for (const listener of __stateChangeListeners) {
    listener(info);
  }
}
