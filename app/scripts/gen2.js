const fs = require('fs');
const cDash = {
"tertiary-fixed": "#d896ff",
"on-primary-fixed": "#00440a",
"on-error": "#450900",
"on-background": "#ffffff",
"surface-dim": "#0e0e0e",
"inverse-on-surface": "#565554",
"surface-bright": "#2c2c2c",
"on-primary-container": "#005a10",
"inverse-primary": "#006f16",
"on-secondary-container": "#eef9ff",
"secondary-fixed": "#80deff",
"primary-fixed-dim": "#00ec3b",
"surface-tint": "#9cff93",
"error": "#ff7351",
"inverse-surface": "#fcf8f8",
"on-tertiary": "#370054",
"on-surface-variant": "#adaaaa",
"on-secondary-fixed-variant": "#00586d",
"on-tertiary-container": "#ffffff",
"on-error-container": "#ffd2c8",
"error-dim": "#d53d18",
"on-primary-fixed-variant": "#006513",
"secondary-container": "#00677f",
"secondary-fixed-dim": "#37d4ff",
"primary": "#9cff93",
"primary-container": "#00fc40",
"on-surface": "#ffffff",
"surface-variant": "#262626",
"outline-variant": "#494847",
"surface-container-low": "#131313",
"on-secondary": "#004050",
"secondary-dim": "#00c0ea",
"surface-container-lowest": "#000000",
"error-container": "#b92902",
"tertiary-fixed-dim": "#d082ff",
"surface-container-highest": "#262626",
"secondary": "#00cffc",
"surface": "#0e0e0e",
"surface-container": "#1a1919",
"on-tertiary-fixed-variant": "#5c008a",
"primary-dim": "#00ec3b",
"tertiary": "#cd7aff",
"on-secondary-fixed": "#003a48",
"primary-fixed": "#00fc40",
"on-primary": "#006413",
"background": "#0e0e0e",
"on-tertiary-fixed": "#2a0043",
"tertiary-dim": "#b121ff",
"outline": "#777575",
"tertiary-container": "#ad00fe",
"surface-container-high": "#201f1f"
};

let css = '@import "tailwindcss";\n\n@theme {\n';
for (const key of Object.keys(cDash)) {
  css += '  --color-' + key + ': ' + cDash[key] + ';\n';
}

css += `
  --font-headline: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-label: "Public Sans", "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --font-display: "Space Grotesk", sans-serif;
}

@layer base {
  :root {
    --background: #0e0e0e;
    --foreground: #ffffff;
  }
}

.material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24 }

.cyber-glass {
    background: rgba(26, 25, 25, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(156, 255, 147, 0.15);
    position: relative;
    overflow: hidden;
}

.cyber-glass::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(156, 255, 147, 0.05) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(156, 255, 147, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: -1;
}

.scanline-overlay {
    background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 50;
}

.data-stream-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(0, 252, 64, 0.05) 0%, transparent 70%);
    pointer-events: none;
}

.neon-border-primary { border-color: rgba(156, 255, 147, 0.4); box-shadow: 0 0 15px rgba(156, 255, 147, 0.15); }
.neon-border-secondary { border-color: rgba(0, 238, 252, 0.4); box-shadow: 0 0 15px rgba(0, 238, 252, 0.15); }
.neon-border-error { border-color: rgba(255, 115, 81, 0.4); box-shadow: 0 0 15px rgba(255, 115, 81, 0.15); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #9cff93; }

@keyframes pulse-fast {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
.pulse-fast { animation: pulse-fast 1s infinite; }

.glitch-hover:hover {
    text-shadow: 2px 0 #00eefc, -2px 0 #ff51fa;
    transform: skewX(-2deg);
}

@keyframes matrix-scroll {
    0% { transform: translateY(-50%); }
    100% { transform: translateY(0); }
}
.matrix-bg {
    mask-image: linear-gradient(to bottom, transparent, black, transparent);
    animation: matrix-scroll 20s linear infinite;
}

`;

fs.writeFileSync('src/app/globals.scss', css);
