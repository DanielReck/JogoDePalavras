# Revisão de código

## Pontos positivos

- separação clara entre dados, estilo e lógica;
- algoritmo de avaliação em duas passagens lida com letras repetidas;
- persistência isolada em funções `safeGet` / `safeSet`;
- estado diário salvo por data;
- ações principais suportam teclado e toque;
- sem dependências JavaScript externas;
- compartilhamento possui três níveis de fallback;
- layout usa CSS responsivo e `prefers-reduced-motion`.

## Pontos de atenção

1. **Banco de palavras** — ainda pequeno e contém entradas provisórias; deve ser curado antes de produção.
2. **Validação lexical** — está limitada ao próprio banco; para jogo público, separar `answers` de `allowedGuesses`.
3. **Proteção contra trapaça** — como o app é client-side, a palavra do dia pode ser descoberta pelo código. Para competição real, mover seleção/validação para backend.
4. **Sincronização multi-dispositivo** — não existe sem login/backend.
5. **Telemetria** — métricas de retenção exigiriam analytics com cuidado de privacidade, especialmente por público jovem.
6. **Fonte externa** — o Google Fonts pode atrasar ou falhar; self-host é preferível em produção.

## Bug encontrado e corrigido durante revisão

O desenho final evita contabilizar uma partida duas vezes usando a flag `game.finalized`, persistida junto do estado diário.
