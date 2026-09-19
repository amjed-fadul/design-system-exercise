export type StoryTheme = 'light' | 'dark';
export type StoryLanguage = 'english' | 'arabic';

export interface StoryPresentation {
  theme: StoryTheme;
  language: StoryLanguage;
}

export interface StoryPresentationOverride {
  theme?: StoryTheme;
  language?: StoryLanguage;
}

interface PresentationContext {
  globals?: Record<string, unknown>;
  parameters?: Record<string, unknown> & {
    presentation?: StoryPresentationOverride;
  };
  viewMode?: string;
}

function themeFrom(value: unknown): StoryTheme {
  return value === 'dark' ? 'dark' : 'light';
}

function languageFrom(value: unknown): StoryLanguage {
  return value === 'arabic' ? 'arabic' : 'english';
}

export function resolveStoryPresentation(context: PresentationContext) {
  const toolbar: StoryPresentation = {
    theme: themeFrom(context.globals?.theme),
    language: languageFrom(context.globals?.language),
  };

  const override = context.parameters?.presentation;
  const story: StoryPresentation = {
    theme: override?.theme ?? toolbar.theme,
    language: override?.language ?? toolbar.language,
  };

  return {
    toolbar,
    story,
    document: context.viewMode === 'story' ? story : toolbar,
  };
}

export function languageCode(language: StoryLanguage) {
  return language === 'arabic' ? 'ar' : 'en';
}

export function direction(language: StoryLanguage) {
  return language === 'arabic' ? 'rtl' : 'ltr';
}

export function syncDocsCanvasPresentation(
  storyRoot: Element | null,
  presentation: StoryPresentation,
) {
  const docsCanvas = storyRoot?.closest<HTMLElement>('.dse-docs-canvas');

  if (!docsCanvas) {
    return () => {};
  }

  const theme = presentation.theme;
  const language = languageCode(presentation.language);
  const dir = direction(presentation.language);

  docsCanvas.dataset.theme = theme;
  docsCanvas.dataset.language = language;
  docsCanvas.dir = dir;

  return () => {
    if (docsCanvas.dataset.theme === theme) {
      delete docsCanvas.dataset.theme;
    }
    if (docsCanvas.dataset.language === language) {
      delete docsCanvas.dataset.language;
    }
    if (docsCanvas.dir === dir) {
      docsCanvas.removeAttribute('dir');
    }
  };
}
