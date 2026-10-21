# SPECS — implementação técnica do jogo diário de palavras

## 1. Arquitetura

MVP 100% client-side, sem backend:

- `index.html` — estrutura semântica e telas;
- `styles.css` — design system e responsividade;
- `data/words.js` — banco de palavras;
- `app.js` — estado, regras, armazenamento e UI;
- `prototypes/` — três mockups navegáveis.

A escolha client-side reduz custo, complexidade e tempo de carregamento. O projeto pode ser hospedado como site estático em Vercel, Netlify ou GitHub Pages.

## 2. Estado do jogo

Estrutura diária:

```js
{
  date: "2026-10-21",
  answer: "SIGMA",
  category: "memes aurudos",
  guesses: ["..."],
  status: "playing" | "won" | "lost"
}
```

Estado persistente:

```js
{
  currentStreak: 0,
  bestStreak: 0,
  wins: 0,
  games: 0,
  lastPlayedDate: null,
  lastSolvedWord: null,
  history: []
}
```

## 3. Palavra do dia

- timezone do produto: `America/Sao_Paulo`;
- gerar `YYYY-MM-DD` com `Intl.DateTimeFormat`;
- converter a data para um índice determinístico;
- índice `% wordBank.length` seleciona a entrada;
- todos os clientes com o mesmo banco e mesma data recebem a mesma palavra.

## 4. Validação

Uma tentativa é aceita quando:
- possui 5 letras;
- existe no conjunto de palavras permitidas;
- não foi usada antes;
- a partida ainda está ativa.

## 5. Algoritmo de feedback

Para lidar corretamente com letras repetidas:

1. marcar primeiro as letras corretas na posição correta;
2. contabilizar as letras restantes da resposta;
3. percorrer as letras não resolvidas da tentativa;
4. marcar “presente” somente se ainda houver ocorrência disponível;
5. caso contrário, marcar “ausente”.

Complexidade: O(n), com n = 5.

## 6. Persistência

Usar `localStorage` com duas chaves:
- `auraWord.stats.v1`;
- `auraWord.game.<YYYY-MM-DD>`.

O jogo continua funcionando sem conta. Se storage estiver indisponível, a partida funciona em memória, mas streak pode não persistir.

## 7. Streak

Ao finalizar uma partida:
- incrementar `games` uma única vez por data;
- se venceu, incrementar `wins`;
- comparar `lastPlayedDate` com o dia anterior;
- se jogou no dia anterior, `currentStreak += 1`;
- se não, reiniciar em 1;
- `bestStreak = max(bestStreak, currentStreak)`.

O streak é de **participação diária** conforme o PRD. A vitória é acompanhada separadamente.

## 8. Acessibilidade

- HTML semântico;
- `aria-live="polite"` para avisos;
- `aria-label` por tile após feedback;
- indicação de status por símbolo e cor;
- foco visível;
- controles acionáveis via `Enter`, letras e `Backspace`;
- área de toque confortável;
- `prefers-reduced-motion` desliga animações não essenciais.

## 9. Compartilhamento

Formato:

```text
Aura Palavra 21/10 4/6
🟨⬜⬜🟩⬜
⬜🟨🟩🟩⬜
🟩🟩🟩🟩🟩
🔥 Streak: 3
```

A palavra nunca é incluída.

Fluxo:
- tentar `navigator.share()`;
- se indisponível, usar `navigator.clipboard.writeText()`;
- fallback: textarea temporário + `document.execCommand('copy')`.

## 10. Responsividade

- base mobile-first;
- largura mínima alvo: 320 px;
- grade usa `clamp()`;
- teclado distribui teclas em 3 linhas;
- desktop centraliza o app em um card sem esticar excessivamente.

## 11. Testes manuais essenciais

1. abrir em nova data e confirmar palavra determinística;
2. enviar palavra inválida;
3. repetir tentativa;
4. validar letras duplicadas;
5. vencer na primeira tentativa;
6. perder após 6 tentativas;
7. recarregar no meio da partida;
8. recarregar após terminar;
9. compartilhar sem spoiler;
10. navegar apenas por teclado;
11. testar em 320 px;
12. desabilitar `localStorage` e confirmar degradação graciosa.
