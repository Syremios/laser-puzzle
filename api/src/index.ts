import { Hono } from 'hono';
import { cors } from 'hono/cors';
import levels from './routes/levels';
import gamestate from './routes/gamestate';
import pieces from './routes/pieces';
import swagger from './routes/swagger';

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: ['http://localhost:3002'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400,
  credentials: true,
}));

// Mount routes
app.route('/levels', levels);
app.route('/gamestate', gamestate);
app.route('/pieces', pieces);
app.route('', swagger);

export default {
  port: 3001,
  fetch: app.fetch
};