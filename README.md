# Aura Palavra

Jogo diário de adivinhação de palavras, mobile-first, implementado a partir do PRD fornecido.

## Rodar localmente

Evite abrir `index.html` diretamente com `file://` porque o comportamento de `localStorage` nesse esquema não é garantido entre navegadores.

Com Python instalado:

```bash
python -m http.server 8080
```

Depois abra:

```text
http://localhost:8080
```

## Arquivos principais

- `PRD.md` — requisitos consolidados;
- `docs/plans/2026-10-21-jogo-adivinhacao-palavras.md` — cópia canônica do PRD conforme AGENTS.md;
- `RESEARCH.md` — pesquisa e decisões;
- `DESIGN_PANEL.md` — avaliação dos três especialistas;
- `prototypes/prototype-a.html` — Aura Pop, escolhido;
- `prototypes/prototype-b.html` — Arcade Dark;
- `prototypes/prototype-c.html` — Caderno;
- `SPECS.md` — especificação técnica;
- `index.html`, `styles.css`, `app.js` — MVP funcional;
- `REVISAO_REQUISITOS.md` — conformidade;
- `REVISAO_CODIGO.md` — code review.
