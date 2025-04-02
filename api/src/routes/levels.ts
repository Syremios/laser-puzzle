import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const levels = new Hono();
const prisma = new PrismaClient();

// Get all levels
levels.get('/', async (c) => {
  const levels = await prisma.levels.findMany();
  return c.json(levels);
});

// Get specific level
levels.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const level = await prisma.levels.findUnique({
    where: { id },
    include: {
      gameStates: {
        include: {
          piece: true
        }
      }
    }
  });
  if (!level) return c.notFound();
  return c.json(level);
});

// Create new level
levels.post('/', async (c) => {
  const body = await c.req.json();
  const level = await prisma.levels.create({
    data: {
      name: body.name,
      difficulty: body.difficulty
    }
  });
  return c.json(level, 201);
});

export default levels;
