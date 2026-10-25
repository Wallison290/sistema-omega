# Sistema Ômega

Demonstração visual do sistema da Ômega (Gestão & Pessoas): recrutamento, consultorias, treinamentos e biblioteca de ferramentas, operados por um agente no WhatsApp e organizados num painel.

Ainda sem banco de dados nem n8n: os dados são de exemplo e ficam no navegador. As conversas com o agente são encenadas, mas gravam no painel como o sistema real faria.

## Telas

- **Início:** números do mês, o que precisa de ação, agenda automática do dia e histórico de ações.
- **Agente no WhatsApp:** conversas de exemplo para cada módulo (vaga por áudio, repetir vaga, currículo, relato pós-encontro, falta, treinamento, biblioteca, consultas, relatório).
- **Clientes, Vagas, Consultorias, Treinamentos, Biblioteca:** cada registro mostra a origem (WhatsApp, Google Forms, painel ou automático) e também pode ser preenchido à mão.
- **Agenda automática:** os fluxos do n8n (agenda do dia, pós-encontro, véspera, relato pendente, Forms, resumo do mês, saúde do WhatsApp).
- **Relatórios:** relatório do cliente por período, pronto para PDF.
- **Equipe e regras:** quem fala com o agente e as regras que ele segue.

O botão **Explicações**, no topo, mostra ou esconde as faixas que explicam cada tela.

## Arquivos

- `index.html`, `assets/styles.css`, `assets/app.js`, `assets/data.js` (dados e conversas de exemplo).
- `v1/`: primeira versão (apresentação da proposta e protótipo antigo).
