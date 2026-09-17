import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir(new URL('../dist/assets/', import.meta.url), { recursive: true });

const buttonCss = await readFile(new URL('../src/button/Button.css', import.meta.url), 'utf8');
const iconButtonCss = await readFile(new URL('../src/icon-button/IconButton.css', import.meta.url), 'utf8');
const linkCss = await readFile(new URL('../src/link/Link.css', import.meta.url), 'utf8');
const inputControlCss = await readFile(
  new URL('../src/internal/input-control/InputControl.css', import.meta.url),
  'utf8',
);
const textFieldCss = await readFile(new URL('../src/text-field/TextField.css', import.meta.url), 'utf8');
const searchFieldCss = await readFile(
  new URL('../src/search-field/SearchField.css', import.meta.url),
  'utf8',
);
const radioGroupCss = await readFile(
  new URL('../src/radio-group/RadioGroup.css', import.meta.url),
  'utf8',
);
const inlineFeedbackCss = await readFile(
  new URL('../src/inline-feedback/InlineFeedback.css', import.meta.url),
  'utf8',
);
const avatarCss = await readFile(new URL('../src/avatar/Avatar.css', import.meta.url), 'utf8');
const statusBadgeCss = await readFile(
  new URL('../src/status-badge/StatusBadge.css', import.meta.url),
  'utf8',
);
const dialogCss = await readFile(new URL('../src/dialog/Dialog.css', import.meta.url), 'utf8');
const sidePanelCss = await readFile(
  new URL('../src/side-panel/SidePanel.css', import.meta.url),
  'utf8',
);
const emptyStateCss = await readFile(
  new URL('../src/empty-state/EmptyState.css', import.meta.url),
  'utf8',
);
const sidebarCss = await readFile(new URL('../src/sidebar/Sidebar.css', import.meta.url), 'utf8');

await writeFile(
  new URL('../dist/styles.css', import.meta.url),
  `${buttonCss.trimEnd()}\n\n${iconButtonCss.trimEnd()}\n\n${linkCss.trimEnd()}\n\n${inputControlCss.trimEnd()}\n\n${textFieldCss.trimEnd()}\n\n${searchFieldCss.trimEnd()}\n\n${radioGroupCss.trimEnd()}\n\n${inlineFeedbackCss.trimEnd()}\n\n${avatarCss.trimEnd()}\n\n${statusBadgeCss.trimEnd()}\n\n${dialogCss.trimEnd()}\n\n${sidePanelCss.trimEnd()}\n\n${emptyStateCss.trimEnd()}\n\n${sidebarCss.trimEnd()}\n`,
);

for (const asset of [
  'loader-circle.svg',
  'search.svg',
  'x.svg',
  'inline-feedback-alert.svg',
  'inline-feedback-check.svg',
]) {
  await copyFile(
    new URL(`../src/assets/${asset}`, import.meta.url),
    new URL(`../dist/assets/${asset}`, import.meta.url),
  );
}
