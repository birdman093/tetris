export class Location {
    X: number;
    Y: number;
    constructor(x: number, y: number){
        this.X = x;
        this.Y = y;
    }

    x():number {
        return this.X;
    }

    y():number {
        return this.Y;
    }
}

export abstract class AbstractPiece {
    location: Location;
    rotation: number;
    speed: number;
    abstract style: string;

    constructor(x: number, y: number, rotation: number, speed: number) {
        this.location = new Location(x, y);
        this.rotation = rotation;
        this.speed = speed;
    }

    x(): number {
        return this.location.x();
    }
    
    y(): number {
        return this.location.y();
    }

    abstract getAllPoints(): Location[];

    isPieceAtPoint(x: number, y: number): boolean {
        for (const point of this.getAllPoints()) {
            if (point.x() === x && point.y() === y) {
                return true;
            }
        }
        return false;
    }

    getAllOffsetPoints(x: number, y: number): Location[] {
        const offsetPoints: Location[] = []
        for (const point of this.getAllPoints()){
            offsetPoints.push(new Location(point.x()+x, point.y()+y))
        }
        return offsetPoints;
    }

    getState(): { x: number; y: number; rotation: number; color: string } {
        return {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation,
            color: this.style
        };
    }
}


export class Square extends AbstractPiece {
    style: string = `squarePiece`
    getAllPoints(): Location[]{
        return [new Location(this.x(), this.y()),
            new Location(this.x(), this.y()+1),
            new Location(this.x()+1, this.y()),
            new Location(this.x()+1, this.y()+1)];
    }
}

export class Triangle extends AbstractPiece {
    style: string = `trianglePiece`;
    getAllPoints(): Location[]{
        return [
            new Location(this.x(), this.y()),
            new Location(this.x(), this.y()-1),
            new Location(this.x()+1, this.y()),
            new Location(this.x()-1, this.y())];
    } 
}

export class RightL extends AbstractPiece {
    style: string = `rightLPiece`;
    getAllPoints(): Location[]{
        return [
            new Location(this.x(), this.y()),
            new Location(this.x()-1, this.y()),
            new Location(this.x()+1, this.y()),
            new Location(this.x()+1, this.y()-1)];
    } 
}

export class LeftL extends AbstractPiece {
    style: string = `leftLPiece`;
    getAllPoints(): Location[]{
        return [
            new Location(this.x(), this.y()),
            new Location(this.x()-1, this.y()-1),
            new Location(this.x()+1, this.y()),
            new Location(this.x()-1, this.y())];
    } 
}

export class LeftZ extends AbstractPiece {
    style: string = `leftZPiece`;
    getAllPoints(): Location[]{
        return [
            new Location(this.x(), this.y()),
            new Location(this.x()-1, this.y()),
            new Location(this.x(), this.y()-1),
            new Location(this.x()+1, this.y()-1)];
    } 
}

export class RightZ extends AbstractPiece {
    style: string = `rightZPiece`;
    getAllPoints(): Location[]{
        return [
            new Location(this.x(), this.y()),
            new Location(this.x()+1, this.y()),
            new Location(this.x(), this.y()-1),
            new Location(this.x()-1, this.y()-1)];
    } 
}

export class Line extends AbstractPiece {
    style: string = `linePiece`;
    getAllPoints(): Location[]{
        return [new Location(this.x(), this.y()),
            new Location(this.x()-1, this.y()),
            new Location(this.x()+1, this.y()),
            new Location(this.x()+2, this.y())];
    } 
}

type PieceConstructor = new (x: number, y: number, rotation: number, speed: number) => AbstractPiece;
const Pieces: PieceConstructor[] = [Square, Triangle, RightL, LeftL, RightZ, LeftZ, Line];


export function recreatePieceWOffset(xOffset: number, yOffset: number, 
    rotationOffset: number, piece: AbstractPiece): AbstractPiece{

    const pieceConstructor = piece.constructor as PieceConstructor;
    return new pieceConstructor(
        piece.x() + xOffset, 
        piece.y() + yOffset, 
        piece.rotation + rotationOffset,
        piece.speed
      );
}

export function createPiece(start_x: number, start_y: number): AbstractPiece {
    const randomBlock = Pieces[Math.floor(Math.random() * Pieces.length)];
    if (!randomBlock){
        console.log("ERROR creating piece")
        return new Line(start_x,start_y,0,-1);
    } else {
        return new randomBlock(start_x,start_y,0,-1);
    }
  }


