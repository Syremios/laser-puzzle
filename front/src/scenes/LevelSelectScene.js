class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
        this.levels = [];
        this.levelButtons = [];
        this.isLoading = true;
    }

    preload() {
        // Charger les ressources nécessaires
        
    }

    async init() {
        this.isLoading = true;
        // Récupérer la liste des niveaux depuis l'API
        try {
            const response = await fetch('http://localhost:3001/levels')
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }            
            this.levels = await response.json();
            console.log("Levels loaded in init:", this.levels);
        } catch (error) {
            console.error('Error loading levels:', error);
            this.levels = []; // En cas d'erreur, utiliser une liste vide
        } finally {
            this.isLoading = false;
        }
    }

    create() {
        // Ajouter un titre
        this.add.text(this.cameras.main.centerX, 100, 'SÉLECTION DE NIVEAU', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Afficher un message de chargement si les données ne sont pas encore prêtes
        this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Chargement des niveaux...', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Vérifier si les données sont déjà chargées
        if (!this.isLoading) {
            this.displayLevels();
        } else {
            // Sinon, attendre que les données soient chargées
            this.checkDataLoaded();
        }
    }

    checkDataLoaded() {
        // Vérifier périodiquement si les données sont chargées
        if (!this.isLoading) {
            this.loadingText.destroy();
            this.displayLevels();
        } else {
            setTimeout(() => this.checkDataLoaded(), 100);
        }
    }

    displayLevels() {
        console.log("Displaying levels:", this.levels);
        
        // Si aucun niveau n'est disponible, afficher un message
        if (!this.levels || this.levels.length === 0) {
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Aucun niveau disponible', {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5);
            return;
        }

        // Créer un bouton pour chaque niveau
        const startY = 200;
        const buttonHeight = 80;
        const spacing = 20;

        // Ajouter un bouton Creator en haut de la liste
        const creatorButtonContainer = this.add.container(this.cameras.main.centerX, startY);
        
        // Fond du bouton Creator
        const creatorButtonBg = this.add.rectangle(0, 0, 300, buttonHeight, 0x9c27b0).setOrigin(0.5);
        creatorButtonBg.setInteractive({ useHandCursor: true });
        
        // Texte du bouton Creator
        const creatorText = this.add.text(0, 0, 'Mode Créateur', {
            fontSize: '24px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Ajouter les éléments au conteneur
        creatorButtonContainer.add([creatorButtonBg, creatorText]);
        
        // Ajouter des événements au bouton
        creatorButtonBg.on('pointerover', () => {
            creatorButtonBg.setFillStyle(0xba68c8);
        });
        
        creatorButtonBg.on('pointerout', () => {
            creatorButtonBg.setFillStyle(0x9c27b0);
        });
        
        creatorButtonBg.on('pointerdown', () => {
            creatorButtonBg.setFillStyle(0x7b1fa2);
        });
        
        creatorButtonBg.on('pointerup', () => {
            this.startCreatorMode();
        });
        
        // Ajuster la position de départ pour les niveaux
        const levelsStartY = startY + buttonHeight + spacing;

        this.levels.forEach((level, index) => {
            const y = levelsStartY + index * (buttonHeight + spacing);
            
            // Créer un conteneur pour le bouton
            const buttonContainer = this.add.container(this.cameras.main.centerX, y);
            
            // Fond du bouton
            const buttonBg = this.add.rectangle(0, 0, 300, buttonHeight, 0x4a6fa5).setOrigin(0.5);
            buttonBg.setInteractive({ useHandCursor: true });
            
            // Texte du niveau
            const levelText = this.add.text(0, -15, `Niveau ${level.id}: ${level.name}`, {
                fontSize: '20px',
                fill: '#fff'
            }).setOrigin(0.5);
            
            // Texte de difficulté
            const difficultyText = this.add.text(0, 15, `Difficulté: ${this.getDifficultyText(level.difficulty)}`, {
                fontSize: '16px',
                fill: '#fff'
            }).setOrigin(0.5);
            
            // Ajouter les éléments au conteneur
            buttonContainer.add([buttonBg, levelText, difficultyText]);
            
            // Ajouter des événements au bouton
            buttonBg.on('pointerover', () => {
                buttonBg.setFillStyle(0x6389c5);
            });
            
            buttonBg.on('pointerout', () => {
                buttonBg.setFillStyle(0x4a6fa5);
            });
            
            buttonBg.on('pointerdown', () => {
                buttonBg.setFillStyle(0x3a5a8a);
            });
            
            buttonBg.on('pointerup', () => {
                this.startLevel(level.id);
            });
            
            this.levelButtons.push(buttonContainer);
        });
    }

    getDifficultyText(difficulty) {
        switch(difficulty) {
            case 1: return 'Facile';
            case 2: return 'Moyen';
            case 3: return 'Difficile';
            case 4: return 'Expert';
            default: return 'Inconnu';
        }
    }

    startLevel(levelId) {
        // Passer à la scène du jeu avec l'ID du niveau sélectionné
        this.scene.start('GridScene', { levelId });
    }

    startCreatorMode() {
        // Passer à la scène du créateur
        this.scene.start('CreatorScene');
    }
}

export default LevelSelectScene;
