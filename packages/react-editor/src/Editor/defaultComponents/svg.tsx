import * as React from "react";

export interface SVGTextProps {
    width: number;
    height: number;
    text: string;
    style: Record<string, any>;
    textStyle?: Record<string, any>;
}
export const SVGText = React.forwardRef<SVGSVGElement, SVGTextProps>((props, ref) => {
    const {
        width,
        height,
        text,
        style,
        textStyle = style,
    } = props;
    const [defaultLineHeight, setDefaultLineHeight] = React.useState(0);
    const [baselineOffset, setBaselineOffset] = React.useState(0);
    const textRef = React.useRef<SVGTextElement>(null);

    React.useEffect(() => {
        const textBox = textRef.current!;
        const observer = new ResizeObserver(() => {
            const bbox = textBox.getBBox();

            // baseline인 경우
            setDefaultLineHeight(-bbox.y);
            setBaselineOffset(-bbox.height - bbox.y);
        });

        observer.observe(textBox, { box: "content-box" });

        return () => {
            observer.disconnect();
        };
    }, []);
    return <svg viewBox={`0 0 ${width} ${height}`} ref={ref}>
        <text y="0" x={width + 10} style={{
            ...textStyle,
            alignmentBaseline: "baseline",
        }} ref={textRef}>x1</text>
        <text y="0" x="50" style={{
            ...textStyle,
            alignmentBaseline: "hanging",
        }}>sign in</text>
        <foreignObject x="0" y={baselineOffset} width={width} height={height - baselineOffset} >
            <div style={{
                lineHeight: `${defaultLineHeight}px`,
                ...style,
            }} dangerouslySetInnerHTML={{
                __html: text.replace(/[\r\n]/g, "<br />"),
            }}></div>
        </foreignObject>
    </svg>;
});

SVGText.displayName = "SVGText";
