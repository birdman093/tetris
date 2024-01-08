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

export class Piece {
    location: Location
    rotation: number;
    color: string;
    speed: number;

    constructor(x: number, y: number, rotation: number, speed: number, color: string) {
        this.location = new Location(x, y);
        this.rotation = rotation;
        this.speed = speed;
        this.color = color;
    }

    setColor(color: string): void {
        this.color = color;
    }

    x(): number {
        return this.location.x();
    }
    
    y(): number {
        return this.location.y();
    }

    getAllPoints(): Location[]{
        return [new Location(this.x(), this.y()),
            new Location(this.x(), this.y()-1),
            new Location(this.x(), this.y()+1),
            new Location(this.x()+1, this.y()+1),
            new Location(this.x()+1, this.y()),
            new Location(this.x()+1, this.y()-1),
            new Location(this.x()-1, this.y()+1),
            new Location(this.x()-1, this.y()),
            new Location(this.x()-1, this.y()-1)];
    }

    getAllOffsetPoints(x: number, y: number): Location[]{
        return [new Location(this.x()+x, this.y()+y),
            new Location(this.x()+x, this.y()-1+y),
            new Location(this.x()+x, this.y()+1+y),
            new Location(this.x()+1+x, this.y()+1+y),
            new Location(this.x()+1+x, this.y()+y),
            new Location(this.x()+1+x, this.y()-1+y),
            new Location(this.x()-1+x, this.y()+1+y),
            new Location(this.x()-1+x, this.y()+y),
            new Location(this.x()-1+x, this.y()-1+y)];
    }

    getState(): { x: number; y: number; rotation: number; color: string } {
        return {
            x: this.x(),
            y: this.y(),
            rotation: this.rotation,
            color: this.color
        };
    }
}
