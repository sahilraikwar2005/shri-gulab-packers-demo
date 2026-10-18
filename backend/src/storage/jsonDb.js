const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
const locks = new Map();
const cache = new Map();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function lock(collection) {
  if (!locks.has(collection)) locks.set(collection, Promise.resolve());
  const prev = locks.get(collection);
  let resolve;
  const next = new Promise((r) => (resolve = r));
  locks.set(collection, next);
  return prev.then(() => resolve);
}

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

async function read(collection) {
  if (cache.has(collection)) return cache.get(collection);
  await ensureDir();
  let data = [];
  try {
    const raw = await fs.readFile(filePath(collection), 'utf8');
    data = raw.trim() ? JSON.parse(raw) : [];
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    data = [];
  }
  cache.set(collection, data);
  return data;
}

async function write(collection, data) {
  const release = await lock(collection);
  try {
    await ensureDir();
    cache.set(collection, data);
    const tmp = filePath(collection) + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, filePath(collection));
  } finally {
    release();
  }
}

function getByPath(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setByPath(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function coerceQueryValue(docVal, qVal) {
  if (docVal === null || docVal === undefined) return qVal;
  if (typeof docVal === 'boolean' && typeof qVal === 'string') {
    if (qVal === 'true') return true;
    if (qVal === 'false') return false;
  }
  if (typeof docVal === 'number' && typeof qVal === 'string' && !isNaN(Number(qVal))) {
    return Number(qVal);
  }
  return qVal;
}

function matchCondition(docVal, condition) {
  if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
    if (condition.$regex !== undefined) {
      const re = new RegExp(condition.$regex, condition.$options || 'i');
      return docVal != null && re.test(String(docVal));
    }
    if (condition.$gt !== undefined) return docVal > condition.$gt;
    if (condition.$gte !== undefined) return docVal >= condition.$gte;
    if (condition.$lt !== undefined) return docVal < condition.$lt;
    if (condition.$lte !== undefined) return docVal <= condition.$lte;
    if (condition.$ne !== undefined) return docVal !== condition.$ne;
    if (condition.$in !== undefined) return condition.$in.includes(docVal);
    // nested object exact
  }
  return docVal === coerceQueryValue(docVal, condition);
}

function matches(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, val] of Object.entries(query)) {
    if (key === '$or') {
      if (!Array.isArray(val) || !val.some((q) => matches(doc, q))) return false;
      continue;
    }
    if (key === '$and') {
      if (!Array.isArray(val) || !val.every((q) => matches(doc, q))) return false;
      continue;
    }
    const docVal = getByPath(doc, key);
    if (!matchCondition(docVal, val)) return false;
  }
  return true;
}

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date || b instanceof Date) {
    const ad = a instanceof Date ? a.getTime() : Date.parse(a);
    const bd = b instanceof Date ? b.getTime() : Date.parse(b);
    return ad - bd;
  }
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

function sortData(data, sortSpec) {
  if (!sortSpec) return data;
  const entries = sortSpec instanceof Map ? [...sortSpec.entries()] : Object.entries(sortSpec);
  if (!entries.length) return data;
  return [...data].sort((a, b) => {
    for (const [field, dir] of entries) {
      const cmp = compareValues(getByPath(a, field), getByPath(b, field));
      const d = Number(dir) >= 0 ? (Number(dir) || 1) : -1;
      if (cmp !== 0) return cmp * d;
    }
    return 0;
  });
}

const db = {
  async list(collection, query = {}, opts = {}) {
    let data = await read(collection);
    let filtered = data.filter((d) => matches(d, query));
    filtered = sortData(filtered, opts.sort);
    const total = filtered.length;
    const page = opts.page ? Number(opts.page) : null;
    const limit = opts.limit ? Number(opts.limit) : null;
    if (limit) {
      const skip = page ? (page - 1) * limit : (opts.skip ? Number(opts.skip) : 0);
      filtered = filtered.slice(skip, skip + limit);
    } else if (opts.skip) {
      filtered = filtered.slice(Number(opts.skip));
    }
    return { data: filtered.map((d) => JSON.parse(JSON.stringify(d))), total };
  },
  async findById(collection, id) {
    const data = await read(collection);
    const found = data.find((d) => String(d._id) === String(id));
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
  async findOne(collection, query) {
    const { data } = await db.list(collection, query, { limit: 1 });
    return data[0] || null;
  },
  async create(collection, data) {
    const all = await read(collection);
    const now = new Date().toISOString();
    const doc = { _id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...data };
    all.push(doc);
    await write(collection, all);
    return JSON.parse(JSON.stringify(doc));
  },
  async update(collection, id, patch) {
    const all = await read(collection);
    const idx = all.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;
    const now = new Date().toISOString();
    all[idx] = { ...all[idx], ...patch, updatedAt: now };
    await write(collection, all);
    return JSON.parse(JSON.stringify(all[idx]));
  },
  async remove(collection, id) {
    const all = await read(collection);
    const idx = all.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return false;
    all.splice(idx, 1);
    await write(collection, all);
    return true;
  },
  async count(collection, query = {}) {
    const data = await read(collection);
    return data.filter((d) => matches(d, query)).length;
  },
};

module.exports = db;