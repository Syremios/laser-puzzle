import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create pieces
  const pieces = await Promise.all([
    prisma.piece.create({ data: { type: 'Empty' } }),
    prisma.piece.create({ data: { type: 'Full' } }),
    prisma.piece.create({ data: { type: 'WhiteLightCrystal' } }),
    prisma.piece.create({ data: { type: 'WhiteLightSource' } }),
    prisma.piece.create({ data: { type: 'GreenLightCrystal' } }),
    prisma.piece.create({ data: { type: 'GreenLightSource' } }),
    prisma.piece.create({ data: { type: 'BlueLightCrystal' } }),
    prisma.piece.create({ data: { type: 'BlueLightSource' } }),
    prisma.piece.create({ data: { type: 'RedLightCrystal' } }),
    prisma.piece.create({ data: { type: 'RedLightSource' } }),
    prisma.piece.create({ data: { type: 'simpleReflector' } }),
    prisma.piece.create({ data: { type: 'doubleReflector' } }),
    prisma.piece.create({ data: { type: 'splitterReflector' } }),
    prisma.piece.create({ data: { type: 'colorReflector' } })
  ]);

  // Create test level
  const level = await prisma.levels.create({
    data: {
      name: 'test',
      difficulty: 1
    }
  });

  // Add game states
  await Promise.all([
    prisma.gameState.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'GreenLightCrystal').id,
        x: 4,
        y: 2,
        horientation: -1
      }
    }),
    prisma.gameState.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'RedLightCrystal').id,
        x: 0,
        y: 5,
        horientation: -1
      }
    }),
    prisma.gameState.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'WhiteLightSource').id,
        x: 2,
        y: 5,
        horientation: 0
      }
    }),
    prisma.gameState.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'Full').id,
        x: 2,
        y: 2,
        horientation: -1
      }
    }),
    prisma.gameState.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'Full').id,
        x: 3,
        y: 6,
        horientation: -1
      }
    })
  ]);

  // Add piece list with quantities
  await Promise.all([
    // 3 simple reflectors
    prisma.pieceList.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'simpleReflector').id,
        nb: 3
      }
    }),
    // 1 double reflector
    prisma.pieceList.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'doubleReflector').id,
        nb: 1
      }
    }),
    // 1 splitter reflector
    prisma.pieceList.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'splitterReflector').id,
        nb: 1
      }
    }),
    // 1 color reflector
    prisma.pieceList.create({
      data: {
        idLevel: level.id,
        idPiece: pieces.find(p => p.type === 'colorReflector').id,
        nb: 1
      }
    })
  ]);

  console.log('Database seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
