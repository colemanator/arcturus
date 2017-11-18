const MessageChanel = self.MessageChanel; // eslint-disable-line
const crypto = self.crypto; // eslint-disable-line

export default class AsyncBridge {
  constructor (target) {
    this.chanel = new MessageChanel();
    this.port = this.chanel.port1;
    this.messages = new Map();
    this.target = target;

    this.port.onmessage = this.handleMessage.bind(this);
  }

  /**
   * Establish a connection with the target using MessageChanel
   * @return {Promise}
   */
  async establish () {
    const { chanel, messages, target } = this;
    const id = this.getUuid();

    target.postMessage(id, '*', [chanel.port2]);

    // Resolved on reply - see handleMessage
    return new Promise(resolve => messages.set(id, () => resolve(this)));
  }

  /**
   * Hanlde any incoming message on the port
   * @param  {object} msg
   * @return {undefined}
   */
  handleMessage (msg) {
    const { messages } = this;
    const { id, response } = JSON.parse(msg.data);

    if (messages.has(id)) {
      messages.get(id)(response);
      messages.delete(id);
    }
  }

  /**
   * Send a message, Promise resolves on reply
   * @param  {object} data
   * @param  {Array} list of transferables
   * @return {Promise}
   */
  async message (data, transferList) {
    const { port, messages } = this;
    const id = this.getUuid();
    port.postMessage({ id, data: this.prepareData(data) }, '*', transferList);

    // Resolved on reply - see handleMessage
    return new Promise(resolve => messages.set(id, resolve));
  }

  /**
   * @param  {object} data
   * @return {String}
   */
  prepareData (data) {
    if (typeof data === 'string') return data;
    return JSON.stringify(data);
  }

  /**
   * Return a universal unique identifier
   * @return {String}
   */
  getUuid () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}

/**
 * Listens for a chanel then uses the handler to respond to any messages sent over the chanel
 * @param  {object} self current window or worker
 * @param  {function} given the data of the message
 * @return {undefined}
 */
export function handleAsyncBridge (self, handler) {
  self.onmessage(msg => {
    if (msg.ports[0]) {
      msg.ports[0].onmessage = async msg => {
        const { id, data } = JSON.parse(msg);
        let response = handler(data);

        if (Promise.resolve(response) === response) {
          response = await response;
        }

        msg.ports[0].postMessage({ id, response });
      };

      self.onmessage = undefined;
    }
  });
}
