const fs = require('fs');

function htmlToJsx(html) {
  let jsx = html.replace(/class="/g, 'className="');
  jsx = jsx.replace(/for="/g, 'htmlFor="');
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  // Replace unclosed tags like <img ...>, <input ...> with self closing
  jsx = jsx.replace(/<(img|input|br|hr)([^\>]*[^\/])>/g, '<$1$2 />');
  
  // Extract body content
  const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    jsx = bodyMatch[1];
  }
  return jsx;
}

const loginHtml = fs.readFileSync(process.env.TEMP + '/login.html', 'utf16le');
const loginJsx = htmlToJsx(loginHtml);

const loginComponent = `
export default function Login() {
  return (
    <div className="bg-surface text-on-surface font-body overflow-hidden selection:bg-primary selection:text-on-primary min-h-screen">
      ${loginJsx}
    </div>
  );
}
`;

fs.mkdirSync('src/app/login', { recursive: true });
fs.writeFileSync('src/app/login/page.tsx', loginComponent);

const dashHtml = fs.readFileSync(process.env.TEMP + '/dashboard.html', 'utf16le');
const dashJsx = htmlToJsx(dashHtml);

const dashComponent = `
export default function Dashboard() {
  return (
    <div className="bg-[#050505] font-body text-on-surface overflow-hidden selection:bg-primary selection:text-black min-h-screen">
      ${dashJsx}
    </div>
  );
}
`;

fs.writeFileSync('src/app/(admin)/page.tsx', dashComponent);

