// Teste simples de conexão PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testando conexão com PostgreSQL...');
console.log('Database URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testarConexao() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com PostgreSQL bem-sucedida!');
    
    const result = await client.query('SELECT NOW() as agora');
    console.log('⏰ Hora do servidor:', result.rows[0].agora);
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  }
}

testarConexao();
