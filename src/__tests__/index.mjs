import { strict as assert } from 'node:assert';
import { createContext, Contextable, contextualize } from '../../build/index.js';

assert(typeof createContext === 'function');
assert(typeof Contextable === 'function');
assert(typeof contextualize === 'function');

console.log('MJS import test passed');

