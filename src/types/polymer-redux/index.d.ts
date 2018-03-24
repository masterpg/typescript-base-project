declare module 'polymer-redux/polymer-redux' {

  import * as Redux from 'redux';
  import { Element as PolymerElement } from '@polymer/polymer/polymer-element';

  interface PolymerReduxElement<S> extends PolymerElement {
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

  interface PolymerReduxElementConstructor<S> {
    new(...args: any[]): PolymerReduxElement<S>;
  }

  type PolymerReduxMixin<S> =
    <T extends new (...args: any[]) => {}>(base: T) => T & PolymerReduxElementConstructor<S>;

  export default function PolymerRedux<S>(store: Redux.Store<S>): PolymerReduxMixin<S>;

}
