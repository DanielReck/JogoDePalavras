(() => {
  const { normalizeWord, getDailyWord, evaluateGuess } = window.AuraRules;
  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;
  const PRODUCT_TIME_ZONE = 'America/Sao_Paulo';
  const STATS_KEY = 'auraWord.stats.v1';
  const GAME_PREFIX = 'auraWord.game.';

  const wordBank = (window.WORD_BANK || [])
    .map(item => ({ ...item, word: normalizeWord(item.word) }))
    .filter(item => item.word.length === WORD_LENGTH);

  const validWords = new Set(wordBank.map(item => item.word));

  const views = {
    home: document.getElementById('homeView'),
    game: document.getElementById('gameView'),
    result: document.getElementById('resultView')
  };

  const el = Object.fromEntries([
    'homeCategory','homeStreak','homeWins','homeRate','gameCategory','attemptCount','message','board','keyboard',
    'resultIcon','resultTitle','resultMessage','answerWord','resultStreak','bestStreak','totalWins','winRate','nextDayText',
    'dialogStreak','dialogBest','dialogGames','dialogRate','dialogLastWord','statsDialog'
  ].map(id => [id, document.getElementById(id)]));

  const today = getProductDate();
  const daily = getDailyWord(today, wordBank);
  const stats = loadStats();
  let game = loadGame(today) || {
    date: today,
    answer: daily.word,
    category: daily.category,
    guesses: [],
    evaluations: [],
    status: 'playing',
    finalized: false
  };
  let currentInput = '';

  init();

  function init() {
    el.homeCategory.textContent = game.category;
    el.gameCategory.textContent = game.category;
    renderStats();
    buildBoard();
    buildKeyboard();
    restoreGame();
    bindEvents();
    routeFromHash();
  }

  function getProductDate(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: PRODUCT_TIME_ZONE,
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const map = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* fallback em memória */ }
  }

  function loadStats() {
    const fallback = { currentStreak: 0, bestStreak: 0, wins: 0, games: 0, lastPlayedDate: null, lastSolvedWord: null, history: [] };
    try { return { ...fallback, ...JSON.parse(safeGet(STATS_KEY) || '{}') }; } catch { return fallback; }
  }

  function loadGame(date) {
    try {
      const parsed = JSON.parse(safeGet(GAME_PREFIX + date) || 'null');
      if (!parsed || parsed.answer !== daily.word) return null;
      return parsed;
    } catch { return null; }
  }

  function persistGame() {
    safeSet(GAME_PREFIX + today, JSON.stringify(game));
  }
  function persistStats() {
    safeSet(STATS_KEY, JSON.stringify(stats));
  }

  function buildBoard() {
    el.board.innerHTML = '';
    for (let r = 0; r < MAX_GUESSES; r++) {
      const row = document.createElement('div');
      row.className = 'board-row';
      row.dataset.row = r;
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.col = c;
        tile.setAttribute('aria-label', `Tentativa ${r + 1}, posição ${c + 1}, vazia`);
        row.appendChild(tile);
      }
      el.board.appendChild(row);
    }
  }

  function buildKeyboard() {
    const rows = [...el.keyboard.querySelectorAll('.key-row')];
    rows.forEach((row, index) => {
      const letters = row.dataset.row.split('');
      row.innerHTML = '';
      if (index === 2) row.appendChild(makeKey('ENTER', 'Enviar tentativa', true));
      letters.forEach(letter => row.appendChild(makeKey(letter, `Letra ${letter}`)));
      if (index === 2) row.appendChild(makeKey('BACKSPACE', 'Apagar letra', true, '⌫'));
    });
  }

  function makeKey(value, label, wide = false, display = value) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `key${wide ? ' key--wide' : ''}`;
    button.dataset.key = value;
    button.textContent = display;
    button.setAttribute('aria-label', label);
    return button;
  }

  function bindEvents() {
    document.getElementById('startBtn').addEventListener('click', () => showView(game.status === 'playing' ? 'game' : 'result'));
    document.getElementById('homeBtn').addEventListener('click', () => showView('home'));
    document.getElementById('backHomeBtn').addEventListener('click', () => showView('home'));
    document.getElementById('shareBtn').addEventListener('click', shareResult);
    document.getElementById('statsBtn').addEventListener('click', openStats);
    el.keyboard.addEventListener('click', event => {
      const key = event.target.closest('[data-key]');
      if (key) handleKey(key.dataset.key);
    });
    window.addEventListener('keydown', event => {
      if (views.game.classList.contains('view--active') && game.status === 'playing') {
        if (/^[a-zA-Z]$/.test(event.key)) handleKey(event.key.toUpperCase());
        else if (event.key === 'Enter') handleKey('ENTER');
        else if (event.key === 'Backspace') handleKey('BACKSPACE');
      }
    });
    window.addEventListener('hashchange', routeFromHash);
  }

  function routeFromHash() {
    const route = location.hash.replace('#','');
    if (route === 'game') showView(game.status === 'playing' ? 'game' : 'result', false);
    else if (route === 'result' && game.status !== 'playing') showView('result', false);
    else showView('home', false);
  }

  function showView(name, updateHash = true) {
    Object.entries(views).forEach(([key, node]) => node.classList.toggle('view--active', key === name));
    if (updateHash) history.replaceState(null, '', `#${name}`);
    if (name === 'game') renderCurrentInput();
    if (name === 'result') renderResult();
    document.querySelector('main').focus?.();
  }

  function handleKey(key) {
    clearMessage();
    if (game.status !== 'playing') return;
    if (key === 'BACKSPACE') {
      currentInput = currentInput.slice(0, -1);
    } else if (key === 'ENTER') {
      submitGuess();
      return;
    } else if (/^[A-Z]$/.test(key) && currentInput.length < WORD_LENGTH) {
      currentInput += key;
    }
    renderCurrentInput();
  }

  function renderCurrentInput() {
    const rowIndex = game.guesses.length;
    const row = el.board.querySelector(`[data-row="${rowIndex}"]`);
    if (!row) return;
    [...row.children].forEach((tile, index) => {
      const letter = currentInput[index] || '';
      tile.firstChild?.remove?.();
      tile.textContent = letter;
      tile.dataset.filled = Boolean(letter);
      tile.setAttribute('aria-label', `Tentativa ${rowIndex + 1}, posição ${index + 1}${letter ? `, letra ${letter}` : ', vazia'}`);
    });
    el.attemptCount.textContent = Math.min(rowIndex + 1, MAX_GUESSES);
  }

  function submitGuess() {
    const guess = normalizeWord(currentInput);
    if (guess.length !== WORD_LENGTH) return setMessage(`Digite ${WORD_LENGTH} letras.`);
    if (!validWords.has(guess)) return setMessage('Palavra não está no banco permitido. Tente outra.');
    if (game.guesses.includes(guess)) return setMessage('Você já tentou essa palavra.');

    const evaluation = evaluateGuess(guess, game.answer);
    game.guesses.push(guess);
    game.evaluations.push(evaluation);
    currentInput = '';
    paintRow(game.guesses.length - 1, guess, evaluation);
    updateKeyboard(guess, evaluation);

    if (guess === game.answer) game.status = 'won';
    else if (game.guesses.length >= MAX_GUESSES) game.status = 'lost';

    persistGame();

    if (game.status !== 'playing') {
      finalizeGame();
      setTimeout(() => showView('result'), 320);
    } else {
      el.attemptCount.textContent = game.guesses.length + 1;
      renderCurrentInput();
    }
  }

  function paintRow(rowIndex, guess, evaluation, animate = true) {
    const row = el.board.querySelector(`[data-row="${rowIndex}"]`);
    [...row.children].forEach((tile, index) => {
      const status = evaluation[index];
      const symbol = status === 'correct' ? '✓' : status === 'present' ? '•' : '×';
      const label = status === 'correct' ? 'correta e na posição certa' : status === 'present' ? 'presente em outra posição' : 'ausente da palavra';
      tile.textContent = guess[index];
      tile.dataset.filled = 'true';
      tile.classList.add(`tile--${status}`);
      if (animate) tile.classList.add('revealed');
      const marker = document.createElement('small');
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = symbol;
      tile.appendChild(marker);
      tile.setAttribute('aria-label', `Letra ${guess[index]}: ${label}`);
    });
  }

  function updateKeyboard(guess, evaluation) {
    const rank = { absent: 1, present: 2, correct: 3 };
    [...guess].forEach((letter, index) => {
      const key = el.keyboard.querySelector(`[data-key="${letter}"]`);
      const next = evaluation[index];
      const current = key?.dataset.status;
      if (key && (!current || rank[next] > rank[current])) {
        key.dataset.status = next;
        key.classList.remove('key--absent','key--present','key--correct');
        key.classList.add(`key--${next}`);
      }
    });
  }

  function restoreGame() {
    game.guesses.forEach((guess, index) => {
      const evaluation = game.evaluations[index] || evaluateGuess(guess, game.answer);
      paintRow(index, guess, evaluation, false);
      updateKeyboard(guess, evaluation);
    });
    el.attemptCount.textContent = Math.min(game.guesses.length + 1, MAX_GUESSES);
  }

  function finalizeGame() {
    if (game.finalized) return;
    game.finalized = true;
    stats.games += 1;
    if (game.status === 'won') {
      stats.wins += 1;
      stats.lastSolvedWord = game.answer;
    }

    if (stats.lastPlayedDate === today) {
      // já contado para esta data
    } else {
      const yesterday = shiftDate(today, -1);
      stats.currentStreak = stats.lastPlayedDate === yesterday ? stats.currentStreak + 1 : 1;
      stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
      stats.lastPlayedDate = today;
    }

    stats.history = [...(stats.history || []), { date: today, status: game.status, guesses: game.guesses.length }].slice(-30);
    persistStats();
    persistGame();
    renderStats();
  }

  function shiftDate(dateStr, delta) {
    const [y,m,d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + delta, 12));
    return date.toISOString().slice(0,10);
  }

  function renderResult() {
    const won = game.status === 'won';
    el.resultIcon.textContent = won ? '✦' : '↻';
    el.resultTitle.textContent = won ? 'Mandou bem!' : 'Quase!';
    el.resultMessage.textContent = won
      ? `Você acertou em ${game.guesses.length} ${game.guesses.length === 1 ? 'tentativa' : 'tentativas'}.`
      : 'As 6 tentativas acabaram. Amanhã tem uma nova palavra.';
    el.answerWord.textContent = game.answer;
    el.nextDayText.textContent = 'Novo desafio à meia-noite no horário de Brasília.';
    renderStats();
  }

  function renderStats() {
    const rate = stats.games ? Math.round((stats.wins / stats.games) * 100) : 0;
    el.homeStreak.textContent = stats.currentStreak;
    el.homeWins.textContent = stats.wins;
    el.homeRate.textContent = `${rate}%`;
    el.resultStreak.textContent = stats.currentStreak;
    el.bestStreak.textContent = stats.bestStreak;
    el.totalWins.textContent = stats.wins;
    el.winRate.textContent = `${rate}%`;
    el.dialogStreak.textContent = stats.currentStreak;
    el.dialogBest.textContent = stats.bestStreak;
    el.dialogGames.textContent = stats.games;
    el.dialogRate.textContent = `${rate}%`;
    el.dialogLastWord.textContent = stats.lastSolvedWord || '—';
  }

  function openStats() {
    renderStats();
    if (typeof el.statsDialog.showModal === 'function') el.statsDialog.showModal();
    else alert(`Streak: ${stats.currentStreak}\nMelhor: ${stats.bestStreak}\nPartidas: ${stats.games}`);
  }

  function shareText() {
    const score = game.status === 'won' ? `${game.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    const date = today.split('-').reverse().slice(0,2).join('/');
    const icons = { correct: '🟩', present: '🟨', absent: '⬜' };
    const grid = game.evaluations.map(row => row.map(s => icons[s]).join('')).join('\n');
    return `Aura Palavra ${date} ${score}\n${grid}\n🔥 Streak: ${stats.currentStreak}`;
  }

  async function shareResult() {
    const text = shareText();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Aura Palavra', text });
        setMessage('Resultado compartilhado!');
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(text);
      alert('Resultado copiado!');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly','');
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area); area.select();
      document.execCommand('copy'); area.remove();
      alert('Resultado copiado!');
    }
  }

  function setMessage(text) {
    el.message.textContent = text;
  }
  function clearMessage() {
    el.message.textContent = '';
  }
})();
