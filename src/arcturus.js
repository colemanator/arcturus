import { Comlink } from 'comlinkjs/comlink.es6.js';
import AsyncQueue from './lib/queue';

export default class Arcturus {
  /**
   * Takes a number of worker files and options and returns a new object linked to Arcturus
   * @param  {string} workerFiles url of the file
   * @param  {object} options
   * @return {object}
   */
  constructor (workerFiles, options) {
    this.workers = workerFiles.map(file => new Worker(file));
    this.actionQueue = new AsyncQueue(task => this.proccesAction(task));
    this.poxies = [];
    this.consumers = [];
  }

  /**
   * Establish a proxy to each WebWorker using a comlinkjs
   * @return {Promise} will resolve to true when all proxies have been established
   */
  async establishProxies () {
      const { workers } = this;

      this.proxies = await Promise.all(workers.map(worker => comlinkjs.proxy(worker)))
        .catch(err => console.error(err));

      this.schedualAction({});
  }

  /**
   * Handle a subscription
   * @param  {Function} callback called when state has changed
   * @return {boolean}           a boolean indicating the success of subscription
   */
  subscribe (callback) {
    const { consumers } = this;
    consumers.push(callback);
  }

  /**
   * handle an unSubscribe
   * @param  {Function} callback function to unSubscribe
   * @return {undefined}
   */
  unSubscribe (callback) {
    const { consumers } = this;
    this.consumers = consumers.filter(consumer => consumer !== callback);
  }

  /**
   * Notifies each consumer of the new state and passes the getState() function
   * @return {undefined}
   */
  notifyConsumers () {
    const { state, consumers } = this.state;
    consumers.forEach(consumer => consumer(() => this.getState()));
  }

  /**
   * Return the current state
   * @return {object} current state
   */
  getState () {
    return this.state;
  }

  /**
   * Proccess a task, determin what type of task then call the relivant function on the proxy
   * @param  {object}  task queued task
   * @return {Promise} resolves once all proxies have resolved
   */
  async proccesAction (task) {
    const { proxies, state } = this;

    // Send the action to each worker and wait for state
    const workerStates = await Promise.all(proxies.map(proxy => proxy.action(task.payload)));

    // consolidate state
    this.state = workerStates.reduce((state, workerState) => ({
      ...state,
      ...workerState
    }), {});

    // Notify consumers of new state
    this.notifyConsumers();
  }

  /**
   * Add an action to the taskQueue
   * @param  {object} action
   * @return {undefined}
   */
  schedualAction (action) {
    const { taskQueue } = this;
    taskQueue.schedual({
      type: ACTION,
      payload: { action }
    });
  }
}
