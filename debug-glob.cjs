const fs = require('fs');
const pattern = `{示例,src}/**/index.{ts,tsx,js,jsx}`;
console.log('Pattern:', pattern);
try {
  const results = fs.globSync(pattern, { nodir: true });
  console.log('Glob results:', results);
} catch(e) {
  console.log('Glob error:', e.message);
}
try {
  const results2 = fs.globSync('src/**/index.{ts,tsx,js,jsx}', { nodir: true });
  console.log('Glob2 results:', results2);
} catch(e) {
  console.log('Glob2 error:', e.message);
}
try {
  const results3 = fs.readdirSync('src');
  console.log('src dir:', results3);
} catch(e) {
  console.log('readdir error:', e.message);
}
