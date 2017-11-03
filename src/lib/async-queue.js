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
    this.processor = processor;
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
    const { status, queue, processor } = this;
    if (status === IDLE) {
      this.status = ACTIVE;
      while (queue.length) {
        await processor(queue.shift());
      }

      this.status = IDLE;
    }
  }
}
