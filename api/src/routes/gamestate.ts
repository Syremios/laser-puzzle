import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const gamestate = new Hono();
const prisma = new PrismaClient();

// Get game states for a level
gamestate.get('/:levelId', async (c) => {
  const levelId = parseInt(c.req.param('levelId'));
  const gameState = await prisma.gameState.findMany({
    where: { idLevel: levelId },
    include: { piece: true }
  });
  return c.json(gameState);
});

// Get complete grid state for a level
gamestate.get('/grid/:levelId', async (c) => {
  const levelId = parseInt(c.req.param('levelId'));
  
  // Get the level info with game states and piece list
  const level = await prisma.levels.findUnique({
    where: { id: levelId },
    include: {
      gameStates: {
        include: {
          piece: true
        }
      },
      pieceList: {
        include: {
          piece: true
        }
      }
    }
  });

  if (!level) {
    return c.json({ error: 'Level not found' }, 404);
  }

  // Create a map of placed pieces
  const placedPieces = {};
  level.gameStates.forEach(state => {
    const key = `${state.x},${state.y}`;
    placedPieces[key] = {
      pieceType: state.piece.id,
      horientation: state.horientation,
      pieceId: state.idPiece
    };
  });

  // Convert piece list to the format expected by the game
  const pieceList = level.pieceList.map(item => {
    const basePiece = {
      pieceType: item.piece.id,
      isUsed: false,
      coordinate: { x: -1, y: -1 },
      piece: null,
      mask: null
    };
    
    // Create an array of n identical pieces based on the nb field
    return Array(item.nb).fill(basePiece);
  }).flat(); // Flatten the array of arrays into a single array

  return c.json({
    level: {
      id: level.id,
      name: level.name,
      difficulty: level.difficulty
    },
    placedPieces,
    pieceList
  });
});

// Create new game state
gamestate.post('/', async (c) => {
  const body = await c.req.json();
  const gameState = await prisma.gameState.create({
    data: {
      idLevel: body.idLevel,
      idPiece: body.idPiece,
      x: body.x,
      y: body.y,
      horientation: body.horientation
    }
  });
  return c.json(gameState, 201);
});

export default gamestate;
