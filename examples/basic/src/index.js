import { Arcturus } from 'arcturus';

// Create the store and pass in the location of the worker file(s)
const store = new Arcturus(['/dist/worker.js']);

// Here we sstablish a connection with the workers
store.establishConnection().then(() => {
  // Subscribe for any changes, this can be done anytime after we create the store
  store.subscribe(getState => {
    console.log(getState());
  });

  // Schedule an action to be processed
  store.dispatch({ type: 'increment' });
});
