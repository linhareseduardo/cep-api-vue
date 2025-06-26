// Interface para o retorno da API ViaCEP
export interface CepData {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

// Interface para o estado do formulário
export interface CepForm {
  cep: string
}

// Interface para o estado de loading e erros
export interface ApiState {
  loading: boolean
  error: string | null
}
