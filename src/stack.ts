export interface Stack<T = any> {
  data: Array<T>;
  add: (value: T) => void;
  remove: (value: T) => void;
  reset: () => void;
  to: (check: (value: T) => boolean) => T | null;
  prev: (value?: T) => T | null;
  next: (value: T) => T | null;
  last: () => T | null;
}

export const createStack = <T = any>(): Stack<T> => {
  const data: Array<T> = [];

  const add = (value: T) => {
    const index = data.indexOf(value);

    if (index === -1) {
      data.push(value);
    }
  };

  const remove = (value: T) => {
    const index = data.indexOf(value);

    if (index !== -1) {
      data.splice(index);
    }
  };

  const reset = () => {
    data.splice(0);
  };

  const to = (check: (value: T) => {}): T | null => {
    for (let index = data.length - 1; index >= 0; index -= 1) {
      const value = data[index];

      if (check(value)) {
        return value;
      }
    }

    return null;
  };

  const prev = (value?: T): T | null => {
    if (value) {
      const index = data.indexOf(value);

      return data[index - 1] || null;
    }

    return data[data.length - 2] || null;
  };

  const next = (value: T): T | null => {
    const index = data.indexOf(value);

    return data[index + 1] || null;
  };

  const last = (): T | null => {
    return data[data.length - 1] || null;
  };

  return { data, add, remove, reset, to, prev, next, last };
};
