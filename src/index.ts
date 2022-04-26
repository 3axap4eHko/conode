import { AsyncLocalStorage } from 'async_hooks';

export type Callback = () => any;

export const createContext = <T>() => {
  const storage = new AsyncLocalStorage<T>();

  return {
    contextualize(value: T, callback: Callback) {
      return new Promise<void>((resolve, reject) => {
        storage.run(value, async () => {
          try {
            await callback();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    },
    getContext() {
      return storage.getStore();
    }
  };
};

type Constructor = new (...args: any[]) => {};

export function Context(Base?: Constructor) {
  const context = createContext();

  return Base
    ? class Contextual extends Base {
      static get context() {
        return context.getContext();
      }

      async contextualize(callback: Callback) {
        return context.contextualize(this, callback);
      }
    }
    : class Contextual {
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

export function contextualize<T extends Contextualized>(target: T, _: string, descriptor: TypedPropertyDescriptor<Callback>) {
  const method = descriptor.value!;
  function contextualized() {
    return target.contextualize(() => method.apply(this, arguments));
  };
  descriptor.value = contextualized as any;
}
