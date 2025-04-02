const CELLTYPE = {
    empty: {
        id: 1,
        value: "empty"
    },
    full: {
        id: 2,
        value: ""
    },
    WhiteLightSource: {
        id: 3,
        value: "wls"
    },
    WhiteLightCrystal: {
        id: 4,
        value: "wlc"
    },

    GreenLightSource: {
        id: 5,
        value: "gls"
    },
    GreenLightCrystal: {
        id: 6,
        value: "glc"
    },

    BlueLightSource: {
        id: 7,
        value: "bls"
    },
    BlueLightCrystal: {
        id: 8,
        value: "blc"
    },

    RedLightSource: {
        id: 9,
        value: "rls"
    },
    RedLightCrystal: {
        id: 10,
        value: "rlc"
    },

    simpleReflector: {
        id: 11,
        value: "simpleR"
    },
    doubleReflector: {
        id: 12,
        value: "doubleR"
    },
    splitterReflector: {
        id: 13,
        value: "splitterR"
    },
    colorReflector: {
        id: 14,
        value: "colorR"
    },
}

const HORIENTATION = {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
    none: -1
}

const LASERCOLOR = {
    red: {
        id: 0,
        value: 0xFF0000
    },
    green: {
        id: 1,
        value: 0x008000
    },
    blue: {
        id: 2,
        value: 0x0000FF
    },
    white: {
        id: 3,
        value: 0xFFFFFF
    }
}

const SIZE = 50;
const GRID_SIZE = 9;

export { CELLTYPE, HORIENTATION, SIZE, GRID_SIZE };

