declare module 'polymer-redux/polymer-redux' {

  import * as Redux from 'redux';

  interface ReduxElement<S> {
    /**
     * Dispatches an action to the Redux store.
     *
     * @example
     *     element.dispatch({ type: 'ACTION' })
     *
     * @example
     *     element.dispatch('actionCreator', 'foo', 'bar')
     *
     * @example
     *     element.dispatch((dispatch) => {
     *         dispatch({ type: 'MIDDLEWARE'})
     *     })
     *
     * @param  {...*} args
     * @return {Object} The action.
     */
    dispatch: <A extends Redux.Action>(...args: any[]) => A;

    getState(): S;
  }

  interface ReduxElementConstructor<S> {
    new(...args: any[]): ReduxElement<S>;
  }

  type PolymerReduxMixin<S> =
    <T extends new (...args: any[]) => {}>(base: T) => T & ReduxElementConstructor<S>;

  export default function PolymerRedux<S>(store: Redux.Store<S>): PolymerReduxMixin<S>;

}
