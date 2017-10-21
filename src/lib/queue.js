// arcturus status types
const ACTIVE = 'active';
const IDLE = 'idle';

export default class AsyncQueue {
  /**
   * Create an AsyncQueue
   * @param  {function} processor function to handle each item in the queue
   * @return {object}
   */
  constructor (processor) {
    this.queue = [];
    this.status = IDLE;
    this.processor = proccessor;
  }

  /**
   * schedual an item onto the queue to be processed at a later time
   * @param  {any} item
   * @return {undefined}
   */
  schedual (item) {
    const { queue } = this;
    queue.push(item);
    this.proccessQueue();
  }

  /**
   * Process each item in the queue one at a time async
   * @return {Promise}
   */
  async proccessQueue () {
    const { state, queue, processor } = this;
    if (state === IDLE) {
      this.state = ACTIVE;
      while (queue.length) {
        await processor(queue.shift());
      }

      this.state = IDLE;
    }
  }
}
