# 🏠 CEP API - Vue 3 + TypeScript

Um projeto educacional para aprender a consumir APIs usando Vue 3 com TypeScript moderno e a API brasileira ViaCEP.

## ✨ Funcionalidades

- 🔍 **Busca de CEP**: Digite um CEP e obtenha o endereço completo
- ✅ **Validação**: Validação automática do formato do CEP
- 🎨 **Interface Moderna**: Design responsivo e intuitivo
- ⚡ **Performance**: Usa Vue 3 Composition API com `<script setup>`
- 🛡️ **TypeScript**: Tipagem completa para melhor DX
- 🔄 **Estados de Loading**: Feedback visual durante requisições
- ❌ **Tratamento de Erros**: Mensagens de erro amigáveis

## 🛠️ Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript reativo
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida
- **Composition API** - API moderna do Vue 3
- **ViaCEP API** - API gratuita brasileira de CEPs

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd cep

# Instale as dependências
npm install

# Execute o projeto em modo desenvolvimento
npm run dev

# Para build de produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── CepSearch.vue      # Componente principal de busca
├── composables/
│   └── useCepApi.ts       # Composable para gerenciar API
├── types/
│   └── cep.ts             # Interfaces TypeScript
├── App.vue                # Componente raiz
└── main.ts                # Ponto de entrada
```

## 🔧 Principais Conceitos Demonstrados

### 1. **Composition API Moderna**
```typescript
<script setup lang="ts">
import { ref } from 'vue'
import { useCepApi } from '@/composables/useCepApi'

const { apiState, cepData, fetchCep } = useCepApi()
const cepInput = ref('')
</script>
```

### 2. **Composables Personalizados**
```typescript
export function useCepApi() {
  const apiState = ref<ApiState>({ loading: false, error: null })
  const cepData = ref<CepData | null>(null)
  
  const fetchCep = async (cep: string) => {
    // Lógica da API...
  }
  
  return { apiState, cepData, fetchCep }
}
```

### 3. **Tipagem TypeScript**
```typescript
interface CepData {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  // ...
}
```

### 4. **Fetch API Moderno**
```typescript
const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
const data: CepData = await response.json()
```

## 🌐 API Utilizada

### ViaCEP
- **URL**: `https://viacep.com.br/ws/{cep}/json/`
- **Método**: GET
- **Formato**: JSON
- **Exemplo**: `https://viacep.com.br/ws/01310100/json/`

### Resposta da API
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "estado": "São Paulo",
  "regiao": "Sudeste",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

## 📚 Aprendizados

Este projeto demonstra:

1. **Consumo de APIs REST** com fetch nativo
2. **Gerenciamento de estado reativo** com Vue 3
3. **Composables personalizados** para reutilização de lógica
4. **Validação de dados** em tempo real
5. **Tratamento de erros** adequado
6. **Interface responsiva** com CSS moderno
7. **TypeScript** para tipagem e melhor DX

## 🎯 Próximos Passos

- [ ] Adicionar histórico de buscas
- [ ] Implementar cache local
- [ ] Adicionar testes unitários
- [ ] PWA (Progressive Web App)
- [ ] Integração com mapas

## 📄 Licença

Este projeto é livre para uso educacional.

---

**Feito com ❤️ para aprender Vue 3 + TypeScript**
