// in-memory user store
const users = new Map();

function addUser(id, username) {
  users.set(id, { id, username });
}

function removeUser(id) {
  users.delete(id);
}

function getUser(id) {
  return users.get(id);
}

function listUsers() {
  return Array.from(users.values());
}

module.exports = { addUser, removeUser, getUser, listUsers };
