// in-memory messages store (simple ring buffer)
const MAX = 100;
const messages = [];

function addMessage(msg) {
  messages.push(msg);
  if (messages.length > MAX) messages.shift();
}

function listMessages() {
  return messages.slice();
}

module.exports = { addMessage, listMessages };