export default class GridScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GridScene' });
        
        /**
         * Liste des pièces sur la grille
         * @type {{ pieceType: Number, horientation: Number, pieceId: Number, cell: any }[][]}
         * @public
         */
        this.grid = [];
        
        /**
         * Liste des pièces disponibles
         * @type {{ pieceType: Number, horientation: Number, pieceId: Number, cell: any }[][]}
         * @public
         */
        this.pieceList = [];
        
        /**
         * Id de la pièce selectionné
         * @type {Number}
         * @public
         */
        this.selectedPieceId = -1;
        
        /**
         * Liste des source de laser
         * @type {{color: { id: Number, value: Number }, horientation: Number,coordinate: { x: Number, y: Number }}[]}
         * @public
         */
        this.lightSourceList = [];
        
        /**
         * Liste des lasers sur la grille
         * @type {{ xStart: Number, yStart: Number, xEnd: Number, yEnd: Number, color: { id: Number, value: Number } }[]}
         * @public
         */
        this.laserList = [];
        
        /**
         * Liste des lignes affiché sur la grille
         * @type {[]}
         * @public
         */
        this.graphList = [];
        
        /**
         * Liste des crystaux sur la grille
         * @type {{colorId: Number, isSatisfied: Boolean, coordinate: { x: Number, y: Number }}[]}
         * @public
         */
        this.lightCrystalList = [];
        
        /**
         * ID du niveau actuel
         * @type {Number}
         * @public
         */
        this.levelId = 1; // Valeur par défaut
    }

    async loadGameState(levelId) {
        try {
            const response = await fetch(`http://localhost:3001/gamestate/grid/${levelId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading game state:', error);
            return null;
        }
    }

    async init(data) {
        // Récupérer l'ID du niveau depuis les données de scène
        if (data && data.levelId) {
            this.levelId = data.levelId;
        }
        
        // Load game state from API
        const gameState = await this.loadGameState(this.levelId);
        
        // Create empty grid
        this.grid = Array(9).fill(null).map(() => 
            Array(9).fill(null).map(() => ({
                pieceType: CELLTYPE.empty.id,
                horientation: -1,
                pieceId: -1,
                cell: null
            }))
        );

        // If we have game state from API, update the grid with placed pieces
        if (gameState) {
            Object.entries(gameState.placedPieces).forEach(([key, piece]) => {
                const [x, y] = key.split(',').map(Number);
                this.grid[y][x] = {
                    ...piece,
                    cell: null
                };
            });
            console.log(gameState);
            
            // Update piece list
            this.pieceList = gameState.pieceList;
        } else {
            // Fallback to default grid if API call fails
            this.grid = [
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.full.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.GreenLightCrystal.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.RedLightCrystal.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.WhiteLightSource.id, horientation: HORIENTATION.up, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.full.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
                [{ pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }, { pieceType: CELLTYPE.empty.id, horientation: -1, pieceId: -1, cell: null }],
            ];
            this.pieceList = [
                { pieceType: CELLTYPE.simpleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
                { pieceType: CELLTYPE.simpleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
                { pieceType: CELLTYPE.simpleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
                { pieceType: CELLTYPE.doubleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
                { pieceType: CELLTYPE.splitterReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
                { pieceType: CELLTYPE.colorReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
    
            ];
        }

        this.selectedPieceId = -1;
        this.lightSourceList = [];
        this.laserList = [];
        this.graphList = [];
        this.lightCrystalList = [];
    }

    pieceGeneration() {
        const pieceList = this.pieceList;
        for (let i = 0; i < pieceList.length; i++) {
            const pieceInfo = pieceList[i];

            const x = 450 + 55 * i;
            const y = 90;

            let piece;

            switch (pieceInfo.pieceType) {
                case CELLTYPE.simpleReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.simpleReflector.value);
                    break;

                case CELLTYPE.doubleReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.doubleReflector.value);
                    break;

                case CELLTYPE.splitterReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.splitterReflector.value);
                    break;

                case CELLTYPE.colorReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.colorReflector.value);
                    break;

                case CELLTYPE.full.id:
                    piece = this.add.rectangle(x, y, SIZE, SIZE, 0x7f00ff);
                    piece.setStrokeStyle(2, 0xefc53f);
                    break;

                case CELLTYPE.WhiteLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.WhiteLightSource.value);
                    break;

                case CELLTYPE.GreenLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.GreenLightSource.value);
                    break;

                case CELLTYPE.BlueLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.BlueLightSource.value);
                    break;

                case CELLTYPE.RedLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.RedLightSource.value);
                    break;

                case CELLTYPE.WhiteLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.WhiteLightCrystal.value);
                    break;

                case CELLTYPE.GreenLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.GreenLightCrystal.value);
                    break;

                case CELLTYPE.BlueLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.BlueLightCrystal.value);
                    break;

                case CELLTYPE.RedLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.RedLightCrystal.value);
                    break;

                default:
                    piece = this.add.rectangle(x, y, SIZE, SIZE, 0x92e446);
                    break;
            }
            piece.setInteractive();
            piece.on('pointerdown', function (pointer) {

                console.log(`selectedPiece : ${i}`);
                // Si la pièce n'est pas placé, selectionne son id
                if (!this.pieceList[i].isUsed)
                    this.selectedPieceId = i;

            }, this);

            const mask = this.add.rectangle(x, y, SIZE, SIZE, 0x92e446);
            mask.setVisible(false);

            this.pieceList[i].piece = piece;
            this.pieceList[i].mask = mask;
        }

    }
    /**
     * 
     * @param {number} i 
     * @param {boolean} isUsed 
     */
    setPieceUsage(i, isUsed, x, y) {
        this.pieceList[i].piece.setVisible(!isUsed);
        this.pieceList[i].mask.setVisible(isUsed);
        this.pieceList[i].isUsed = isUsed;
        this.pieceList[i].coordinate = { x, y };
    }

    gridGeneration() {
        const grid = this.grid;

        for (let i = 0; i < grid.length; i++) {
            const line = grid[i];
            for (let j = 0; j < line.length; j++) {

                const cellInfo = line[j];

                const x = 450 + 55 * j;
                const y = 150 + 55 * i;

                const cellType = cellInfo.pieceType;
                const horientation = cellInfo.horientation;

                let cell;
                let lightCrystalColor = null;
                let laserSourceColor = null;
                switch (cellType) {
                    case CELLTYPE.empty.id:
                        cell = this.add.image(x, y, CELLTYPE.empty.value);
                        cell.setInteractive();
                        cell.on('pointerdown', function (pointer) {

                            const selectedPieceId = this.selectedPieceId;
                            const pieceType = this.grid[i][j].pieceType;

                            console.log("center : ", this.grid[i][j].cell.getCenter())
                            console.log(`i: ${i},j: ${j}\npieceType: ${pieceType}\nhorientation: ${horientation}\nselectedPieceId: ${selectedPieceId}`);

                            // Si une pièce est selectionné et que la case cible est vide
                            if (selectedPieceId != -1 && pieceType == CELLTYPE.empty.id) {

                                const piece = this.pieceList[selectedPieceId];

                                // Retire la texture de la case d'origine s'il y'en a une
                                if (piece.coordinate.x != -1 && piece.coordinate.y != -1) {
                                    this.removePieceOnGrid(piece.coordinate.x, piece.coordinate.y);
                                }

                                // Cache la piece des choix possible et update les coordonnées
                                this.setPieceUsage(selectedPieceId, true, i, j);

                                this.grid[i][j].cell.setTexture(piece.piece.texture);
                                this.grid[i][j].pieceType = piece.pieceType;
                                this.grid[i][j].pieceId = selectedPieceId;
                                this.grid[i][j].horientation = HORIENTATION.up;

                                this.selectedPieceId = -1;
                                this.setLaser();
                                return;
                            }

                            // Si une pièce placé est selectionné sur la grille
                            if (selectedPieceId == -1 && pieceType != CELLTYPE.empty.id) {
                                this.selectedPieceId = this.grid[i][j].pieceId;
                                return;
                            }

                        }, this);
                        break;

                    case CELLTYPE.full.id:
                        cell = this.add.rectangle(x, y, SIZE, SIZE, 0x7f00ff);
                        cell.setStrokeStyle(2, 0xefc53f);
                        break;

                    case CELLTYPE.WhiteLightCrystal.id:
                        cell = this.add.image(x, y, CELLTYPE.WhiteLightCrystal.value);
                        lightCrystalColor = LASERCOLOR.white;
                        break;

                    case CELLTYPE.WhiteLightSource.id:
                        cell = this.add.image(x, y, CELLTYPE.WhiteLightSource.value);
                        laserSourceColor = LASERCOLOR.white;
                        break;

                    case CELLTYPE.BlueLightCrystal.id:
                        cell = this.add.image(x, y, CELLTYPE.BlueLightCrystal.value);
                        lightCrystalColor = LASERCOLOR.blue;
                        break;

                    case CELLTYPE.BlueLightSource.id:
                        cell = this.add.image(x, y, CELLTYPE.BlueLightSource.value);
                        laserSourceColor = LASERCOLOR.blue;
                        break;

                    case CELLTYPE.GreenLightCrystal.id:
                        cell = this.add.image(x, y, CELLTYPE.GreenLightCrystal.value);
                        lightCrystalColor = LASERCOLOR.green;
                        break;

                    case CELLTYPE.GreenLightSource.id:
                        cell = this.add.image(x, y, CELLTYPE.GreenLightSource.value);
                        laserSourceColor = LASERCOLOR.green;
                        break;

                    case CELLTYPE.RedLightCrystal.id:
                        cell = this.add.image(x, y, CELLTYPE.RedLightCrystal.value);
                        lightCrystalColor = LASERCOLOR.red;
                        break;

                    case CELLTYPE.RedLightSource.id:
                        cell = this.add.image(x, y, CELLTYPE.RedLightSource.value);
                        laserSourceColor = LASERCOLOR.red;
                        break;

                    case CELLTYPE.simpleReflector.id:
                        cell = this.add.image(x, y, CELLTYPE.simpleReflector.value);
                        break;

                    case CELLTYPE.doubleReflector.id:
                        cell = this.add.image(x, y, CELLTYPE.doubleReflector.value);
                        break;

                    case CELLTYPE.splitterReflector.id:
                        cell = this.add.image(x, y, CELLTYPE.splitterReflector.value);
                        break;

                    case CELLTYPE.colorReflector.id:
                        cell = this.add.image(x, y, CELLTYPE.colorReflector.value);
                        break;

                    default:
                        cell = this.add.image(x, y, CELLTYPE.empty.value);
                        break;
                }


                if (lightCrystalColor != null) {
                    this.lightCrystalList.push({
                        coordinate: { x: i, y: j },
                        colorId: lightCrystalColor.id,
                        isSatisfied: false
                    });
                }

                if (laserSourceColor != null) {
                    this.lightSourceList.push({
                        color: laserSourceColor,
                        horientation: horientation,
                        coordinate: { x: i, y: j }
                    })
                }
                this.grid[i][j].cell = cell;
            }
        }
    }

    removePieceOnGrid(x, y) {       
        this.grid[x][y].cell.setTexture(CELLTYPE.empty.value);
        this.grid[x][y].pieceType = CELLTYPE.empty.id;
        this.grid[x][y].horientation = -1;
    }

    pieceControl() {
        const gridWidth = this.grid.length;
        const leftArrow = this.add.image(450 + 55 * (gridWidth + 2), 150 + 55 * 2, 'leftArrow').setInteractive();
        leftArrow.on('pointerdown', function (pointer) {
            if (this.selectedPieceId == -1) {
                return;
            }
            const { x, y } = this.pieceList[this.selectedPieceId].coordinate;
            const { horientation } = this.grid[x][y];
            this.grid[x][y].horientation = this.rotateLeft(horientation);
            this.turnPiece(x, y);
            this.selectedPieceId = -1;
            this.setLaser();
        }, this);

        const rightArrow = this.add.image(450 + 55 * (gridWidth + 3), 150 + 55 * 2, 'rightArrow').setInteractive();
        rightArrow.on('pointerdown', function (pointer) {
            if (this.selectedPieceId == -1) {
                return;
            }
            const { x, y } = this.pieceList[this.selectedPieceId].coordinate;
            const { horientation } = this.grid[x][y];
            this.grid[x][y].horientation = this.rotateRight(horientation)
            this.turnPiece(x, y);
            this.selectedPieceId = -1;
            this.setLaser();
        }, this);
        const cancelButton = this.add.image(450 + 55 * (gridWidth + 4), 150 + 55 * 2, 'cancelButton').setInteractive();
        cancelButton.on('pointerdown', function (pointer) {
            if (this.selectedPieceId == -1) 
                return;

            const pieceId = this.selectedPieceId;
            const { x, y } = this.pieceList[pieceId].coordinate;

             //Si la pièce n'est pas posé
            if(x == -1 || y == -1)
                return;

            this.removePieceOnGrid(x, y);
            this.setPieceUsage(pieceId, false, -1, -1);
            this.selectedPieceId = -1;
            this.setLaser();
        }, this);
    }
    /**
     * rotation horaire
     * @param {*} horientation 
     */
    rotateRight(horientation) {

        return (horientation + 1) % 4
    }
    /**
     * rotation anti-horaire
     * @param {*} horientation 
     */
    rotateLeft(horientation) {
        return ((horientation - 1) + 4) % 4
    }

    turnPiece(x, y) {
        const { cell, horientation } = this.grid[x][y];
        switch (horientation) {
            case HORIENTATION.up:
                cell.setAngle(0);
                break;

            case HORIENTATION.right:
                cell.setAngle(90);
                break;

            case HORIENTATION.down:
                cell.setAngle(180);
                break;

            case HORIENTATION.left:
                cell.setAngle(-90);
                break;

            default:
                break;
        }

    }

    setLaser() {
        this.laserList = [];
        this.graphList.forEach(graph => {
            graph.destroy();
        });
        this.graphList = [];
        const lightSourceList = this.lightSourceList;
        for (let i = 0; i < lightSourceList.length; i++) {
            this.startLaser(lightSourceList[i]);
        }

        // Affiche les lasers
        this.renderLaser();

        // Calcul la fin de partie
        this.checkEnd();
    }

    startLaser(laserInfo) {
        const { color, horientation: laserHorientation, coordinate } = laserInfo;
        const { x: xStart, y: yStart } = coordinate;
        let xStep = 0,
            yStep = 0;
        switch (laserHorientation) {
            case HORIENTATION.up:
                xStep = -1;
                break;

            case HORIENTATION.right:
                yStep = 1;
                break;

            case HORIENTATION.down:
                xStep = 1;
                break;

            case HORIENTATION.left:
                yStep = -1;
                break;

            default:
                break;
        }
        let i = 1;
        let isFinished = false;
        while (!isFinished) {
            const x = (xStep * i) + xStart;
            const y = (yStep * i) + yStart;

            let cellInfo;
            try {
                cellInfo = this.grid[x][y];
                if (cellInfo === undefined)
                    throw new Error();

            } catch (error) {
                // Si en dehors du tableau
                i--;
                isFinished = true;
                this.laserList.push({ xStart, yStart, xEnd: (xStep * i) + xStart, yEnd: (yStep * i) + yStart, color });
                return;
            }
            if (cellInfo.pieceType != CELLTYPE.empty.id) {
                this.laserList.push({ xStart, yStart, xEnd: x, yEnd: y, color });
                isFinished = true;
                if ([CELLTYPE.simpleReflector.id, CELLTYPE.doubleReflector.id].includes(cellInfo.pieceType)) {
                    const horientation = this.getNextSimpleDoubleLaserInfo(cellInfo.pieceType, cellInfo.horientation, laserHorientation);

                    if (horientation != -1)
                        this.startLaser({ color, horientation, coordinate: { x, y } });
                }

                if (CELLTYPE.splitterReflector.id == cellInfo.pieceType) {
                    const { h1, h2 } = this.getNextSplitLaserInfo(cellInfo.horientation, laserHorientation);
                    if (h1 != -1) {
                        this.startLaser({ color, horientation: h1, coordinate: { x, y } });
                        this.startLaser({ color, horientation: h2, coordinate: { x, y } });
                    }
                }
                
                if (CELLTYPE.colorReflector.id == cellInfo.pieceType) {
                    const { redHorientation, greenHorientation, blueHorientation } = this.getNextColorLaserInfo(cellInfo.horientation, laserHorientation);
                    if (redHorientation != -1) {
                        this.startLaser({ color: LASERCOLOR.red, horientation: redHorientation, coordinate: { x, y } });
                        this.startLaser({ color: LASERCOLOR.green, horientation: greenHorientation, coordinate: { x, y } });
                        this.startLaser({ color: LASERCOLOR.blue, horientation: blueHorientation, coordinate: { x, y } });
                    }
                }
            }
            i++;
            if (i > 100) {
                throw new Error("la boucle est cassé")
            }
        }
    }
    /**
     * Récupère les informations du laser qui rentre dans un simple/double reflecteur et renvois
     * la direction du laser
     * @param {*} pieceType 
     * @param {*} pieceHorientation 
     * @param {*} laserHorientation 
     * @returns 
     */
    getNextSimpleDoubleLaserInfo(pieceType, pieceHorientation, laserHorientation) {

        let horientation = -1;
        const simpleR = (pieceType == CELLTYPE.simpleReflector.id);
        const doubleR = (pieceType == CELLTYPE.doubleReflector.id);

        const simpleRUp = simpleR && (pieceHorientation == HORIENTATION.up);
        const simpleRRight = simpleR && (pieceHorientation == HORIENTATION.right);
        const simpleRDown = simpleR && (pieceHorientation == HORIENTATION.down);
        const simpleRLeft = simpleR && (pieceHorientation == HORIENTATION.left);

        const doubleRUD = doubleR && [HORIENTATION.up, HORIENTATION.down].includes(pieceHorientation);
        const doubleRLR = doubleR && [HORIENTATION.left, HORIENTATION.right].includes(pieceHorientation);

        switch (laserHorientation) {
            case HORIENTATION.up:
                if (simpleRUp || doubleRUD) {
                    horientation = HORIENTATION.left;
                }
                if (simpleRLeft || doubleRLR) {
                    horientation = HORIENTATION.right;
                }

                break;

            case HORIENTATION.right:
                if (simpleRUp || doubleRUD) {
                    horientation = HORIENTATION.down;
                }

                if (simpleRRight || doubleRLR) {
                    horientation = HORIENTATION.up;
                }
                break;

            case HORIENTATION.down:
                if (simpleRDown || doubleRUD) {
                    horientation = HORIENTATION.right;
                }

                if (simpleRRight || doubleRLR) {
                    horientation = HORIENTATION.left;
                }
                break;

            case HORIENTATION.left:
                if (simpleRDown || doubleRUD) {
                    horientation = HORIENTATION.up;
                }

                if (simpleRLeft || doubleRLR) {
                    horientation = HORIENTATION.down;
                }
                break;

            default:
                break;
        }

        return horientation;
    }

    /**
     * Récupère les informations du laser qui rentre dans un split reflecteur et renvois
     * la direction des 2 lasers
     * @param {*} pieceType 
     * @param {*} pieceHorientation 
     * @param {*} laserHorientation 
     * @returns 
     */
    getNextSplitLaserInfo(pieceHorientation, laserHorientation) {
        let h1 = -1, h2 = -1;
        if ((pieceHorientation == HORIENTATION.down && laserHorientation == HORIENTATION.up) || (pieceHorientation == HORIENTATION.up && laserHorientation == HORIENTATION.down)) {
            h1 = HORIENTATION.left;
            h2 = HORIENTATION.right;
        }
        if ((pieceHorientation == HORIENTATION.right && laserHorientation == HORIENTATION.left) || (pieceHorientation == HORIENTATION.left && laserHorientation == HORIENTATION.right)) {
            h1 = HORIENTATION.up;
            h2 = HORIENTATION.down;
        }
        return { h1, h2 }
    }

    /**
     * Récupère les informations du laser qui rentre dans un color reflecteur et renvois
     * la direction des 3 lasers
     * @param {*} pieceType 
     * @param {*} pieceHorientation 
     * @param {*} laserHorientation 
     * @returns 
     */
    getNextColorLaserInfo(pieceHorientation, laserHorientation) {
        let redHorientation   = -1, 
            greenHorientation = -1, 
            blueHorientation  = -1;

        if (pieceHorientation == HORIENTATION.left && laserHorientation == HORIENTATION.up) {
            redHorientation = HORIENTATION.left;
            greenHorientation = HORIENTATION.up;
            blueHorientation = HORIENTATION.right;
        }

        if (pieceHorientation == HORIENTATION.up && laserHorientation == HORIENTATION.right) {
            redHorientation = HORIENTATION.up;
            greenHorientation = HORIENTATION.right;
            blueHorientation = HORIENTATION.down;
        }

        if (pieceHorientation == HORIENTATION.right && laserHorientation == HORIENTATION.down) {
            redHorientation = HORIENTATION.right;
            greenHorientation = HORIENTATION.down;
            blueHorientation = HORIENTATION.left;
        }

        if (pieceHorientation == HORIENTATION.down && laserHorientation == HORIENTATION.left) {
            redHorientation = HORIENTATION.down;
            greenHorientation = HORIENTATION.left;
            blueHorientation = HORIENTATION.up;
        }
        return { redHorientation, greenHorientation, blueHorientation };
    }

    renderLaser() {
        const laserList = this.laserList;
        for (let i = 0; i < laserList.length; i++) {

            const { color, xStart, yStart, xEnd, yEnd } = laserList[i];
            const startingCenter = this.grid[xStart][yStart].cell.getCenter();
            const endCenter = this.grid[xEnd][yEnd].cell.getCenter();

            const graph = this.add.graphics();
            graph.lineStyle(4, color.value);
            graph.lineBetween(startingCenter.x, startingCenter.y, endCenter.x, endCenter.y);
            this.graphList.push(graph);
        }
    }

    checkEnd() {
        console.log("checkEnd");

        const lightCrystalList = this.lightCrystalList;

        for (let i = 0; i < lightCrystalList.length; i++) {
            const lightCrystal = lightCrystalList[i];
            for (let j = 0; j < this.laserList.length; j++) {
                const laser = this.laserList[j];

                const xIsValid = lightCrystal.coordinate.x == laser.xEnd;
                const yIsValid = lightCrystal.coordinate.y == laser.yEnd;
                const colorIsValid = lightCrystal.colorId == laser.color.id;

                if(xIsValid && yIsValid && colorIsValid){
                    this.lightCrystalList[i].isSatisfied = true;
                    break;
                }
            }
        }

        for (let i = 0; i < lightCrystalList.length; i++) {
           if(!this.lightCrystalList[i].isSatisfied)
                return;
        }
       
        this.endTitle();        
    }

    endTitle(){
        console.log("GG");
        // Afficher la fin et quitter
        const endText = this.add.text(400, 300, "Vous avez gagné", { fontFamily: 'Arial Black', fontSize: 80, fill: '#FFFFFF' });
        const goBackButton = this.add.text(500, 380, "Revenir à l'accueil", { fontFamily: 'Arial Black', fontSize: 50, fill: '#FFFFFF' })
        .setInteractive()
        .on('pointerover', () => goBackButton.setStyle({ fill: '#FFFF00'}))
        .on('pointerout',  () => goBackButton.setStyle({ fill: '#FFFFFF' }))
        .on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

    }

    preload() {
        this.load.image(CELLTYPE.empty.value, '/static/empty.jpg');

        this.load.image('rightArrow', '/static/rightArrow.jpg');
        this.load.image('leftArrow', '/static/leftArrow.jpg');
        this.load.image('cancelButton', '/static/cancelButton.jpg');

        this.load.image(CELLTYPE.WhiteLightSource.value, '/static/whiteLightSource.jpg');
        this.load.image(CELLTYPE.WhiteLightCrystal.value, '/static/whiteLightCrystal.jpg');

        this.load.image(CELLTYPE.GreenLightSource.value, '/static/greenLightSource.jpg');
        this.load.image(CELLTYPE.GreenLightCrystal.value, '/static/greenLightCrystal.jpg');

        this.load.image(CELLTYPE.BlueLightSource.value, '/static/blueLightSource.jpg');
        this.load.image(CELLTYPE.BlueLightCrystal.value, '/static/blueLightCrystal.jpg');

        this.load.image(CELLTYPE.RedLightSource.value, '/static/redLightSource.jpg');
        this.load.image(CELLTYPE.RedLightCrystal.value, '/static/redLightCrystal.jpg');

        this.load.image(CELLTYPE.simpleReflector.value, '/static/simpleReflector.jpg');
        this.load.image(CELLTYPE.doubleReflector.value, '/static/doubleReflector.jpg');
        this.load.image(CELLTYPE.splitterReflector.value, '/static/splitterReflector.jpg');
        this.load.image(CELLTYPE.colorReflector.value, '/static/colorReflector.jpg');
    }

    create() {
        // Generate the Grid
        this.gridGeneration();
        this.pieceGeneration();

        // Génère les options pour tourner/supprimer une piece
        this.pieceControl();

        // Ajouter un bouton pour revenir à la sélection de niveau
        const backButton = this.add.text(50, 50, 'Retour', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#4a6fa5',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        backButton.on('pointerover', () => {
            backButton.setBackgroundColor('#6389c5');
        });
        
        backButton.on('pointerout', () => {
            backButton.setBackgroundColor('#4a6fa5');
        });
        
        backButton.on('pointerdown', () => {
            backButton.setBackgroundColor('#3a5a8a');
        });
        
        backButton.on('pointerup', () => {
            this.scene.start('LevelSelectScene');
        });
        
        // Génère les lasers
        this.setLaser();
    }
}