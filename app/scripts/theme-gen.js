const fs = require('fs');
const login = fs.readFileSync(process.env.TEMP + '/login.html', 'utf16le');
const dash = fs.readFileSync(process.env.TEMP + '/dashboard.html', 'utf16le');

function extractColors(html) {
  const match = html.match(/colors:\s*(\{[\s\S]*?\})/);
  if (!match) return {};
  try {
    return eval('(' + match[1] + ')');
  } catch(e) { return {}; }
}
const cLogin = extractColors(login);
const cDash = extractColors(dash);

let css = '@import "tailwindcss";\n\n@theme {\n';

// Use a Set to merge all keys
const allKeys = new Set([...Object.keys(cDash), ...Object.keys(cLogin)]);

for (const key of allKeys) {
  css += '  --color-' + key + ': var(--color-' + key + ');\n';
}

css += `
  --font-headline: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-label: "Public Sans", "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --font-display: "Space Grotesk", sans-serif;
}

:root {
`;
for (const key of allKeys) {
  // default to dash, fallback to login
  css += '  --color-' + key + ': ' + (cDash[key] || cLogin[key]) + ';\n';
}
css += `}

.theme-login {
`;
for (const key of allKeys) {
  css += '  --color-' + key + ': ' + (cLogin[key] || cDash[key]) + ';\n';
}
css += '}\n';

fs.writeFileSync('src/app/globals.scss', css);
