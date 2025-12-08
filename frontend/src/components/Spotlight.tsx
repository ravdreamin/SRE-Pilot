import { useRef, useState, useEffect } from "react";

export const Spotlight = ({ className = "", fill = "white" }: { className?: string; fill?: string }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 3787 2842"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0, // Start hidden, animate in
                animation: 'spotlight-fade 1s ease-out forwards 0.5s'
            }}
        >
            <style>{`
            @keyframes spotlight-fade {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes spotlight-move {
                0% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(-20px, 10px) scale(1.05); }
                100% { transform: translate(0, 0) scale(1); }
            }
        `}</style>
            <g filter="url(#filter0_f_0_1)" style={{ animation: 'spotlight-move 10s ease-in-out infinite' }}>
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill}
                    fillOpacity="0.21"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_0_1"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_0_1"
                    />
                </filter>
            </defs>
        </svg>
    );
};
