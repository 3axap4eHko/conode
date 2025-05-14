const { strict: assert } = require('node:assert');
const { createContext, Contextable, contextualize } = require('../../build/index.cjs');

assert(typeof createContext === 'function');
assert(typeof Contextable === 'function');
assert(typeof contextualize === 'function');

console.log('CJS import test passed');

