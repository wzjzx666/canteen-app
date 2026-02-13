const Random = {
  guid() {
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return template.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  datetime() {
    const now = Date.now();
    const offset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    return new Date(now - offset).toISOString();
  },
};

const directiveHandlers = {
  '@guid': Random.guid,
  '@datetime': Random.datetime,
};

function wrapValue(value) {
  if (typeof value === 'string') {
    const handler = directiveHandlers[value];
    return handler ? handler() : value;
  }
  if (typeof value === 'function') {
    return value();
  }
  if (Array.isArray(value)) {
    return value.map((item) => wrapValue(item));
  }
  if (value && typeof value === 'object') {
    return wrapObject(value);
  }
  return value;
}

function wrapObject(template) {
  const output = {};
  Object.keys(template).forEach((key) => {
    output[key] = wrapValue(template[key]);
  });
  return output;
}

const Mock = {
  Random,
  mock(template) {
    if (typeof template === 'string') {
      return wrapValue(template);
    }
    if (Array.isArray(template)) {
      return template.map((item) => Mock.mock(item));
    }
    if (template && typeof template === 'object') {
      return wrapObject(template);
    }
    return template;
  },
};

export default Mock;
