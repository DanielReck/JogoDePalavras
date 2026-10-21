const assert = require('node:assert/strict');
const { normalizeWord, getDailyWord, evaluateGuess } = require('../rules.js');

assert.equal(normalizeWord('Lápis!'), 'LAPIS');
assert.deepEqual(evaluateGuess('CAMPO', 'CAMPO'), ['correct','correct','correct','correct','correct']);
assert.deepEqual(evaluateGuess('MASSA', 'MANGA'), ['correct','correct','absent','absent','correct']);
assert.deepEqual(evaluateGuess('AURAS', 'AURAS'), ['correct','correct','correct','correct','correct']);

const bank = [
  { word: 'SIGMA', category: 'memes aurudos' },
  { word: 'CAMPO', category: 'esportes' },
  { word: 'NUVEM', category: 'natureza' }
];
const first = getDailyWord('2026-10-21', bank);
const second = getDailyWord('2026-10-21', bank);
assert.deepEqual(first, second, 'daily word must be deterministic for the same date and bank');

console.log('rules tests passed');
