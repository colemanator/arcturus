# Arcturus
Manages state in worker threads through simple actions, reducers and selectors.

While using [Redux](https://github.com/reactjs/redux) I realised that your view and your state are decoupled enough that they could be placed in separate threads. Actions are scheduled and sent across to workers which like in Redux reduce the state before sending back the new state.

## Status
This project is in Alpha stage and should really only be used by contributors.

## Install
`yarn add arcturus` or `npm install arcturus`

## Usage
In your main thread
```js
import { Arcturus } from 'arcturus';

// Create the store and pass in the location of the worker file(s)
const store = new Arcturus(['/dist/worker.js']);

// Here we sstablish a connection with the workers
store.establishConnection().then(() => {

  // Subscribe for any changes, this can be done anytime after we create the store
  store.subscribe(getState => {
    console.log(getState());
  })

  // Schedule an action to be processed
  store.dispatch({ type: 'increment' })
});
```

In a separate worker thread
```js
import { createArcturusWorker, transformDomains } from 'arcturus';

// Initial state of this reducer's domain
const initialState = {
  count: 1
}

/**
 * Takes current state and action and returns new state
 * @param  {object|undefined} [state=initialState] current state (domain)
 * @param  {object} action
 * @return {object}
 */
function reducer (state = initialState, action) {
  switch(action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  };
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
}

createArcturusWorker(...transformDomains(domains));
```

## contributing
If you would like to contrubite please let me know or just createa PR this project is still in it's early stages.
For Direction please see the roadmap section below.

* Use git-flow

## Roadmap to release

1. Write tests
2. Docs
3. alpha
4. publish to npm
5. beta
6. release

## Future work
1. middleware
