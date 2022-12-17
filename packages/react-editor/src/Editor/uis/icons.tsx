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

export function FolderIcon() {
    return <svg viewBox="0 0 80 80">
        <path
            d="M 10,20 L 30,20 L 40,26 L70, 26, L 70,60 L 10,60 L 10,20 Z"
            fill="#fff" strokeLinejoin="round" strokeWidth="10" stroke="#fff"></path>
    </svg>;
}

export function LayerIcon() {
    return <svg viewBox="0 0 80 80">
        <path d="M40,20 L70,40 L40,60 L10,40 L40,20Z" stroke="#fff" fill="#fff" strokeWidth="3" style={{
            // fill: "rgba(255, 255, 255, 0.5)",
            transform: "translateY(-7px)",
        }}></path>
        <path d="M40,20 L70,40 L40,60 L10,40 L40,20Z" stroke="#fff" fill="#fff" strokeWidth="3" style={{
            // fill: "rgba(255, 255, 255, 0.5)",
            transform: "translateY(7px)",
        }}></path>
    </svg>;
}



export function VisibleIcon(props: any) {
    return <svg height="48" width="48" viewBox="0 0 48 48" {...props}>
        <path d="M24 31.5q3.55 0 6.025-2.475Q32.5 26.55 32.5 23q0-3.55-2.475-6.025Q27.55 14.5 24 14.5q-3.55 0-6.025 2.475Q15.5 19.45 15.5 23q0 3.55 2.475 6.025Q20.45 31.5 24 31.5Zm0-2.9q-2.35 0-3.975-1.625T18.4 23q0-2.35 1.625-3.975T24 17.4q2.35 0 3.975 1.625T29.6 23q0 2.35-1.625 3.975T24 28.6Zm0 9.4q-7.3 0-13.2-4.15Q4.9 29.7 2 23q2.9-6.7 8.8-10.85Q16.7 8 24 8q7.3 0 13.2 4.15Q43.1 16.3 46 23q-2.9 6.7-8.8 10.85Q31.3 38 24 38Zm0-15Zm0 12q6.05 0 11.125-3.275T42.85 23q-2.65-5.45-7.725-8.725Q30.05 11 24 11t-11.125 3.275Q7.8 17.55 5.1 23q2.7 5.45 7.775 8.725Q17.95 35 24 35Z" />
    </svg>;
}
export function InvisibleIcon(props: any) {
    return <svg height="48" width="48" viewBox="0 0 48 48" {...props}>
        <path d="m31.45 27.05-2.2-2.2q1.3-3.55-1.35-5.9-2.65-2.35-5.75-1.2l-2.2-2.2q.85-.55 1.9-.8 1.05-.25 2.15-.25 3.55 0 6.025 2.475Q32.5 19.45 32.5 23q0 1.1-.275 2.175-.275 1.075-.775 1.875Zm6.45 6.45-2-2q2.45-1.8 4.275-4.025Q42 25.25 42.85 23q-2.5-5.55-7.5-8.775Q30.35 11 24.5 11q-2.1 0-4.3.4-2.2.4-3.45.95L14.45 10q1.75-.8 4.475-1.4Q21.65 8 24.25 8q7.15 0 13.075 4.075Q43.25 16.15 46 23q-1.3 3.2-3.35 5.85-2.05 2.65-4.75 4.65Zm2.9 11.3-8.4-8.25q-1.75.7-3.95 1.075T24 38q-7.3 0-13.25-4.075T2 23q1-2.6 2.775-5.075T9.1 13.2L2.8 6.9l2.1-2.15L42.75 42.6ZM11.15 15.3q-1.85 1.35-3.575 3.55Q5.85 21.05 5.1 23q2.55 5.55 7.675 8.775Q17.9 35 24.4 35q1.65 0 3.25-.2t2.4-.6l-3.2-3.2q-.55.25-1.35.375T24 31.5q-3.5 0-6-2.45T15.5 23q0-.75.125-1.5T16 20.15Zm15.25 7.1Zm-5.8 2.9Z" />
    </svg>;
}
