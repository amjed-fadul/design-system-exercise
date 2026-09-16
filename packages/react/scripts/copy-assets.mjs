import { copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/assets/', import.meta.url), { recursive: true });
await copyFile(
  new URL('../src/button/Button.css', import.meta.url),
  new URL('../dist/styles.css', import.meta.url),
);
await copyFile(
  new URL('../src/assets/loader-circle.svg', import.meta.url),
  new URL('../dist/assets/loader-circle.svg', import.meta.url),
);
