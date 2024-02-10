import { randomUUID } from 'crypto';

const db = [
  {
    id: '4cefe3cb-a2de-4db9-860d-9a1718653818',
    text: 'hi',
    username: 'vasya',
  },
  {
    id: '5cefe3cb-a2de-4db9-860d-9a1718653818',
    text: '^_^',
    username: 'petya',
  },
];

const messageRepo = {
  getAll: async () => Promise.resolve(db),
  add: async (message) => {
    const newMessage = { id: randomUUID(), ...message };
    db.push(newMessage);
    return Promise.resolve(newMessage);
  },
};

export { db, messageRepo };
