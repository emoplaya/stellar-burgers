// Встроенный демо-бэкенд с теми же ручками, что у API бургерной.
// Включается, когда настоящий API недоступен. Данные живут в localStorage браузера.
import { TOrder, TUser } from '@utils-types';
import { mockIngredients } from './ingredients';

type TStoredUser = TUser & { password: string };
type TDb = {
  users: Record<string, TStoredUser>;
  sessions: Record<string, string>; // токен -> email
  orders: (TOrder & { owner?: string })[];
  lastNumber: number;
};

const DB_KEY = 'stellar-burgers-demo-db';
const READY_AFTER_MS = 20000; // через сколько заказ из «Готовится» становится «Выполнен»

const ADJECTIVES: Record<string, string> = {
  'bun-02': 'Краторный',
  'bun-01': 'Флюоресцентный',
  'meat-01': 'био-марсианский',
  'meat-03': 'люминесцентный',
  'meat-02': 'бессмертный',
  'meat-04': 'метеоритный',
  mineral_rings: 'минеральный',
  sp_1: 'фалленианский',
  core: 'альфа-сахаридный',
  salad: 'экзо-плантаго',
  cheese: 'астероидный',
  'sauce-02': 'spicy',
  'sauce-04': 'space',
  'sauce-03': 'традиционный-галактический',
  'sauce-01': 'антарианский'
};

const byId = new Map(mockIngredients.map((item) => [item._id, item]));
const buns = mockIngredients.filter((i) => i.type === 'bun');
const fillings = mockIngredients.filter((i) => i.type !== 'bun');

const adjectiveOf = (id: string) => {
  const ingredient = byId.get(id);
  if (!ingredient) return '';
  const key = ingredient.image.split('/').pop()!.replace('.png', '');
  return ADJECTIVES[key] || '';
};

const burgerName = (ids: string[]) => {
  const unique = Array.from(new Set(ids));
  const bun = unique.find((id) => byId.get(id)?.type === 'bun');
  const rest = unique.filter((id) => id !== bun).slice(0, 3);
  const words = [bun, ...rest].filter(Boolean).map((id) => adjectiveOf(id!));
  const [first, ...other] = words.filter(Boolean);
  return [first, ...other, 'бургер'].filter(Boolean).join(' ');
};

const randomToken = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

// детерминированная лента, чтобы при первом заходе она не была пустой
const seedOrders = (): TDb['orders'] => {
  const now = Date.now();
  const orders: TDb['orders'] = [];
  let seed = 7;
  const rnd = (n: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.floor((seed / 233280) * n);
  };
  for (let i = 0; i < 24; i++) {
    const bun = buns[rnd(buns.length)];
    const count = 1 + rnd(4);
    const middle = Array.from(
      { length: count },
      () => fillings[rnd(fillings.length)]._id
    );
    const ingredients = [bun._id, ...middle, bun._id];
    const created = new Date(now - (i * 47 + rnd(30)) * 60000).toISOString();
    orders.push({
      _id: randomToken(),
      number: 52124 - i,
      name: burgerName(ingredients),
      ingredients,
      status: i < 3 ? 'pending' : 'done',
      createdAt: created,
      updatedAt: created
    });
  }
  return orders;
};

const loadDb = (): TDb => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // поврежденные данные - начинаем заново
  }
  const orders = seedOrders();
  return { users: {}, sessions: {}, orders, lastNumber: orders[0].number };
};

const saveDb = (db: TDb) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // приватный режим браузера - работаем без сохранения
  }
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

const fail = (message: string, status: number) =>
  json({ success: false, message }, status);

const issueTokens = (db: TDb, email: string) => {
  const accessToken = `Bearer demo.${randomToken()}`;
  const refreshToken = randomToken();
  db.sessions[accessToken] = email;
  db.sessions[refreshToken] = email;
  return { accessToken, refreshToken };
};

const publicUser = ({ email, name }: TStoredUser): TUser => ({ email, name });

// статус «Готовится» сменяется на «Выполнен» спустя немного времени
const withStatus = (order: TDb['orders'][number]): TOrder => {
  const { owner, ...rest } = order;
  const age = Date.now() - new Date(order.createdAt).getTime();
  if (order.status === 'pending' && owner && age > READY_AFTER_MS) {
    return { ...rest, status: 'done' };
  }
  return rest;
};

