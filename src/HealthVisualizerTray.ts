import DrawableGameCanvas from "./DrawableGameCanvas";
import HealthVisualizer from "./HealthVisualizer";
import { HealthInfo } from "./InterfaceUtils";

class HealthVisualizerTray {

    healthVisualizers: HealthVisualizer[];

    constructor() {
        this.healthVisualizers = [];
    }

    addHealthVisualizer(healthVisualizer: HealthVisualizer): void {
        this.healthVisualizers.push(healthVisualizer);
    }

    // drawSelf(guiCanvas: DrawableGameCanvas): void {
    //     this.healthVisualizers.forEach(
    //         (healthVisualizer) => healthVisualizer.drawSelf(guiCanvas)
    //     );
    // }

    drawSelf(
        guiCanvas: DrawableGameCanvas,
        characterHealths: Map<string, HealthInfo>
    ): void {
        const orderedKeys = Array.from(characterHealths.keys()).sort();
        const healthVisualizer = new HealthVisualizer();
        orderedKeys.forEach((key, index) => {
            const healthInfo = characterHealths.get(key);
            if (!healthInfo) {
                return;
            }
            healthVisualizer.setHealth(healthInfo.health, healthInfo.maxHealth);
            healthVisualizer.drawSelf(guiCanvas, { x: 0 + (index * 0.30), y: 0 });
        });
    }
}

export default HealthVisualizerTray;
