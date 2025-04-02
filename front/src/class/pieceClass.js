
/**
 * Classe qui stocke les informations du pièce placable
 */
export default class Piece {

    constructor(pieceType){
        // Le type de piece
        this.pieceType = pieceType;

        // Est-ce que la piece est placé
        this.isUsed = false;

        // Localisation en abscisse sur la grille
        this.x = -1;

        // Localisation en ordonnée sur la grille
        this.y = -1;
    }

    getPieceType(){
        return this.pieceType;
    }

    getUsed(){
        return this.isUsed;
    }

    setUsed(isUsed){
        this.isUsed = isUsed;
    }

    getCoordinate(){
        return {
            x:this.x,
            y:this.y
        }
    }
    setCoordinate(x,y){
        this.x = x;
        this.y = y;
    }
}