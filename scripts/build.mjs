import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
const id = process.env.META_PIXEL_ID || '';
if (id && !/^\d+$/.test(id)) throw new Error('META_PIXEL_ID must contain digits only.');
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const name of ['index.html', 'about', 'blinds', 'contact', 'blackout-blinds-winnipeg', 'motorized-blinds-winnipeg', 'roller-blinds-winnipeg', 'zebra-blinds-winnipeg', 'privacy-policy', 'assets', '_headers', '_redirects', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'vercel.json']) await cp(name, `dist/${name}`, { recursive: true });
await writeFile('dist/assets/js/pixel-config.js', `// Public advertising ID; never put credentials here.\nwindow.BLINDSFOLD_PIXEL_ID = ${JSON.stringify(id)};\n`);
console.log(`Static production build created in dist. Meta Pixel ${id ? 'configured' : 'disabled (META_PIXEL_ID not set)'}.`);
