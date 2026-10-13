import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB, isMongoConnected } from './server/config/db.ts';
import authRoutes from './server/routes/authRoutes.ts';
import productRoutes from './server/routes/productRoutes.ts';
import farmerRoutes from './server/routes/farmerRoutes.ts';
import orderRoutes from './server/routes/orderRoutes.ts';
import analyticsRoutes from './server/routes/analyticsRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Trust first proxy (Cloud Run / AI Studio reverse proxy)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FarmConnect API',
    version: '1.0.0',
    database: isMongoConnected() ? 'connected (MongoDB Mongoose)' : 'integrated fail-safe local engine'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// 404 for unhandled API endpoints
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

async function startServer() {
  await connectDB();

  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(distPath);

  if (!isProduction || !distExists) {
    // Vite Dev Server middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite dev middleware mounted');
  } else {
    // Production static serving
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('📦 Serving production static assets from dist/');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 FarmConnect server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting FarmConnect server:', err);
  process.exit(1);
});
