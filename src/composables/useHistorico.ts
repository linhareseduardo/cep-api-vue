import { ref } from 'vue'

export interface HistoricoItem {
  id: number
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  data_busca: string
}

export interface Estatisticas {
  total_buscas: number
  ceps_unicos: number
  estados_buscados: number
  cidade_mais_buscada: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export function useHistorico() {
  const historico = ref<HistoricoItem[]>([])
  const estatisticas = ref<Estatisticas | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Salvar busca no histórico
  const salvarHistorico = async (cepData: any): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/historico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cep: cepData.cep,
          logradouro: cepData.logradouro,
          bairro: cepData.bairro,
          localidade: cepData.localidade,
          uf: cepData.uf,
          estado: cepData.estado,
          regiao: cepData.regiao
        })
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao salvar histórico')
      }

      // Não exibir erro se for duplicata
      if (!result.duplicate) {
        console.log('✅ Busca salva no histórico')
      }

    } catch (err) {
      console.error('Erro ao salvar histórico:', err)
      // Não bloquear a aplicação se o histórico falhar
    }
  }

  // Buscar histórico
  const buscarHistorico = async (limit = 50, offset = 0): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/historico?limit=${limit}&offset=${offset}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar histórico')
      }

      historico.value = result.data

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    } finally {
      loading.value = false
    }
  }

  // Buscar estatísticas
  const buscarEstatisticas = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/estatisticas`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar estatísticas')
      }

      estatisticas.value = result.data

    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
    }
  }

  // Formatar data
  const formatarData = (dataString: string): string => {
    const data = new Date(dataString)
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    historico,
    estatisticas,
    loading,
    error,
    salvarHistorico,
    buscarHistorico,
    buscarEstatisticas,
    formatarData
  }
}
