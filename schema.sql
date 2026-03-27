-- Tabela para armazenar os dados do Mundial 2026
-- Suporta tanto os dados mestres (user_id = 'admin') como as simulações dos utilizadores

CREATE TABLE IF NOT EXISTS tournament (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL, -- 'admin' para os dados mestres, UID do Firebase para utilizadores
    data JSONB NOT NULL DEFAULT '{}', -- Contém playoffs, matches e rosters
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index para procura rápida por user_id
CREATE INDEX IF NOT EXISTS idx_tournament_user_id ON tournament(user_id);

-- Tabela para utilizadores (Autenticação)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) UNIQUE NOT NULL, -- UID do Firebase ou UUID gerado
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index para procura rápida por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
