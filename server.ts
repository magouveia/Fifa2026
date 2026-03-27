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
  const PORT = process.env.PORT || 3008;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // --- AUTH ROUTES ---
  app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Este email já está registado' });
      }

      const hash = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);
      
      const isAdmin = email === 'magouveia1982@gmail.com';
      const token = jwt.sign({ id: result.lastInsertRowid, email, isAdmin }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ success: true, token, email, isAdmin });
    } catch (error) {
      console.error('Erro no registo:', error);
      res.status(500).json({ error: 'Erro ao criar conta' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
      
      const valid = bcrypt.compareSync(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });
      
      const isAdmin = user.email === 'magouveia1982@gmail.com';
      const token = jwt.sign({ id: user.id, email: user.email, isAdmin }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token, email: user.email, isAdmin });
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

  let currentPort = Number(PORT);
  
  const startListening = () => {
    const server = app.listen(currentPort, '0.0.0.0', () => {
      console.log(`Servidor Full-Stack a correr em http://localhost:${currentPort}`);
    });

    server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`A porta ${currentPort} está ocupada, a tentar a porta ${currentPort + 1}...`);
        currentPort++;
        startListening();
      } else {
        console.error('Erro ao iniciar o servidor:', e);
      }
    });
  };

  startListening();
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
});
