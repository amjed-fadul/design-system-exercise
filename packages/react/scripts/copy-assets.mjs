import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir(new URL('../dist/assets/', import.meta.url), { recursive: true });

const buttonCss = await readFile(new URL('../src/button/Button.css', import.meta.url), 'utf8');
const iconButtonCss = await readFile(new URL('../src/icon-button/IconButton.css', import.meta.url), 'utf8');
const linkCss = await readFile(new URL('../src/link/Link.css', import.meta.url), 'utf8');

await writeFile(
  new URL('../dist/styles.css', import.meta.url),
  `${buttonCss.trimEnd()}\n\n${iconButtonCss.trimEnd()}\n\n${linkCss.trimEnd()}\n`,
);

await copyFile(
  new URL('../src/assets/loader-circle.svg', import.meta.url),
  new URL('../dist/assets/loader-circle.svg', import.meta.url),
);
