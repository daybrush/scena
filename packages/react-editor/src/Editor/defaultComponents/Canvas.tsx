import * as React from "react";

export interface CanvasProps {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useImperativeHandle(ref, () => canvasRef.current!, []);
    React.useEffect(() => {
        const canvasElement = canvasRef.current!;
        const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;

        const { width, height, data: rgba } = props;
        const imageData = context.createImageData(width, height);

        canvasElement.width = width;
        canvasElement.height = height;
        imageData.data.set(rgba);
        context.putImageData(imageData, 0, 0);
    }, []);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
});
Canvas.displayName = "Canvas";
