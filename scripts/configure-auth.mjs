import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const target = fileURLToPath(new URL('../.env.local', import.meta.url));
const prompt = createInterface({ input: stdin, output: stdout });
try {
  console.log('Connect Chanakya to Supabase. Enter public configuration only.');
  const url = (await prompt.question('Supabase project URL: ')).trim().replace(/\/$/, '');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('Use the HTTPS project origin from the Supabase dashboard.');
  const key = (await prompt.question('Supabase public publishable key: ')).trim();
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) throw new Error('Use the public sb_publishable_ key. Secret and service-role keys are not accepted.');
  let existing = '';
  try { existing = await readFile(target, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const remaining = existing.split(/\r?\n/).filter(line => !/^\s*(VITE_SUPABASE_URL|VITE_SUPABASE_PUBLISHABLE_KEY|VITE_ENABLE_DEMO)\s*=/.test(line));
  const text = remaining.join('\n').trimEnd() + `\nVITE_SUPABASE_URL=${url}\nVITE_SUPABASE_PUBLISHABLE_KEY=${key}\nVITE_ENABLE_DEMO=false\n`;
  await writeFile(target + '.tmp', text.trimStart(), 'utf8');
  await rename(target + '.tmp', target);
  console.log('Saved public configuration to .env.local. Restart the development server or rebuild the app.');
  console.log(`Google callback to confirm in Supabase: ${url}/auth/v1/callback`);
  console.log('Next: enable Google and Phone providers in the Supabase dashboard.');
} catch (error) {
  console.error(error.message || 'Configuration could not be saved.'); process.exitCode = 1;
} finally { prompt.close(); }
