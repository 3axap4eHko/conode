import { AsyncLocalStorage } from 'node:async_hooks';

export type Fn<T extends unknown[], R> = (...args: T) => R;

export const createContext = <T>() => {
  const storage = new AsyncLocalStorage<{ context: T }>();
  return {
    contextualize<R>(context: T, callback: Fn<[], R>): R {
      return storage.run({ context }, callback);
    },
    getContext() {
      const store = storage.getStore();
      if (!store) {
        throw new Error('Context not initialized');
      }
      return store.context;
    }
  };
};

type Constructor = new (...args: any) => any;

export interface Contextualized {
  contextualize<R>(callback: Fn<[], R>): Promise<R>;
}

export function Contextable(BaseClass: Constructor = class { }) {
  const context = createContext();
  return class Contextual extends BaseClass {
    static getContext<C extends Constructor>(this: C) {
      return context.getContext() as InstanceType<C>;
    }
    constructor(...args: unknown[]) {
      super(...args);
    }

    contextualize<R>(callback: Fn<[], R>): R {
      return context.contextualize(this, callback);
    }
  };
}

export function contextualize<T extends Contextualized, K extends keyof T>(...args: unknown[]) {
  const [, , descriptor] = args as [T, K, TypedPropertyDescriptor<T[K]>];
  const property = descriptor?.value;
  if (typeof property === 'function') {
    descriptor.value = function(this: Contextualized, ...args: unknown[]) {
      return this.contextualize(() => property.apply(this, args));
    } as T[K];
  }
}

