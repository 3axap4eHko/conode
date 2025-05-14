import { AsyncLocalStorage } from 'node:async_hooks';

export type Callback = (...args: unknown[]) => PromiseLike<unknown> | unknown;

export const createContext = <T>() => {
  const storage = new AsyncLocalStorage<T>();

  return {
    contextualize(value: T, callback: Callback) {
      return storage.run(value, callback);
    },
    getContext() {
      return storage.getStore();
    }
  };
};

type Constructor = new (...args: unknown[]) => object;

export function Context(BaseClass: Constructor = class { }) {
  const context = createContext();
  return class Contextual extends BaseClass {
    static get context() {
      return context.getContext();
    }

    async contextualize(callback: Callback) {
      return context.contextualize(this, callback);
    }
  };
}

export interface Contextualized {
  contextualize(callback: Callback): Promise<any>;
}

export function contextualize<T extends Contextualized, K extends keyof T>(target: T, _: K, descriptor: PropertyDescriptor) {
  const property = descriptor.value;
  if (typeof property === 'function') {
    const method = property?.bind(target);
    if (method) {
      function contextualized<A extends unknown[]>(...args: A) {
        return target.contextualize(() => method.apply(null, args));
      };
      descriptor.value = contextualized as T[K];
    }
  }
}

