const { strict: assert } = require('node:assert');
const { createContext, Context, contextualize } = require('../../build/index.cjs');

assert(typeof createContext === 'function');
assert(typeof Context === 'function');
assert(typeof contextualize === 'function');

console.log('CJS import test passed');

