import { createArcturusWorker, transformDomains } from 'arcturus';

// Initial state of this reducer's domain
const initialState = {
  count: 1
};

/**
 * Takes current state and action and returns new state
 * @param  {object|undefined} [state=initialState] current state (domain)
 * @param  {object} action
 * @return {object}
 */
function reducer (state = initialState, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

/**
 * Return a selection of the state (domain)
 * @param  {object} state
 * @return {any}
 */
function selector (state) {
  return state;
}

// domains
const domains = {
  example: {
    reducer,
    selector
  }
};

createArcturusWorker(...transformDomains(domains));
