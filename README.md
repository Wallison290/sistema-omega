# Sistema Ômega

Protótipo navegável do sistema de gestão da Ômega (consultoria, recrutamento e seleção). Dados fictícios e ações simuladas: ainda sem banco, sem WhatsApp real e sem assinatura digital. Tudo fica salvo só no navegador de quem usa.

## Páginas

- `index.html`: o painel.
  - **Visão geral:** indicadores, pendências e próximos compromissos.
  - **Agente no WhatsApp:** conversas de exemplo que gravam no painel.
  - **CRM e clientes:** funil Lead → Qualificação → Proposta → Negociação → Cliente, perdidos e inativos, pesquisa de preços anteriores.
  - **Recrutamento e seleção:** vagas em Abertas → Recrutamento → Seleção → Pendente → Fechadas, candidatos com origem, etapa e avaliações, respostas do formulário de briefing.
  - **Consultorias e agenda:** calendário por mês e por semana, atendimentos com presença, falta e cancelamento, treinamentos.
  - **Propostas e contratos:** modelos, prévia ao vivo, versões e contrato gerado da proposta aprovada.
  - **Relatórios:** indicadores por área e relatório do cliente em PDF.
  - **Automações**, **Biblioteca** e **Configurações**.
- `briefing.html`: formulário de briefing da Ômega, que substitui o Google Forms. Aceita `?c=<id do cliente>` para preencher a empresa.
- `agendar.html`: link público de agendamento com os horários livres. Também aceita `?c=`.

As páginas públicas entregam as respostas ao painel pelo `localStorage` (chave `omega-inbox`). Para ver chegar, abra o painel e a página pública no mesmo navegador.

O botão **Roteiro**, no topo do painel, segue os passos da demonstração do documento funcional e marca cada um quando é feito.

`v1/` guarda a primeira versão (apresentação da proposta e protótipo antigo).
