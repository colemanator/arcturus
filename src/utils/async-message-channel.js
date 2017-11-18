const MessageChannel = self.MessageChannel; // eslint-disable-line
const crypto = self.crypto; // eslint-disable-line

export default class AsyncMessageChannel {
  constructor (target) {
    this.channel = new MessageChannel();
    this.port = this.channel.port1;
    this.messages = new Map();
    this.target = target;

    this.port.onmessage = this.handleMessage.bind(this);
  }

  /**
   * Establish a connection with the target using MessageChannel
   * @return {Promise}
   */
  async establish () {
    const { channel, messages, target } = this;
    const id = this.getUuid();

    target.postMessage(id, [channel.port2]);

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
    port.postMessage(JSON.stringify({ id, data }), transferList);

    // Resolved on reply - see handleMessage
    return new Promise(resolve => messages.set(id, resolve));
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
 * Listens for a channel then uses the handler to respond to any messages sent over the channel
 * @param  {object} self current window or worker
 * @param  {function} given the data of the message
 * @return {undefined}
 */
export function handleAsyncMessageChannel (self, handler) {
  self.onmessage = msg => {
    if (msg.ports[0]) {
      const port = msg.ports[0];

      port.onmessage = async function workerHandleMessage (msg) {
        const { id, data } = JSON.parse(msg.data);
        let response = handler(data);

        if (Promise.resolve(response) === response) {
          response = await response;
        }

        port.postMessage(JSON.stringify({ id, response }));
      };

      port.postMessage(JSON.stringify({ id: msg.data }));
      self.onmessage = undefined;
    }
  };
}
