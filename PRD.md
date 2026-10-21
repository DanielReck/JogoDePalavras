# PRD — Jogo Casual de Adivinhação de Palavras

> Documento consolidado a partir do PRD fornecido. A cópia canônica também está em `docs/plans/2026-10-21-jogo-adivinhacao-palavras.md`, conforme a regra do projeto.

## 1. Visão geral

- **Produto:** jogo casual diário de adivinhação de palavras
- **Plataforma:** web responsiva, mobile-first
- **Público:** crianças e jovens, aproximadamente 8–18 anos
- **Mecânica:** descobrir a palavra do dia em até 6 tentativas, com feedback por letra
- **Estratégia:** recorrência diária, streak e compartilhamento sem spoiler
- **Monetização:** nenhuma no MVP

## 2. Objetivos

### Principal
Aumentar o retorno diário do jogador por meio de uma partida curta e uma sequência (streak).

### Secundários
- ensinar palavras por tema de forma leve;
- permitir progresso sem cadastro;
- oferecer feedback visual imediato;
- facilitar compartilhamento orgânico sem revelar a solução.

## 3. Core loop

1. Abrir o jogo.
2. Ver categoria e quantidade de letras.
3. Inserir tentativa.
4. Receber feedback por letra.
5. Ajustar a próxima tentativa.
6. Vencer ou esgotar 6 tentativas.
7. Ver resultado e estatísticas.
8. Compartilhar sem revelar a resposta.

## 4. Regras

- Um desafio por dia.
- Palavra definida automaticamente pela data.
- Palavra com 5 letras no MVP.
- Até 6 tentativas.
- Cada palavra pertence a uma categoria.
- Feedback:
  - **correta:** letra existe e está na posição certa;
  - **presente:** letra existe em outra posição;
  - **ausente:** letra não existe na resposta.
- Não revelar a palavra antes do encerramento da partida.
- Não aceitar tentativa repetida.
- Validar tentativa antes de confirmar.

## 5. Categorias

Banco inicial:
- animais;
- comida;
- ciência;
- esportes;
- natureza;
- objetos;
- profissões;
- escola;
- tecnologia;
- hobbies;
- memes aurudos.

A categoria “memes aurudos” permanece como prioridade temática do MVP, mas o banco inclui outras categorias para permitir rotação diária real.

## 6. Funcionalidades do MVP

### Tela inicial
- nome do jogo;
- tema do dia;
- tutorial em até 2 frases;
- botão “Jogar agora”;
- resumo de streak.

### Partida
- categoria;
- número de letras;
- grade de 6 tentativas;
- teclado virtual;
- suporte ao teclado físico;
- envio de tentativa;
- mensagens de validação;
- voltar ao início.

### Resultado
- vitória ou derrota;
- palavra correta ao final;
- quantidade de tentativas;
- estatísticas;
- copiar/compartilhar resultado.

### Estatísticas
- streak atual;
- melhor streak;
- vitórias;
- partidas;
- última palavra resolvida;
- percentual de acerto.

## 7. Requisitos funcionais

- RF01 — gerar a palavra do dia com base na data;
- RF02 — associar palavra a categoria;
- RF03 — validar tentativa;
- RF04 — calcular feedback por letra, inclusive letras repetidas;
- RF05 — limitar a 6 tentativas;
- RF06 — registrar o resultado diário;
- RF07 — manter streak;
- RF08 — armazenar histórico básico;
- RF09 — exibir estatísticas;
- RF10 — compartilhar resultado sem spoiler;
- RF11 — funcionar em mobile e desktop;
- RF12 — aceitar teclado físico e virtual.

## 8. Requisitos não funcionais

- interface simples e legível;
- carregamento rápido;
- responsividade;
- contraste adequado;
- foco de teclado visível;
- botões e teclas grandes;
- baixo consumo de dados;
- sem cadastro obrigatório;
- compatibilidade com navegadores modernos.

## 9. Critérios de aceitação testáveis

- CA01 — tutorial cabe em até 2 frases curtas;
- CA02 — existem exatamente 6 linhas de tentativa;
- CA03 — tentativa inválida gera aviso claro;
- CA04 — feedback aparece logo após o envio;
- CA05 — resultado aparece ao acertar ou após a 6ª tentativa;
- CA06 — streak é atualizado por dia;
- CA07 — compartilhamento não contém a solução;
- CA08 — funciona em largura de 320 px sem rolagem horizontal;
- CA09 — toda ação principal pode ser feita por teclado;
- CA10 — feedback não depende apenas da cor.

## 10. Fora do MVP

- ranking global;
- multiplayer;
- compras internas;
- assinatura;
- avatar avançado;
- recompensas complexas;
- tutorial longo.

## 11. Observação sobre itens ambíguos do material original

O material original também cita itens como “67 de aura”, “resenha”, “lord verity”, “mogados”, “Gundaia” e métricas sem definição mensurável. Eles são preservados como linguagem temática/placeholder, mas não foram convertidos em requisito técnico por não haver comportamento verificável descrito.
