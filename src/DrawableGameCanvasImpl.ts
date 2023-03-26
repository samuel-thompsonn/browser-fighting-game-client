import DrawableGameCanvas from "./DrawableGameCanvas";
import Vector from "./Vector";

class DrawableGameCanvasImpl implements DrawableGameCanvas {

    canvasContext: CanvasRenderingContext2D;
    widthUnits: number;
    heightUnits: number;
    position: Vector;

    constructor(
        canvas: CanvasRenderingContext2D,
        widthUnits: number,
        heightUnits: number,
        position: Vector,
    ) {
        this.canvasContext = canvas;
        this.widthUnits = widthUnits;
        this.heightUnits = heightUnits;
        this.position = position;
    }

    drawText(
        text: string,
        outputX: number,
        outputY: number,
        fontSize: number,
        fillColor: string,
        strokeColor?: string,
    ): void {
        const canvasOutputCoords = this.worldSpaceToCanvasSpace({ x: outputX, y: outputY });
        this.canvasContext.font = `${fontSize}px calibri`
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.fillText(text, canvasOutputCoords.x, canvasOutputCoords.y);
        if (strokeColor) {
            this.canvasContext.strokeStyle = strokeColor;
            this.canvasContext.strokeText(text, canvasOutputCoords.x, canvasOutputCoords.y);
        }
    }

    getWidth(): number {
        return this.widthUnits;
    }

    getHeight(): number {
        return this.heightUnits;
    }

    // Translates output into canvas space,
    // where width is 140 units and height is 90 units
    drawImage(
        image: CanvasImageSource,
        sourceX: number,
        sourceY: number,
        sourceWidth: number,
        sourceHeight: number,
        outputX: number,
        outputY: number,
        outputWidth: number,
        outputHeight: number,
    ): void {
        const canvasOutputCoords = this.worldSpaceToCanvasSpace({ x: outputX, y: outputY });
        const canvasImageDimensions = this.worldSpaceToCanvasSpaceScale(
            { x: outputWidth, y: outputHeight });
        this.canvasContext.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            canvasOutputCoords.x,
            canvasOutputCoords.y,
            canvasImageDimensions.x,
            canvasImageDimensions.y
        );
    }
    
    setAlpha(alpha: number): void {
        this.canvasContext.globalAlpha = alpha;
    }

    setFillStyle(color: string): void {
        this.canvasContext.fillStyle = color;
    }

    fillRectangle(
        outputX: number,
        outputY: number,
        outputWidth: number,
        outputHeight: number,
    ): void {
        const canvasOutputCoords = this.worldSpaceToCanvasSpace({ x: outputX, y: outputY });
        const canvasImageDimensions = this.worldSpaceToCanvasSpaceScale(
            { x: outputWidth, y: outputHeight });
        this.canvasContext.fillRect(
            canvasOutputCoords.x,
            canvasOutputCoords.y,
            canvasImageDimensions.x,
            canvasImageDimensions.y
        );
    }

    strokeRectangle(outputX: number, outputY: number, outputWidth: number, outputHeight: number): void {
        const canvasOutputCoords = this.worldSpaceToCanvasSpace({ x: outputX, y: outputY });
        const canvasImageDimensions = this.worldSpaceToCanvasSpaceScale(
            { x: outputWidth, y: outputHeight });
        this.canvasContext.strokeRect(
            canvasOutputCoords.x,
            canvasOutputCoords.y,
            canvasImageDimensions.x,
            canvasImageDimensions.y
        );
    }

    clear(): void {
        const { width, height } = this.canvasContext.canvas;
        this.canvasContext.clearRect(0, 0, width, height);
        this.setFillStyle("green");
        this.canvasContext.fillRect(
            0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.width
        );
    }

    // Private method
    worldSpaceToCanvasSpace({ x, y }: Vector): Vector {
        const { width, height } = this.canvasContext.canvas;
        return {
            x: (x - this.position.x) / this.widthUnits * width,
            y: (y - this.position.y) / this.heightUnits * height
        };
    }

    worldSpaceToCanvasSpaceScale({ x, y }: Vector): Vector {
        const { width, height } = this.canvasContext.canvas;
        return {
            x: (x / this.widthUnits) * width,
            y: (y / this.heightUnits) * height
        };

    }
}

export default DrawableGameCanvasImpl;