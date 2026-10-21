# Pesquisa — jogos casuais diários de adivinhação de palavras

## Síntese

Para um jogo diário de palavras voltado a crianças e jovens, a experiência precisa priorizar entendimento imediato, baixa fricção e retorno diário. A mecânica de seis tentativas, feedback por letra e um único desafio diário já é familiar em jogos no estilo Wordle e favorece sessões curtas.

### Decisões de produto derivadas da pesquisa

1. **Onboarding muito curto**: mostrar a regra em no máximo duas frases e permitir jogar imediatamente.
2. **Feedback multimodal**: cor ajuda, mas não deve ser o único sinal. Cada casa também usa símbolo/estado textual para indicar letra correta, presente ou ausente.
3. **Teclado físico + virtual**: toda a função principal precisa ser utilizável por teclado e toque.
4. **Alvos grandes**: teclas e botões foram desenhados com área de toque confortável; WCAG 2.2 estabelece 24×24 CSS px como mínimo AA, enquanto 44×44 px é uma referência mais confortável em interfaces touch.
5. **Contraste**: textos principais seguem contraste mínimo de 4,5:1 quando aplicável.
6. **Progresso sem conta**: `localStorage` é adequado ao MVP porque mantém dados entre sessões no mesmo navegador, atendendo streak e estatísticas sem cadastro.
7. **Compartilhamento sem spoiler**: o resultado usa blocos/símbolos e quantidade de tentativas sem incluir a palavra secreta.
8. **Partida diária determinística**: a palavra é escolhida a partir da data na timezone do produto, permitindo que todos recebam o mesmo desafio daquele dia.

## Referências usadas na pesquisa

- W3C/WAI — WCAG 2.2 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- W3C/WAI — WCAG 2.1/2.2 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- W3C/WAI — Keyboard Accessible: https://www.w3.org/WAI/WCAG21/Understanding/keyboard-accessible
- MDN — `localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN — PWA best practices: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices
- Dilger, J. P. (2023), “Wordle: A Microcosm of Life. Luck, Skill, Cheating, Loyalty, and Influence!”: https://arxiv.org/abs/2309.02110

## Observação sobre o PRD recebido

O PRD enviado contém termos de brincadeira ou placeholders que não têm definição funcional clara, por exemplo “67 de aura”, “lord verity”, “mogados” e algumas métricas sem relação direta com produto. Eles foram preservados no PRD original, mas não foram tratados como requisitos técnicos bloqueadores. O MVP abaixo implementa os requisitos objetivos e testáveis do documento.
