const fs = require('fs');

function htmlToJsx(html) {
  let jsx = html.replace(/class="/g, 'className="');
  jsx = jsx.replace(/for="/g, 'htmlFor="');
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  jsx = jsx.replace(/<(img|input|br|hr)([^\>]*[^\/])>/g, '<$1$2 />');
  
  const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    jsx = bodyMatch[1];
  }
  return jsx;
}

const landingHtml = fs.readFileSync(process.env.TEMP + '/landing.html', 'utf16le');
const landingJsx = htmlToJsx(landingHtml);

const landingComponent = `
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="bg-[#0A0A0A] font-body text-on-surface overflow-x-hidden selection:bg-primary selection:text-black min-h-screen">
      ${landingJsx.replace(/href="#"/g, 'href="/login"')}
    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', landingComponent);
