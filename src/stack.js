export const createStack = () => {
  const stack = [];

  const add = value => {
    const index = stack.indexOf(value);

    if (index === -1) {
      stack.push(value);
    }
  };

  const remove = value => {
    const index = stack.indexOf(value);

    if (index !== -1) {
      stack.splice(index);
    }
  };

  const reset = () => {
    stack.splice(0);
  };

  const to = (check = () => true) => {
    for (let index = stack.length - 1; index >= 0; index -= 1) {
      const value = stack[index];

      if (check(value)) {
        return value;
      }
    }
  };

  const prev = value => {
    if (value) {
      const index = stack.indexOf(value);

      return stack[index - 1] || null;
    } else {
      return stack[stack.length - 2] || null;
    }
  };

  const next = value => {
    const index = stack.indexOf(value);

    return stack[index + 1] || null;
  };

  const last = () => {
    return stack[stack.length - 1];
  };

  return { stack, add, remove, reset, to, prev, next, last };
};
