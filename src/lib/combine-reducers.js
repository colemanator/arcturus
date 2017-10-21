/**
 * Takes an Array of reducers and returns a rootReduer function
 * @param  {Array} reducers Array of object {domain: <string>, func: <function>}
 * @return {function}
 */
export default function combineReducers (reducers) {

  /**
   * Root reducer takes state and an action then reduces through each domain reducer
   * @param  {Object} state  Current state
   * @param  {Object} action Contains both a type and playload
   * @return {Object} new state
   */
  return function rootReduer (state, action) {
    return reducers.reduce((newState, domainReducer) => {
      const reducedState = domainReducer.func(state[key], action);

      // Check returned state
      if (!reducedState) {
        throw new Error(
          `ArcturusWorker: the reducer for the domain "${domainReducer.domain}" returned a falsely value, please correct`
        );
      }

      return {
        ...newState,
        [domainReducer.domain]: reducedState
      }
    }, state);
  }
}
