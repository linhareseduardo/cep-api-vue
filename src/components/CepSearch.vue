<template>
  <div class="cep-search">
    <div class="container">
      <h1 class="title">🏠 Consulta de CEP</h1>
      <p class="subtitle">
        Digite um CEP para consultar o endereço completo usando a API ViaCEP
      </p>

      <!-- Formulário de busca -->
      <form @submit.prevent="handleSubmit" class="search-form">
        <div class="input-group">
          <input
            v-model="cepInput"
            type="text"
            placeholder="Digite o CEP (ex: 01310-100)"
            maxlength="9"
            class="cep-input"
            :disabled="apiState.loading"
            @input="handleInput"
          />
          <button 
            type="submit" 
            class="search-button"
            :disabled="apiState.loading || !cepInput.trim()"
          >
            <span v-if="apiState.loading">🔄</span>
            <span v-else>🔍</span>
            {{ apiState.loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
      </form>

      <!-- Mensagem de erro -->
      <div v-if="apiState.error" class="error-message">
        ⚠️ {{ apiState.error }}
      </div>

      <!-- Resultado da busca -->
      <div v-if="cepData" class="result-card">
        <h2 class="result-title">📍 Endereço Encontrado</h2>
        
        <div class="address-grid">
          <div class="address-item">
            <span class="label">CEP:</span>
            <span class="value">{{ formatCep(cepData.cep) }}</span>
          </div>
          
          <div class="address-item">
            <span class="label">Logradouro:</span>
            <span class="value">{{ cepData.logradouro || 'Não informado' }}</span>
          </div>
          
          <div class="address-item">
            <span class="label">Bairro:</span>
            <span class="value">{{ cepData.bairro || 'Não informado' }}</span>
          </div>
          
          <div class="address-item">
            <span class="label">Cidade:</span>
            <span class="value">{{ cepData.localidade }}</span>
          </div>
          
          <div class="address-item">
            <span class="label">Estado:</span>
            <span class="value">{{ cepData.uf }} - {{ cepData.estado }}</span>
          </div>
          
          <div class="address-item">
            <span class="label">Região:</span>
            <span class="value">{{ cepData.regiao }}</span>
          </div>
          
          <div v-if="cepData.complemento" class="address-item">
            <span class="label">Complemento:</span>
            <span class="value">{{ cepData.complemento }}</span>
          </div>
          
          <div class="address-item">
            <span class="label">DDD:</span>
            <span class="value">{{ cepData.ddd }}</span>
          </div>
        </div>
        
        <button @click="clearData" class="clear-button">
          🗑️ Limpar Resultado
        </button>
      </div>

      <!-- Informações sobre a API -->
      <div class="api-info">
        <h3>ℹ️ Sobre a API ViaCEP</h3>
        <p>
          Esta aplicação consome a API gratuita 
          <a href="https://viacep.com.br/" target="_blank" rel="noopener">ViaCEP</a>,
          que fornece informações de endereçamento dos Correios brasileiros.
        </p>
        <p>
          <strong>Formato:</strong> Digite apenas números ou use o formato 00000-000
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCepApi } from '@/composables/useCepApi'

// Composable para gerenciar a API
const { apiState, cepData, fetchCep, clearData, formatCep } = useCepApi()

// Estado local do input
const cepInput = ref('')

// Função para formatar o input enquanto o usuário digita
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '') // Remove não numéricos
  
  // Limita a 8 dígitos
  if (value.length > 8) {
    value = value.slice(0, 8)
  }
  
  // Adiciona o hífen automaticamente
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
  
  cepInput.value = value
}

// Função para submeter o formulário
const handleSubmit = async () => {
  if (!cepInput.value.trim()) return
  
  await fetchCep(cepInput.value)
}
</script>

<style scoped>
.cep-search {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  text-align: center;
  color: #718096;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.search-form {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cep-input {
  flex: 1;
  min-width: 250px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.cep-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.cep-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 4px solid #c53030;
}

.result-card {
  background: #f7fafc;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.result-title {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.address-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  color: #2d3748;
  font-size: 1.1rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.clear-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clear-button:hover {
  background: #c53030;
  transform: translateY(-1px);
}

.api-info {
  background: #ebf8ff;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #3182ce;
}

.api-info h3 {
  color: #2b6cb0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.api-info p {
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.api-info a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
}

.api-info a:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .cep-input,
  .search-button {
    min-width: auto;
  }
  
  .address-grid {
    grid-template-columns: 1fr;
  }
}
</style>
