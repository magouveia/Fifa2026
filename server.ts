import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import db from './src/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mundial2026-super-secret-key-magouveia'; // In production, use environment variable

// --- Authentication Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // --- AUTH ROUTES ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
      
      const valid = bcrypt.compareSync(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token, email: user.email });
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // --- API ROUTES ---

  // Obter dados públicos (O que o Mestre/Admin definiu)
  app.get('/api/tournament/public', (req, res) => {
    try {
      const state = db.prepare('SELECT * FROM app_state WHERE id = 1').get() as any;
      
      if (!state) {
        return res.status(404).json({ error: 'Dados do Mestre não encontrados' });
      }

      res.json({
        groups: JSON.parse(state.groups_json),
        matches: JSON.parse(state.matches_json),
        playoffs: JSON.parse(state.playoffs_json)
      });
    } catch (error) {
      console.error('Erro ao obter dados públicos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Guardar ou Atualizar dados (Admin Only)
  app.post('/api/tournament/save', authenticateToken, (req, res) => {
    const { groups, matches, playoffs } = req.body;

    try {
      db.prepare('UPDATE app_state SET groups_json = ?, matches_json = ?, playoffs_json = ? WHERE id = 1')
        .run(JSON.stringify(groups), JSON.stringify(matches), JSON.stringify(playoffs));
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao guardar dados:', error);
      res.status(500).json({ error: 'Erro ao guardar dados na base de dados' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Full-Stack a correr em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
});
