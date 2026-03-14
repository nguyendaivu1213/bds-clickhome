import fs from 'fs';
import path from 'path';

export default function EditorPage() {
  const htmlPath = path.join(process.cwd(), 'designs', 'editor.html');
  const content = fs.readFileSync(htmlPath, 'utf8');
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const html = bodyMatch ? bodyMatch[1] : content;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
