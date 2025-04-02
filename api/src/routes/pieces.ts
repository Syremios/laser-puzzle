import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const pieces = new Hono();
const prisma = new PrismaClient();

// Get all pieces
pieces.get('/', async (c) => {
  const pieces = await prisma.piece.findMany();
  return c.json(pieces);
});

// Create new piece
pieces.post('/', async (c) => {
  const body = await c.req.json();
  const piece = await prisma.piece.create({
    data: {
      type: body.type
    }
  });
  return c.json(piece, 201);
});

// Update existing piece
pieces.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  
  try {
    const piece = await prisma.piece.update({
      where: { id },
      data: {
        type: body.type
      }
    });
    return c.json(piece);
  } catch (error) {
    if (error.code === 'P2025') {
      return c.json({ error: 'Piece not found' }, 404);
    }
    throw error;
  }
});

export default pieces;
