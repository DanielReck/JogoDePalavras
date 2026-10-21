(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AuraRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalizeWord(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase();
  }

  function getDailyWord(dateStr, wordBank) {
    if (!wordBank?.length) return { word: 'AURAS', category: 'memes aurudos' };
    const hash = [...dateStr].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7);
    return wordBank[hash % wordBank.length];
  }

  function evaluateGuess(guess, answer) {
    const normalizedGuess = normalizeWord(guess);
    const normalizedAnswer = normalizeWord(answer);
    if (normalizedGuess.length !== normalizedAnswer.length) {
      throw new Error('Guess and answer must have the same length.');
    }

    const result = Array(normalizedAnswer.length).fill('absent');
    const remaining = {};

    for (let i = 0; i < normalizedAnswer.length; i++) {
      if (normalizedGuess[i] === normalizedAnswer[i]) result[i] = 'correct';
      else remaining[normalizedAnswer[i]] = (remaining[normalizedAnswer[i]] || 0) + 1;
    }

    for (let i = 0; i < normalizedAnswer.length; i++) {
      if (result[i] === 'correct') continue;
      const letter = normalizedGuess[i];
      if ((remaining[letter] || 0) > 0) {
        result[i] = 'present';
        remaining[letter]--;
      }
    }
    return result;
  }

  return { normalizeWord, getDailyWord, evaluateGuess };
});
