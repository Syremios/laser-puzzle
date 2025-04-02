import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';

const swagger = new Hono();

// Mount Swagger UI at /swagger
swagger.get('/swagger', swaggerUI({
  url: '/openapi'
}));

// Mount OpenAPI JSON at /openapi
swagger.get('/openapi', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'Laser Puzzle API',
      version: '1.0.0',
      description: 'API for managing laser puzzle game states, levels, and pieces',
    },
    paths: {
      '/levels': {
        get: {
          summary: 'Get all levels',
          responses: {
            '200': {
              description: 'List of all levels',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Level'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new level',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LevelInput'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Level created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Level'
                  }
                }
              }
            }
          }
        }
      },
      '/levels/{id}': {
        get: {
          summary: 'Get a specific level',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Level details with game states',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LevelWithGameStates'
                  }
                }
              }
            },
            '404': {
              description: 'Level not found'
            }
          }
        }
      },
      '/gamestate/{levelId}': {
        get: {
          summary: 'Get game states for a level',
          parameters: [
            {
              name: 'levelId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            '200': {
              description: 'List of game states for the level',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/GameState'
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/gamestate': {
        post: {
          summary: 'Create a new game state',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GameStateInput'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Game state created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/GameState'
                  }
                }
              }
            }
          }
        }
      },
      '/pieces': {
        get: {
          summary: 'Get all pieces',
          responses: {
            '200': {
              description: 'List of all pieces',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Piece'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new piece',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PieceInput'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Piece created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Piece'
                  }
                }
              }
            }
          }
        }
      },
      '/pieces/{id}': {
        put: {
          summary: 'Update an existing piece',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PieceInput'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Piece updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Piece'
                  }
                }
              }
            },
            '404': {
              description: 'Piece not found'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Level: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            difficulty: { type: 'integer' }
          }
        },
        LevelInput: {
          type: 'object',
          required: ['name', 'difficulty'],
          properties: {
            name: { type: 'string' },
            difficulty: { type: 'integer' }
          }
        },
        LevelWithGameStates: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            difficulty: { type: 'integer' },
            gameStates: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/GameState'
              }
            }
          }
        },
        GameState: {
          type: 'object',
          properties: {
            idLevel: { type: 'integer' },
            idPiece: { type: 'integer' },
            x: { type: 'integer' },
            y: { type: 'integer' },
            horientation: { type: 'integer' },
            piece: {
              $ref: '#/components/schemas/Piece'
            }
          }
        },
        GameStateInput: {
          type: 'object',
          required: ['idLevel', 'idPiece', 'x', 'y', 'horientation'],
          properties: {
            idLevel: { type: 'integer' },
            idPiece: { type: 'integer' },
            x: { type: 'integer' },
            y: { type: 'integer' },
            horientation: { type: 'integer' }
          }
        },
        Piece: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { 
              type: 'string',
              enum: [
                'Empty',
                'Full',
                'WhiteLightCrystal',
                'WhiteLightSource',
                'GreenLightCrystal',
                'GreenLightSource',
                'BlueLightCrystal',
                'BlueLightSource',
                'RedLightCrystal',
                'RedLightSource',
                'simpleReflector',
                'doubleReflector',
                'splitterReflector',
                'colorReflector'
              ]
            }
          }
        },
        PieceInput: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: [
                'Empty',
                'Full',
                'WhiteLightCrystal',
                'WhiteLightSource',
                'GreenLightCrystal',
                'GreenLightSource',
                'BlueLightCrystal',
                'BlueLightSource',
                'RedLightCrystal',
                'RedLightSource',
                'simpleReflector',
                'doubleReflector',
                'splitterReflector',
                'colorReflector'
              ]
            }
          }
        }
      }
    }
  });
});

export default swagger;
