import { Comlink } from 'comlinkjs/comlink.es6.js';

export default class ArcturusWorker {
  /**
   * Returns a new Arcturus worker, given both selectors and reducers
   * @param  {Array} reducers Array of reducer functions
   * @param  {Object} [selectors] Object of selectors
   * @return {Object}
   */
  constructor (reducer, selector) {
    this.reducer = reducers;
    this.selector = selectors;
    this.state = undefined;

    comlink.expose(this, self);
  }

  action (action) {
    const { reducer, state } = this;
    this.state = reducer(state, action);
    return this.select();
  }

  select () {
    const { selector, state } = this;
    return selector(state);
  }
}
