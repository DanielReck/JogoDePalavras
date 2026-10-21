# Revisão de conformidade com requisitos

## Resultado geral

**Conformidade estimada do MVP: 93% dos requisitos objetivos e testáveis.**

### Atendidos

- palavra diária por data;
- categoria diária;
- 5 letras;
- 6 tentativas;
- validação de tentativa;
- bloqueio de tentativa repetida;
- algoritmo de feedback com letras repetidas;
- feedback imediato;
- resultado de vitória/derrota;
- streak, melhor streak, partidas, vitórias e taxa de acerto;
- última palavra resolvida;
- persistência sem cadastro via `localStorage`;
- compartilhamento sem solução;
- teclado físico;
- teclado virtual;
- layout mobile-first;
- foco visível;
- status por cor + símbolo + `aria-label`;
- retorno à tela inicial.

### Parcialmente atendidos

- **“palavra válida”**: o MVP valida contra um banco local pequeno. Em produção, o ideal é um dicionário maior ou API/banco curado.
- **“mesma palavra para todos”**: é garantido para clientes com a mesma versão do banco e data na timezone `America/Sao_Paulo`.
- **carregamento <2s**: arquitetura é leve, porém a fonte Google é uma dependência externa. Em produção, hospedar a fonte localmente dá previsibilidade maior.

### Não convertidos em requisito técnico

Itens sem definição verificável no PRD original, como “67 de aura”, “lord verity”, “mogados”, “Gundaia” e métricas sem sentido de produto, foram preservados como contexto, mas não implementados como regra de sistema.
