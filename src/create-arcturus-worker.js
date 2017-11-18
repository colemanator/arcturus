import { handleAsyncMessageChannel } from './utils/async-message-channel';

/**
 * Sets up an Arcturus worker using comlinkjs's expose function
 * @param  {function} reducer  function to reduce state
 * @param  {function} selector function to select state
 * @return {undefined}
 */
export default function createArcturusWorker (reducer, selector) {
  const worker = new ArcturusWorker(reducer, selector);
  handleAsyncMessageChannel(self, worker.action.bind(worker)); // eslint-disable-line
}

class ArcturusWorker {
  constructor (reducer, selector) {
    this.state = undefined;

    this.reducer = reducer;
    this.selector = selector;
  }

  /**
   * Takes an action and passes that action to the reducer before setting
   * the new state, it then returns the result of this.select()
   * @param  {object} action
   * @return {object}
   */
  action (action) {
    const { state, reducer } = this;
    this.state = reducer(state, action);
    return this.select();
  }

  /**
   * Passes the current state to the selector and returns the result
   * @return {object}
   */
  select () {
    const { state, selector } = this;
    return selector(state);
  }
}
