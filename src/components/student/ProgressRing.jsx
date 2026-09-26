import React from "react";

/**
 * Animated SVG ring that shows overall submission progress.
 */
export default function ProgressRing({ percent, submitted, total }) {
    return (
        <div
            className="relative h-[98px] w-[98px] max-sm:h-[78px] max-sm:w-[78px] flex-none"
            role="img"
            aria-label={`${percent}% submitted`}
        >
            <div
                className="progress-ring-disc absolute inset-0 p-[9px] rounded-full"
                style={{
                    background: `conic-gradient(from -90deg, var(--progress-ring-fill-color) ${percent}%, var(--progress-ring-track-color) ${percent}% 100%)`,
                }}
            >
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <span className="text-[22px] font-extrabold font-[family-name:Manrope]">
                        {percent}%
                    </span>
                    <span className="ring-sub">
                        {submitted}/{total}
                    </span>
                </div>
            </div>
        </div>
    );
}
