import DrawableGameCanvas from "./DrawableGameCanvas";
import Vector from "./Vector";

function getHealthProportion(currentHealth: number, maxHealth: number): number {
    if (maxHealth === 0) {
        return 1;
    }
    return currentHealth / maxHealth;
}

class HealthVisualizer {

    currentHealth: number;
    maxHealth: number;
    width: number;
    height: number;
    margin: number;
    
    constructor() {
        this.currentHealth = 0;
        this.maxHealth = 0;
        this.width = 0.25;
        this.height = 0.10;
        this.margin = 0.05;
    }
    
    drawSelf(
        canvas: DrawableGameCanvas,
        offset: Vector = { x: 0, y: 0 }
    ): void {
        const healthProportion = getHealthProportion(this.currentHealth, this.maxHealth);
        canvas.setFillStyle("red");
        canvas.fillRectangle(
            this.margin + offset.x,
            this.margin + offset.y,
            this.width,
            this.height
        );
        canvas.setFillStyle("green");
        canvas.fillRectangle(this.margin, this.margin, healthProportion * this.width, this.height);
    }

    setHealth(currentHealth: number, maxHealth: number): void {
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
    }
}

export default HealthVisualizer;