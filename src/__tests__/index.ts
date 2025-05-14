import { createContext, Contextable, contextualize } from '../index';

describe('test', () => {
  it('Should create a context', async () => {
    const context = createContext();
    expect(context).toHaveProperty('contextualize');
    expect(context).toHaveProperty('getContext');
  });

  it('Should throw an error if context is not initialized', async () => {
    const context = createContext();
    expect(() => context.getContext()).toThrow();
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
    expect(action3).toHaveBeenCalled();
    expect(action2).not.toHaveBeenCalled();
    expect(action1).not.toHaveBeenCalled();

    await context.contextualize(value2, action2);
    expect(action2).toHaveBeenCalled();
    expect(action1).not.toHaveBeenCalled();
    await context.contextualize(value1, action1);
    expect(action1).toHaveBeenCalled();

  });

  it('Should mixin no class context', async () => {
    class Test extends Contextable() { }
    const test = new Test();
    const action = jest.fn(async () => {
      expect(Test.getContext()).toStrictEqual(test);
    });
    await test.contextualize(action);
    expect(action).toHaveBeenCalled();
  });

  it('Should mixin class context', async () => {
    class A {}
    class Test extends Contextable(A) { }
    const test = new Test();
    const action = jest.fn(async () => {
      expect(Test.getContext()).toStrictEqual(test);
    });
    await test.contextualize(action);
    expect(action).toHaveBeenCalled();
  });

  it('Should decorate only methods', async () => {
    const action = jest.fn(async () => {
      expect(Test.getContext()).toStrictEqual(test);
    });

    class Test extends Contextable() {
      @contextualize
      test: number = 10;

      @contextualize
      async run(): Promise<number> {
        await action();
        return 0;
      }
    }

    const test = new Test();
    const result = await test.run();
    expect(result).toEqual(0);
    expect(action).toHaveBeenCalled();
  });

  it('Should decorate methods separately', async () => {
    const action = jest.fn(async (expected: number) => {
      expect(Test.getContext().value).toStrictEqual(expected);
    });

    class Test extends Contextable() {
      constructor(
        public readonly value: number
      ){
        super();
      }
      @contextualize
      async run(value: number): Promise<number> {
        await action(value);
        return value;
      }
    }

    const testA = new Test(0);
    const testB = new Test(1);

    await expect(testA.run(0)).resolves.toEqual(0);
    expect(action).toHaveBeenCalled();
    await expect(testB.run(1)).resolves.toEqual(1);
    expect(action).toHaveBeenCalledTimes(2);
  });
});
