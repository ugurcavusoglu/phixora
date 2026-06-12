// Frontend-only mock auth — no backend required.
// Users are stored in localStorage under "phixora_users".
// The "token" is the user's id (a UUID).

type StoredUser = { id: string; name: string; email: string; password: string };

const USERS_KEY = 'phixora_users';
const ME_KEY = 'phixora_me';

const getUsers = (): StoredUser[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const register = (name: string, email: string, password: string) => {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return Promise.reject({ response: { data: { message: 'An account with this email already exists.' } } });
  }
  const user: StoredUser = { id: crypto.randomUUID(), name, email, password };
  saveUsers([...users, user]);
  localStorage.setItem(ME_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  return Promise.resolve({ data: { access_token: user.id } });
};

export const login = (email: string, password: string) => {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return Promise.reject(new Error('Invalid email or password.'));
  localStorage.setItem(ME_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  return Promise.resolve({ data: { access_token: user.id } });
};

export const getMe = () => {
  const raw = localStorage.getItem(ME_KEY);
  if (!raw) return Promise.reject(new Error('Not authenticated'));
  return Promise.resolve({ data: JSON.parse(raw) as { id: string; name: string; email: string } });
};
