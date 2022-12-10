/* eslint-disable max-len */
import * as React from "react";

export function MoveToolIcon() {
    return <svg viewBox="0 0 80 80">
        <path
            d="M 21,21 L 35,60 L 40,44 L 54,58 A 3,3 0,0,0, 58,54 L 44,40 L 60,35 L 21,21Z"
            fill="#222" strokeLinejoin="round"
            strokeWidth="3" stroke="#eee"
            style={{ transformOrigin: "42px 42px", transform: "rotate(10deg)" }} />
    </svg>;
}

export function FontIcon() {
    return <svg viewBox="0 0 80 80">
        <path
            d="M64.286,17.81L20.714,17.81L20.714,29.56L29.214,23L39.262,23L39.262,55.476L27.77,61.262L27.77,62.071L57.23,62.071L57.23,61.262L45.738,55.476L45.738,23L55.786,23L64.286,29.56L64.286,17.81Z"
            style={{ fill: "white" }} />
    </svg>;
}

export function CropIcon() {
    return <svg viewBox="0 0 80 80">
        <path
            d="M25,10L25,50L65,50   M10,25L50,25L50,65"
            style={{ stroke: "white", strokeWidth: 5, fill: "none" }} />
    </svg>;
}

export function ScenaIcon() {
    return <svg width="100%" height="100%" viewBox="0 0 230 230" fill="#fff">
        <g>
            <path d="M129.097,98.831c-1.034,-3.857 -4.585,-5.422 -7.925,-3.494l-20.522,11.849c-3.34,1.928 -5.213,6.625 -4.179,10.482l3.745,13.977c1.033,3.857 4.584,5.423 7.924,3.494l20.522,-11.848c3.341,-1.928 5.213,-6.626 4.18,-10.483l-3.745,-13.977Z" />
            <path d="M88.238,146.562l-7.49,-27.954l-21.209,12.299c-6.68,3.857 -8.972,12.412 -5.115,19.092c3.857,6.681 12.412,8.973 19.092,5.116l14.722,-8.553Zm0.435,-24.459c-1.034,-3.857 -4.584,-5.423 -7.925,-3.495l7.49,27.954c3.341,-1.928 5.214,-6.625 4.18,-10.482l-3.745,-13.977Z" />
            <path d="M141.795,83.417l7.49,27.953l21.208,-12.298c6.681,-3.857 8.973,-12.412 5.116,-19.093c-3.857,-6.68 -12.412,-8.973 -19.092,-5.116l-14.722,8.554Zm-0.435,24.459c1.033,3.857 4.584,5.423 7.925,3.494l-7.49,-27.953c-3.341,1.928 -5.214,6.625 -4.18,10.482l3.745,13.977Z" />
        </g>
        <path d="M187.89,121.25c-3.085,-5.344 -9.928,-7.177 -15.271,-4.092l-101.881,58.82c-5.343,3.085 -7.177,9.928 -4.092,15.272c3.085,5.343 9.928,7.177 15.271,4.092l101.881,-58.821c5.343,-3.085 7.177,-9.928 4.092,-15.271Z" />
        <path d="M163.394,38.821c-3.085,-5.343 -9.928,-7.177 -15.271,-4.092l-101.846,58.801c-5.344,3.085 -7.177,9.928 -4.092,15.271c3.085,5.344 9.928,7.177 15.271,4.092l101.846,-58.8c5.343,-3.085 7.177,-9.928 4.092,-15.272Z" />
    </svg>;
}


export function RectIcon() {
    return <svg viewBox="0 0 73 73">
        <path d="M16.5,21.5 h40 a0,0 0 0 1 0,0 v30 a0,0 0 0 1 -0,0 h-40 a0,0 0 0 1 -0,-0 v-30 a0,0 0 0 1 0,-0 z"
            fill="#555" strokeLinejoin="round" strokeWidth="3" stroke="#fff"></path>
    </svg>;
}

export function RoundRectIcon() {
    return <svg viewBox="0 0 73 73">
        <path d="M26.5,21.5 h20 a10,10 0 0 1 10,10 v10 a10,10 0 0 1 -10,10 h-20 a10,10 0 0 1 -10,-10 v-10 a10,10 0 0 1 10,-10 z"
            fill="#555" strokeLinejoin="round" strokeWidth="3" stroke="#fff"></path>
    </svg>;
}
export function OvalIcon() {
    return <svg viewBox="0 0 73 73">
        <ellipse fill="#555" cx="36.5" cy="36.5" rx="20" ry="15"
            strokeLinejoin="round" strokeWidth="3" stroke="#fff"></ellipse>
    </svg>;
}
export function CircleIcon() {
    return <svg viewBox="0 0 73 73">
        <ellipse fill="#555" cx="36.5" cy="36.5" rx="15" ry="15"
            strokeLinejoin="round" strokeWidth="3" stroke="#fff"></ellipse>
    </svg>;
}

export function PolygonIcon() {
    return <svg viewBox="0 0 73 73">
        <path d="M 20,15 L 10,35 L 20,55 L 35,45 L 40, 50 L 55,31 L 41,15 L 30, 25 Z"
            fill="#555" strokeLinejoin="round" strokeWidth="3" stroke="#fff"></path>
    </svg>;
}

export function TransformIcon() {
    return <svg viewBox="0 0 80 80">
        {/* <rect x="20" y="20" width="40" height="40" stroke="#fff" strokeWidth="3" fill="rgba(255, 255, 255, 0.5)"></rect> */}
        <rect x="15" y="15" width="10" height="10" fill="#fff"></rect>
        <rect x="35" y="15" width="10" height="10" fill="#fff"></rect>
        <rect x="55" y="15" width="10" height="10" fill="#fff"></rect>
        <rect x="15" y="35" width="10" height="10" fill="#fff"></rect>
        <rect x="55" y="35" width="10" height="10" fill="#fff"></rect>
        <rect x="15" y="55" width="10" height="10" fill="#fff"></rect>
        <rect x="35" y="55" width="10" height="10" fill="#fff"></rect>
        <rect x="55" y="55" width="10" height="10" fill="#fff"></rect>
    </svg>;
}

export function CheckedIcon() {
    return <svg viewBox="0 0 80 80">
        <path
            d="M 21,40 L 35,60 L 60,25 L35, 60, L 21,40 Z"
            fill="#fff" strokeLinejoin="round" strokeWidth="10" stroke="#fff"></path>
    </svg>;
}
