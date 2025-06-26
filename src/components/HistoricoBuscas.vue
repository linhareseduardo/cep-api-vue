<template>
  <div class="historico-container">
    <div class="header">
      <h2 class="title">📊 Histórico de Buscas</h2>
      <button @click="recarregarHistorico" :disabled="loading" class="refresh-btn">
        <span v-if="loading">🔄</span>
        <span v-else>🔄</span>
        {{ loading ? 'Carregando...' : 'Atualizar' }}
      </button>
    </div>

    <!-- Estatísticas -->
    <div v-if="estatisticas" class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ estatisticas.total_buscas }}</div>
        <div class="stat-label">Total de Buscas</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ estatisticas.ceps_unicos }}</div>
        <div class="stat-label">CEPs Únicos</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ estatisticas.estados_buscados }}</div>
        <div class="stat-label">Estados</div>
      </div>
      <div class="stat-card">
        <div class="stat-text">{{ estatisticas.cidade_mais_buscada || 'N/A' }}</div>
        <div class="stat-label">Cidade Mais Buscada</div>
      </div>
    </div>

    <!-- Lista do histórico -->
    <div class="historico-list">
      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <div v-else-if="loading && historico.length === 0" class="loading-message">
        🔄 Carregando histórico...
      </div>

      <div v-else-if="historico.length === 0" class="empty-message">
        📭 Nenhuma busca encontrada no histórico
      </div>

      <div v-else class="historico-items">
        <div 
          v-for="item in historico" 
          :key="item.id" 
          class="historico-item"
          @click="$emit('selecionarCep', item.cep)"
        >
          <div class="item-header">
            <span class="cep">{{ formatarCep(item.cep) }}</span>
            <span class="data">{{ formatarData(item.data_busca) }}</span>
          </div>
          
          <div class="item-content">
            <div class="endereco">
              <strong>{{ item.localidade }}, {{ item.uf }}</strong>
            </div>
            <div v-if="item.logradouro" class="logradouro">
              {{ item.logradouro }}
            </div>
            <div v-if="item.bairro" class="bairro">
              {{ item.bairro }}
            </div>
          </div>

          <div class="item-footer">
            <span class="regiao">{{ item.regiao }}</span>
            <span class="click-hint">👆 Clique para buscar novamente</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHistorico } from '@/composables/useHistorico'

// Props e emits
defineEmits<{
  selecionarCep: [cep: string]
}>()

// Composable do histórico
const { 
  historico, 
  estatisticas, 
  loading, 
  error, 
  buscarHistorico, 
  buscarEstatisticas, 
  formatarData 
} = useHistorico()

// Função para formatar CEP
const formatarCep = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// Função para recarregar dados
const recarregarHistorico = async () => {
  await Promise.all([
    buscarHistorico(),
    buscarEstatisticas()
  ])
}

// Carregar dados ao montar o componente
onMounted(() => {
  recarregarHistorico()
})
</script>

<style scoped>
.historico-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.title {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.refresh-btn {
  background: linear-gradient(135deg, #4299e1, #38b2ac);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 0.5rem;
}

.stat-text {
  font-size: 1rem;
  font-weight: 600;
  color: #4299e1;
  margin-bottom: 0.5rem;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.historico-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.error-message,
.loading-message,
.empty-message {
  padding: 2rem;
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
}

.error-message {
  color: #e53e3e;
  background: #fed7d7;
}

.historico-items {
  max-height: 500px;
  overflow-y: auto;
}

.historico-item {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.historico-item:hover {
  background: #f7fafc;
  transform: translateX(4px);
}

.historico-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.cep {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4299e1;
  background: #ebf8ff;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.data {
  font-size: 0.875rem;
  color: #718096;
}

.item-content {
  margin-bottom: 1rem;
}

.endereco {
  color: #2d3748;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.logradouro,
.bairro {
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.regiao {
  font-size: 0.875rem;
  color: #38b2ac;
  font-weight: 500;
}

.click-hint {
  font-size: 0.75rem;
  color: #a0aec0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.historico-item:hover .click-hint {
  opacity: 1;
}

/* Responsividade */
@media (max-width: 768px) {
  .historico-container {
    margin: 1rem auto;
  }
  
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .item-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
