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
    abstract style: string;
    abstract configurations: Location[][];
    abstract configuration0: Location[];

    constructor(x: number, y: number, rotation: number) {
        this.location = new Location(x, y);
        this.rotation = rotation;
    }

    x(): number {
        return this.location.x();
    }
    
    y(): number {
        return this.location.y();
    }

    getAllPoints(): Location[]{
        const currentconfiguration = 
        this.configurations[this.rotation%this.configurations.length];
        if (currentconfiguration){
            return currentconfiguration;
        } else {
            return this.configuration0;
        }
    }

    isPieceAtPoint(x: number, y: number): boolean {
        for (const point of this.getAllPoints()) {
            if (point.x() === x && point.y() === y) {
                return true;
            }
        }
        return false;
    }

    getAllOffsetPoints(xOffset: number, yOffset: number, rotationOffset: number): Location[] {
        // rotation Offset
        let currentconfiguration = 
        this.configurations[(this.rotation + rotationOffset)
            %this.configurations.length];
        if (!currentconfiguration){
            currentconfiguration = this.configuration0;
        }

        // x, y Offset
        const offsetPoints: Location[] = []
        for (const point of currentconfiguration){
            offsetPoints.push(new Location(point.x()+xOffset, point.y()+yOffset))
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
    configuration0: Location[] = [new Location(this.x(), this.y()),
        new Location(this.x(), this.y()+1),
        new Location(this.x()+1, this.y()),
        new Location(this.x()+1, this.y()+1)
    ]
    configurations: Location[][] = [this.configuration0];
}

export class Triangle extends AbstractPiece {
    style: string = `trianglePiece`;
    configuration0: Location[] = [new Location(this.x(), this.y()),
    new Location(this.x(), this.y()-1),
    new Location(this.x()+1, this.y()),
    new Location(this.x()-1, this.y())];
    configuration1: Location[] = [new Location(this.x(), this.y()),
        new Location(this.x(), this.y()-1),
        new Location(this.x()+1, this.y()),
        new Location(this.x(), this.y()+1)];
    configuration2: Location[] = [new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x(), this.y()+1)];
    configuration3: Location[] = [new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()),
        new Location(this.x(), this.y()-1),
        new Location(this.x(), this.y()+1)];

    configurations: Location[][] = [this.configuration0, this.configuration1,
    this.configuration2, this.configuration3];
}

export class RightL extends AbstractPiece {
    style: string = `rightLPiece`;
    configuration0: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x()+1, this.y()-1)]; 
    configuration1: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x(), this.y()+1),
        new Location(this.x(), this.y()-1),
        new Location(this.x()+1, this.y()+1)];
    configuration2: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x()-1, this.y()+1)]; 
    configuration3: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x(), this.y()+1),
        new Location(this.x(), this.y()-1),
        new Location(this.x()-1, this.y()-1)];

    configurations: Location[][] = [this.configuration0, this.configuration1,
        this.configuration2, this.configuration3];
}

export class LeftL extends AbstractPiece {
    style: string = `leftLPiece`;
    configuration0: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()-1),
        new Location(this.x()+1, this.y()),
        new Location(this.x()-1, this.y())
    ];
    configuration1: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()+1, this.y()-1),
        new Location(this.x(), this.y()+1),
        new Location(this.x(), this.y()-1)
    ];
    configuration2: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()+1, this.y()+1),
        new Location(this.x()+1, this.y()),
        new Location(this.x()-1, this.y())
    ];
    configuration3: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()+1),
        new Location(this.x(), this.y()+1),
        new Location(this.x(), this.y()-1)
    ];

    configurations: Location[][] = [this.configuration0, this.configuration1,
        this.configuration2, this.configuration3];
}

export class LeftZ extends AbstractPiece {
    style: string = `leftZPiece`;
    configuration0: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()),
        new Location(this.x(), this.y()-1),
        new Location(this.x()+1, this.y()-1)];
    
    configuration1: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x(), this.y()-1),
        new Location(this.x()+1, this.y()+1)];
    configurations: Location[][] = [this.configuration0, this.configuration1];
}

export class RightZ extends AbstractPiece {
    style: string = `rightZPiece`;
    configuration0: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x(), this.y()-1),
        new Location(this.x()-1, this.y()-1)];
    configuration1: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x(), this.y()+1),
        new Location(this.x()+1, this.y()-1)];
    configurations: Location[][] = [this.configuration0, this.configuration1];
}

export class Line extends AbstractPiece {
    style: string = `linePiece`;
    configuration0: Location[] = [
        new Location(this.x(), this.y()),
        new Location(this.x()-1, this.y()),
        new Location(this.x()+1, this.y()),
        new Location(this.x()+2, this.y())]

    configuration1: Location[] = [
        new Location(this.x(), this.y()-2),
        new Location(this.x(), this.y()-1),
        new Location(this.x(), this.y()),
        new Location(this.x(), this.y()+1)]

    configurations: Location[][] = [this.configuration0, this.configuration1];
}

type PieceConstructor = 
new (x: number, y: number, rotation: number) => AbstractPiece;
const Pieces: PieceConstructor[] = 
[Square, Triangle, RightL, LeftL, RightZ, LeftZ, Line];


export function recreatePieceWOffset(xOffset: number, yOffset: number, 
    rotationOffset: number, piece: AbstractPiece): AbstractPiece{

    const pieceConstructor = piece.constructor as PieceConstructor;
    return new pieceConstructor(
        piece.x() + xOffset, 
        piece.y() + yOffset, 
        piece.rotation + rotationOffset
      );
}

export function createPiece(start_x: number, start_y: number): AbstractPiece {
    const randomBlock = Pieces[Math.floor(Math.random() * Pieces.length)];
    if (!randomBlock){
        console.log("ERROR creating piece")
        return new Line(start_x,start_y,0);
    } else {
        return new randomBlock(start_x,start_y,0);
    }
  }


