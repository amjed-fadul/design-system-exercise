import { mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });

const applicationShellCss = await readFile(
  new URL('../src/application-shell/ApplicationShell.css', import.meta.url),
  'utf8',
);

await writeFile(
  new URL('../dist/styles.css', import.meta.url),
  `${applicationShellCss.trimEnd()}\n`,
);
