import { strict as assert } from 'node:assert';
import { createContext, Context, contextualize } from '../../build/index.js';

assert(typeof createContext === 'function');
assert(typeof Context === 'function');
assert(typeof contextualize === 'function');

console.log('MJS import test passed');

