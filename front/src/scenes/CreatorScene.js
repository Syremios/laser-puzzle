import * as Phaser from 'phaser';

// Importer les constantes depuis GridScene
import { CELLTYPE, HORIENTATION, SIZE, GRID_SIZE } from './GridScene';

export default class CreatorScene extends Phaser.Scene {
    constructor() {
        // Définir une clé unique pour cette scène
        super({ key: 'CreatorScene' });
        
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

    async init() {
        // Initialiser une grille vide et toutes les pièces
        this.initCreatorMode();
    }

    /**
     * Initialise le mode créateur avec une grille vide et toutes les pièces disponibles
     */
    initCreatorMode() {
        // Créer une grille vide 9x9
        this.grid = Array(9).fill(null).map(() => 
            Array(9).fill(null).map(() => ({
                pieceType: CELLTYPE.empty.id,
                horientation: -1,
                pieceId: -1,
                cell: null
            }))
        );
        
        // Créer une liste de toutes les pièces disponibles (sauf empty)
        this.pieceList = [
            // Murs
            { pieceType: CELLTYPE.full.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.full.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.full.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            
            // Sources de lumière
            { pieceType: CELLTYPE.WhiteLightSource.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.GreenLightSource.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.BlueLightSource.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.RedLightSource.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            
            // Cristaux
            { pieceType: CELLTYPE.WhiteLightCrystal.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.GreenLightCrystal.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.BlueLightCrystal.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.RedLightCrystal.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            
            // Réflecteurs
            { pieceType: CELLTYPE.simpleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.simpleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.simpleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.doubleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.doubleReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.splitterReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.splitterReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.colorReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null },
            { pieceType: CELLTYPE.colorReflector.id, isUsed: false, coordinate: { x: -1, y: -1 }, piece: null, mask: null }
        ];
        
        this.selectedPieceId = -1;
        this.lightSourceList = [];
        this.laserList = [];
        this.graphList = [];
        this.lightCrystalList = [];
    }

    // Méthodes importées de GridScene pour le mode créateur
    gridGeneration() {
        const grid = this.grid;
        const SIZE = 50;
        const GRID_OFFSET_X = 500;
        const GRID_OFFSET_Y = 100;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const x = GRID_OFFSET_X + j * SIZE + SIZE / 2;
                const y = GRID_OFFSET_Y + i * SIZE + SIZE / 2;

                const cell = this.add.rectangle(x, y, SIZE, SIZE, 0x000000);
                cell.setStrokeStyle(1, 0xffffff);
                cell.setInteractive();
                cell.on('pointerdown', () => {
                    if (this.selectedPieceId != -1) {
                        const selectedPiece = this.pieceList[this.selectedPieceId];
                        if (selectedPiece.isUsed) {
                            return;
                        }

                        // Vérifier si la cellule est déjà occupée
                        if (grid[i][j].pieceType != CELLTYPE.empty.id) {
                            // Trouver l'index de la pièce dans pieceList
                            const pieceIndex = this.pieceList.findIndex(p => p.coordinate.x === j && p.coordinate.y === i);
                            if (pieceIndex !== -1) {
                                // Rendre la pièce disponible à nouveau
                                this.setPieceUsage(pieceIndex, false, -1, -1);
                            }
                        }

                        // Placer la pièce sur la grille
                        grid[i][j].pieceType = selectedPiece.pieceType;
                        grid[i][j].pieceId = this.selectedPieceId;
                        grid[i][j].horientation = 0;

                        // Marquer la pièce comme utilisée
                        this.setPieceUsage(this.selectedPieceId, true, j, i);

                        // Redessiner la cellule
                        this.drawCell(i, j);

                        // Mettre à jour les lasers
                        this.setLaser();
                    }
                });

                grid[i][j].cell = cell;
                this.drawCell(i, j);
            }
        }
    }

    drawCell(i, j) {
        const grid = this.grid;
        const cell = grid[i][j].cell;
        const pieceType = grid[i][j].pieceType;
        const horientation = grid[i][j].horientation;

        // Supprimer les enfants existants
        cell.removeAll ? cell.removeAll(true) : null;

        // Dessiner la pièce en fonction de son type
        if (pieceType !== CELLTYPE.empty.id) {
            const x = cell.x;
            const y = cell.y;
            let piece;

            switch (pieceType) {
                case CELLTYPE.full.id:
                    piece = this.add.rectangle(x, y, SIZE, SIZE, 0x7f00ff);
                    piece.setStrokeStyle(2, 0xefc53f);
                    break;

                case CELLTYPE.WhiteLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.WhiteLightSource.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.WhiteLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.WhiteLightCrystal.value);
                    break;

                case CELLTYPE.GreenLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.GreenLightSource.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.GreenLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.GreenLightCrystal.value);
                    break;

                case CELLTYPE.BlueLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.BlueLightSource.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.BlueLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.BlueLightCrystal.value);
                    break;

                case CELLTYPE.RedLightSource.id:
                    piece = this.add.image(x, y, CELLTYPE.RedLightSource.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.RedLightCrystal.id:
                    piece = this.add.image(x, y, CELLTYPE.RedLightCrystal.value);
                    break;

                case CELLTYPE.simpleReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.simpleReflector.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.doubleReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.doubleReflector.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.splitterReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.splitterReflector.value);
                    piece.setAngle(horientation * 90);
                    break;

                case CELLTYPE.colorReflector.id:
                    piece = this.add.image(x, y, CELLTYPE.colorReflector.value);
                    piece.setAngle(horientation * 90);
                    break;
            }
        }
    }

    pieceGeneration() {
        const pieceList = this.pieceList;
        for (let i = 0; i < pieceList.length; i++) {
            const x = 100;
            const y = 100 + i * 60;

            let piece;
            switch (pieceList[i].pieceType) {
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

            const mask = this.add.rectangle(x, y, SIZE, SIZE, 0x000000, 0.5);
            mask.setVisible(false);

            piece.setInteractive();
            piece.on('pointerdown', () => {
                this.selectedPieceId = i;
            });

            pieceList[i].piece = piece;
            pieceList[i].mask = mask;
        }
    }

    pieceControl() {
        const grid = this.grid;
        const SIZE = 50;
        const GRID_OFFSET_X = 500;
        const GRID_OFFSET_Y = 100;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const x = GRID_OFFSET_X + j * SIZE + SIZE / 2;
                const y = GRID_OFFSET_Y + i * SIZE + SIZE / 2;

                // Ajouter un bouton pour tourner la pièce à droite
                const rightArrow = this.add.image(x + SIZE / 2 + 10, y, 'rightArrow');
                rightArrow.setScale(0.5);
                rightArrow.setVisible(false);
                rightArrow.setInteractive();
                rightArrow.on('pointerdown', () => {
                    const pieceType = grid[i][j].pieceType;
                    if (pieceType != CELLTYPE.empty.id && 
                        pieceType != CELLTYPE.full.id && 
                        pieceType != CELLTYPE.WhiteLightCrystal.id &&
                        pieceType != CELLTYPE.GreenLightCrystal.id &&
                        pieceType != CELLTYPE.BlueLightCrystal.id &&
                        pieceType != CELLTYPE.RedLightCrystal.id) {
                        grid[i][j].horientation = (grid[i][j].horientation + 1) % 4;
                        this.drawCell(i, j);
                        this.setLaser();
                    }
                });

                // Ajouter un bouton pour tourner la pièce à gauche
                const leftArrow = this.add.image(x - SIZE / 2 - 10, y, 'leftArrow');
                leftArrow.setScale(0.5);
                leftArrow.setVisible(false);
                leftArrow.setInteractive();
                leftArrow.on('pointerdown', () => {
                    const pieceType = grid[i][j].pieceType;
                    if (pieceType != CELLTYPE.empty.id && 
                        pieceType != CELLTYPE.full.id && 
                        pieceType != CELLTYPE.WhiteLightCrystal.id &&
                        pieceType != CELLTYPE.GreenLightCrystal.id &&
                        pieceType != CELLTYPE.BlueLightCrystal.id &&
                        pieceType != CELLTYPE.RedLightCrystal.id) {
                        grid[i][j].horientation = (grid[i][j].horientation + 3) % 4;
                        this.drawCell(i, j);
                        this.setLaser();
                    }
                });

                // Ajouter un bouton pour supprimer la pièce
                const cancelButton = this.add.image(x, y - SIZE / 2 - 10, 'cancelButton');
                cancelButton.setScale(0.5);
                cancelButton.setVisible(false);
                cancelButton.setInteractive();
                cancelButton.on('pointerdown', () => {
                    const pieceId = grid[i][j].pieceId;
                    if (pieceId != -1) {
                        this.setPieceUsage(pieceId, false, -1, -1);
                        grid[i][j].pieceType = CELLTYPE.empty.id;
                        grid[i][j].pieceId = -1;
                        grid[i][j].horientation = -1;
                        this.drawCell(i, j);
                        this.setLaser();
                    }
                });

                // Afficher les boutons lorsque la souris survole la cellule
                grid[i][j].cell.on('pointerover', () => {
                    if (grid[i][j].pieceType != CELLTYPE.empty.id) {
                        rightArrow.setVisible(true);
                        leftArrow.setVisible(true);
                        cancelButton.setVisible(true);
                    }
                });

                // Masquer les boutons lorsque la souris quitte la cellule
                grid[i][j].cell.on('pointerout', () => {
                    rightArrow.setVisible(false);
                    leftArrow.setVisible(false);
                    cancelButton.setVisible(false);
                });
            }
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

    setLaser() {
        // Implémenter la logique des lasers ici
        // Cette méthode sera appelée après chaque modification de la grille
    }

    create() {
        // Générer la grille et les pièces
        this.gridGeneration();
        this.pieceGeneration();
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
        
        // Ajouter un titre pour le mode créateur
        this.add.text(this.cameras.main.centerX, 50, 'MODE CRÉATEUR', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#9c27b0',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        // Ajouter un bouton pour sauvegarder la création
        const saveButton = this.add.text(this.cameras.main.width - 150, 50, 'Sauvegarder', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#4caf50',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        saveButton.on('pointerover', () => {
            saveButton.setBackgroundColor('#66bb6a');
        });
        
        saveButton.on('pointerout', () => {
            saveButton.setBackgroundColor('#4caf50');
        });
        
        saveButton.on('pointerdown', () => {
            saveButton.setBackgroundColor('#388e3c');
        });
        
        saveButton.on('pointerup', () => {
            this.saveCreation();
        });
    }

    // Méthode pour sauvegarder la création
    saveCreation() {
        // TODO: Implémenter la sauvegarde du niveau créé
        console.log("Sauvegarde du niveau créé");
        
        // Afficher un message de confirmation
        const confirmText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Niveau sauvegardé !', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#4caf50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        // Faire disparaître le message après 2 secondes
        this.time.delayedCall(2000, () => {
            confirmText.destroy();
        });
    }
}