const isToday = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString();

export const handleMockRequest = async (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  const body = init.body ? JSON.parse(String(init.body)) : {};
  const db = loadDb();
  const auth = headers.get('authorization') || '';
  const currentEmail = db.sessions[auth];
  const currentUser = currentEmail ? db.users[currentEmail] : undefined;

  // имитация сети, чтобы были видны прелоадеры
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (path === '/ingredients' && method === 'GET') {
    return json({ success: true, data: mockIngredients });
  }

  if (path === '/orders/all' && method === 'GET') {
    const orders = db.orders.slice(0, 50).map(withStatus);
    return json({
      success: true,
      orders,
      total: db.lastNumber,
      totalToday: db.orders.filter((o) => isToday(o.createdAt)).length
    });
  }

  if (path === '/orders' && method === 'GET') {
    if (!currentUser) return fail('You should be authorised', 401);
    const orders = db.orders
      .filter((o) => o.owner === currentEmail)
      .map(withStatus)
      .reverse();
    return json({ success: true, orders, total: orders.length, totalToday: 0 });
  }

  if (path === '/orders' && method === 'POST') {
    if (!currentUser) return fail('You should be authorised', 401);
    const ingredients: string[] = body.ingredients || [];
    if (!ingredients.length || ingredients.some((id) => !byId.has(id))) {
      return fail('One or more ids provided are incorrect', 400);
    }
    const now = new Date().toISOString();
    db.lastNumber += 1;
    const order = {
      _id: randomToken(),
      number: db.lastNumber,
      name: burgerName(ingredients),
      ingredients,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      owner: currentEmail
    };
    db.orders.unshift(order);
    saveDb(db);
    return json({ success: true, name: order.name, order: withStatus(order) });
  }

  const orderMatch = path.match(/^\/orders\/(\d+)$/);
  if (orderMatch && method === 'GET') {
    const order = db.orders.find((o) => o.number === Number(orderMatch[1]));
    return json({ success: true, orders: order ? [withStatus(order)] : [] });
  }

  if (path === '/auth/register' && method === 'POST') {
    const { email, name, password } = body;
    if (!email || !name || !password) {
      return fail('Email, password and name are required fields', 403);
    }
    if (db.users[email]) return fail('User already exists', 403);
    db.users[email] = { email, name, password };
    const tokens = issueTokens(db, email);
    saveDb(db);
    return json({ success: true, user: { email, name }, ...tokens });
  }

  if (path === '/auth/login' && method === 'POST') {
    const user = db.users[body.email];
    if (!user || user.password !== body.password) {
      return fail('email or password are incorrect', 401);
    }
    const tokens = issueTokens(db, user.email);
    saveDb(db);
    return json({ success: true, user: publicUser(user), ...tokens });
  }

  if (path === '/auth/token' && method === 'POST') {
    const email = db.sessions[body.token];
    if (!email) return fail('Token is invalid', 401);
    delete db.sessions[body.token];
    const tokens = issueTokens(db, email);
    saveDb(db);
    return json({ success: true, ...tokens });
  }

  if (path === '/auth/logout' && method === 'POST') {
    delete db.sessions[body.token];
    saveDb(db);
    return json({ success: true, message: 'Successful logout' });
  }

  if (path === '/auth/user' && method === 'GET') {
    if (!currentUser) return fail('You should be authorised', 401);
    return json({ success: true, user: publicUser(currentUser) });
  }

  if (path === '/auth/user' && method === 'PATCH') {
    if (!currentUser) return fail('You should be authorised', 401);
    const updated = { ...currentUser, ...body };
    if (body.email && body.email !== currentEmail) {
      if (db.users[body.email]) {
        return fail('User with such email already exists', 403);
      }
      delete db.users[currentEmail];
      Object.keys(db.sessions).forEach((token) => {
        if (db.sessions[token] === currentEmail)
          db.sessions[token] = body.email;
      });
    }
    db.users[updated.email] = updated;
    saveDb(db);
    return json({ success: true, user: publicUser(updated) });
  }

  if (path === '/password-reset' && method === 'POST') {
    return json({ success: true, message: 'Reset email sent' });
  }

  if (path === '/password-reset/reset' && method === 'POST') {
    return json({ success: true, message: 'Password successfully reset' });
  }

  return fail('Not found', 404);
};
