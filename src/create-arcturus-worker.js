import { Comlink } from 'comlinkjs/comlink.es6.js';

/**
 * Sets up an Arcturus worker using comlinkjs's expose function
 * @param  {function} reducer  function to reduce state
 * @param  {function} selector function to select state
 * @return {undefined}
 */
export default function createArcturusWorker (reducer, selector) {
  class ArcturusWorker {
    constructor () {
      this.state = undefined;
    }

    /**
     * Takes an action and passes that action to the reducer before setting
     * the new state, it then returns the result of this.select()
     * @param  {object} action
     * @return {object}
     */
    action (action) {
      const { state } = this;
      this.state = reducer(state, action);
      return this.select();
    }

    /**
     * Passes the current state to the selector and returns the result
     * @return {object}
     */
    select () {
      const { state } = this;
      return selector(state);
    }
  }

  Comlink.expose({ ArcturusWorker }, self); // eslint-disable-line
}
