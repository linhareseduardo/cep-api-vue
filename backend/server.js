const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Criar tabela se não existir
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS cep_historico (
      id SERIAL PRIMARY KEY,
      cep VARCHAR(10) NOT NULL,
      logradouro VARCHAR(255),
      bairro VARCHAR(255),
      localidade VARCHAR(255) NOT NULL,
      uf VARCHAR(2) NOT NULL,
      estado VARCHAR(255),
      regiao VARCHAR(255),
      data_busca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_usuario VARCHAR(45)
    );
    
    CREATE INDEX IF NOT EXISTS idx_cep ON cep_historico(cep);
    CREATE INDEX IF NOT EXISTS idx_data_busca ON cep_historico(data_busca DESC);
  `;
  
  try {
    await pool.query(query);
    console.log('✅ Tabela cep_historico criada/verificada');
  } catch (err) {
    console.error('❌ Erro ao criar tabela:', err);
  }
};

// Rotas da API

// Salvar busca no histórico
app.post('/api/historico', async (req, res) => {
  try {
    const { cep, logradouro, bairro, localidade, uf, estado, regiao } = req.body;
    const ip_usuario = req.ip || req.connection.remoteAddress;

    // Verificar se o CEP já foi buscado recentemente (últimas 24h)
    const checkQuery = `
      SELECT id FROM cep_historico 
      WHERE cep = $1 AND data_busca > NOW() - INTERVAL '24 hours'
      LIMIT 1
    `;
    
    const existingSearch = await pool.query(checkQuery, [cep]);
    
    if (existingSearch.rows.length > 0) {
      return res.json({ 
        success: true, 
        message: 'CEP já buscado recentemente',
        duplicate: true 
      });
    }

    const insertQuery = `
      INSERT INTO cep_historico (cep, logradouro, bairro, localidade, uf, estado, regiao, ip_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, data_busca
    `;

    const result = await pool.query(insertQuery, [
      cep, logradouro, bairro, localidade, uf, estado, regiao, ip_usuario
    ]);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Busca salva no histórico'
    });

  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar histórico
app.get('/api/historico', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const query = `
      SELECT 
        id,
        cep,
        logradouro,
        bairro,
        localidade,
        uf,
        estado,
        regiao,
        data_busca,
        COUNT(*) OVER() as total_count
      FROM cep_historico
      ORDER BY data_busca DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [parseInt(limit), parseInt(offset)]);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Estatísticas
app.get('/api/estatisticas', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_buscas,
        COUNT(DISTINCT cep) as ceps_unicos,
        COUNT(DISTINCT uf) as estados_buscados,
        (SELECT localidade FROM cep_historico GROUP BY localidade ORDER BY COUNT(*) DESC LIMIT 1) as cidade_mais_buscada
      FROM cep_historico
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    await createTable();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
