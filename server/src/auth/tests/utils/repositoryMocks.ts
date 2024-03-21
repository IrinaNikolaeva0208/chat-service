const db: { username: string; provider?: string; password?: string }[] = [
  {
    username: 'vasya',
    provider: 'google',
  },
  {
    username: 'petya',
    password: '$2b$10$O1qx5fBCPUhwOLlknQKaU.FOFh6mXWV8TwZatErbNh6SGfu/WJfJG',
  },
];

const userRepo = {
  create: async (user) => {
    db.push(user);
    return user;
  },
  findByUsername: async (username: string) => {
    return db.find((item) => item.username == username) || null;
  },
};

export { db, userRepo };
