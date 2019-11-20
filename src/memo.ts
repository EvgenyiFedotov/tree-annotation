export interface Memo<T = any> {
  add: (key: string, value: T) => void;
  get: (key: string) => T | any;
}

export const createMemo = <T = any>(parent: Memo | null = null): Memo => {
  const data: { [propName: string]: Array<T> } = {};

  const add = (key: string, value: T): void => {
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

  const get = (key: string) => {
    return data[key] || null;
  };

  return { add, get };
};
