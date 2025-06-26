# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Projeto CEP API com Vue 3 + TypeScript

Este é um projeto educacional para aprender a consumir APIs usando Vue 3 com TypeScript moderno.

### Tecnologias Utilizadas:
- Vue 3 com Composition API
- TypeScript
- Vite (build tool)
- Script Setup sintaxe moderna
- API ViaCEP (brasileira)

### Padrões de Código:
- Use sempre Composition API com `<script setup>`
- Prefira `ref()` e `reactive()` para reatividade
- Use TypeScript interfaces para tipagem
- Implemente tratamento de erros adequado
- Use async/await para requisições HTTP
- Siga as convenções do Vue 3 modernas

### API Utilizada:
- ViaCEP: `https://viacep.com.br/ws/{cep}/json/`
- Formato de CEP: 8 dígitos numéricos (ex: 01310100)
