import { createContext, Context, contextualize } from '../index';

describe('test', () => {
  it('Should create a context', async () => {
    const context = createContext();
    expect(context).toHaveProperty('contextualize');
    expect(context).toHaveProperty('getContext');
  });

  it('Should execute in the context', async () => {
    const context = createContext();
    const value1 = { test: 1 };
    const value2 = { test: 1 };
    const error = new Error();

    const action1 = jest.fn(async () => {
      expect(context.getContext()).toStrictEqual(value1);
    });
    const action2 = jest.fn(async () => {
      expect(context.getContext()).toStrictEqual(value2);
    });

    const action3 = jest.fn(async () => {
      throw error;
    });
    expect(context.contextualize(value2, action3)).rejects.toStrictEqual(error);
    expect(action3).toBeCalled();
    expect(action2).not.toBeCalled();
    expect(action1).not.toBeCalled();

    await context.contextualize(value2, action2);
    expect(action2).toBeCalled();
    expect(action1).not.toBeCalled();
    await context.contextualize(value1, action1);
    expect(action1).toBeCalled();

  });

  it('Should mixin no class context', async () => {
    class Test extends Context() { }
    const test = new Test();
    const action = jest.fn(async () => {
      expect(Test.context).toStrictEqual(test);
    });
    await test.contextualize(action);
    expect(action).toBeCalled();
  });

  it('Should mixin class context', async () => {
    class A {}
    class Test extends Context(A) { }
    const test = new Test();
    const action = jest.fn(async () => {
      expect(Test.context).toStrictEqual(test);
    });
    await test.contextualize(action);
    expect(action).toBeCalled();
  });

  it('Should decorate method', async () => {
    const action = jest.fn(async () => {
      expect(Test.context).toStrictEqual(test);
    });

    class Test extends Context() {

      @contextualize
      async run() {
        await action();
      }
    }

    const test = new Test();
    await test.run();
    expect(action).toBeCalled();
  });
});
