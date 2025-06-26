import { ref } from 'vue'
import type { CepData, ApiState } from '@/types/cep'
import { useHistorico } from '@/composables/useHistorico'

export function useCepApi() {
  const apiState = ref<ApiState>({
    loading: false,
    error: null
  })
  
  const cepData = ref<CepData | null>(null)
  
  // Integração com histórico
  const { salvarHistorico } = useHistorico()

  // Função para validar o formato do CEP
  const isValidCep = (cep: string): boolean => {
    const cepRegex = /^\d{8}$/
    return cepRegex.test(cep.replace(/\D/g, ''))
  }

  // Função para formatar o CEP (adicionar hífen)
  const formatCep = (cep: string): string => {
    const cleaned = cep.replace(/\D/g, '')
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  // Função principal para buscar CEP
  const fetchCep = async (cep: string): Promise<void> => {
    // Limpa o CEP removendo caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '')
    
    // Valida o formato
    if (!isValidCep(cleanCep)) {
      apiState.value.error = 'CEP deve conter exatamente 8 dígitos'
      return
    }

    // Reset do estado
    apiState.value.loading = true
    apiState.value.error = null
    cepData.value = null

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data: CepData = await response.json()
      
      // Verifica se o CEP foi encontrado
      if ('erro' in data) {
        throw new Error('CEP não encontrado')
      }

      cepData.value = data
      
      // Salvar no histórico (não bloqueia se falhar)
      try {
        await salvarHistorico(data)
      } catch (error) {
        console.warn('Aviso: Não foi possível salvar no histórico:', error)
      }
    } catch (error) {
      apiState.value.error = error instanceof Error 
        ? error.message 
        : 'Erro desconhecido ao buscar CEP'
    } finally {
      apiState.value.loading = false
    }
  }

  // Função para limpar os dados
  const clearData = (): void => {
    cepData.value = null
    apiState.value.error = null
  }

  return {
    // Estado reativo
    apiState,
    cepData,
    
    // Funções
    fetchCep,
    clearData,
    formatCep,
    isValidCep
  }
}
