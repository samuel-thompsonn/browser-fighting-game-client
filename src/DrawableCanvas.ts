interface DrawableCanvas {

    // Returns width in canvas space, not necessarily pixels
    getWidth(): number;

    // Returns width in canvas space, not necessarily pixels
    getHeight(): number;

    clear(): void;

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
    ): void;

    setFillStyle(color: string): void;

    setAlpha(alpha: number): void;

    fillRectangle(
        outputX: number,
        outputY: number,
        outputWidth: number,
        outputHeight: number,
    ): void;

    strokeRectangle(
        outputX: number,
        outputY: number,
        outputWidth: number,
        outputHeight: number,
    ): void;
}

export default DrawableCanvas;