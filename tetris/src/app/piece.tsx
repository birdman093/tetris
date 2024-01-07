export class Piece {
    x: number;
    y: number;
    rotation: number;
    color: string;

    constructor(x: number, y: number, rotation: number, color: string) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.color = color;
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setRotation(rotation: number): void {
        this.rotation = rotation;
    }

    setColor(color: string): void {
        this.color = color;
    }

    getState(): { x: number; y: number; rotation: number; color: string } {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            color: this.color
        };
    }
}
