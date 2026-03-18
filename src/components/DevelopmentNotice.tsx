"use client";

import { useState } from "react";

export default function DevelopmentNotice() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="sticky top-0 z-50 border-b border-amber-300/25 bg-amber-500/90 px-4 py-2 text-center text-sm font-medium text-zinc-950 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                <p>
                    This website is still in development.
                </p>
                <button
                    type="button"
                    onClick={() => setIsVisible(false)}
                    className="rounded border border-zinc-900/30 px-2 py-0.5 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-900/10"
                    aria-label="Close development notice"
                >
                    Close
                </button>
            </div>
        </div>
    );
}