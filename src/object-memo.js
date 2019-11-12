export const createMemo = (parent = null) => {
  const data = {};
  const add = (key, value) => {
    if (!data[key]) {
      data[key] = [];
    }

    if (data[key].indexOf(value) === -1) {
      data[key].push(value);
    }

    if (parent) {
      parent.add(key, value);
    }
  };
  const get = key => {
    return data[key] || null;
  };

  return { add, get };
};
