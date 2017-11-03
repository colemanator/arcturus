import { Comlink } from 'comlinkjs/comlink.es6.js';

export default function createArcturusWorker (reducer, selector) {
  class ArcturusWorker {

    constructor () {
      this.state = undefined;
    }

    action (action) {
      const { state } = this;
      this.state = reducer(state, action);
      return this.select();
    }

    select () {
      const { state } = this;
      return selector(state);
    }
  }

  Comlink.expose({ArcturusWorker}, self);
}
