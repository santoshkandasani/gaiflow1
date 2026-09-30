import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './src/server/database.ts';
import { apiRouter } from './src/server/api.ts';

// Dev server must run on port 3000 as per environment constraints
let PORT = 3000;
for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith('--port=')) {
    PORT = Number(arg.split('=')[1]) || PORT;
  } else if (arg === '--port' && process.argv[i + 1]) {
    PORT = Number(process.argv[i + 1]) || PORT;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize SQLite database
  await initDatabase();

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Serve static assets from public folder explicitly
  const publicDir = path.resolve(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  if (!isProduction) {
    // Vite Dev Server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`COLORIDO 2K26 Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
