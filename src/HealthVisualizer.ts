import DrawableCanvas from "./DrawableCanvas";

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
        this.width = 100;
        this.height = 15;
        this.margin = 15;
    }
    
    drawSelf(
        canvas: DrawableCanvas,
    ): void {
        const healthProportion = getHealthProportion(this.currentHealth, this.maxHealth);
        canvas.setFillStyle("red");
        canvas.fillRectangle(this.margin, this.margin, this.width, this.height);
        canvas.setFillStyle("green");
        canvas.fillRectangle(this.margin, this.margin, healthProportion * this.width, this.height);
    }

    setHealth(currentHealth: number, maxHealth: number): void {
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
    }
}

export default HealthVisualizer;