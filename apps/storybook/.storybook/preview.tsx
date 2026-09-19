import type { Preview } from '@storybook/react-vite';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
import '@design-system-exercise/patterns/styles.css';
import '../src/styles.css';
import '../src/directional-icons.css';
import {
  direction,
  languageCode,
  resolveStoryPresentation,
  syncDocsCanvasPresentation,
  type StoryPresentation,
} from '../src/presentation';

function DocsCanvasPresentationSync({
  presentation,
  children,
}: {
  presentation: StoryPresentation;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(
    () => syncDocsCanvasPresentation(rootRef.current, presentation),
    [presentation.theme, presentation.language],
  );

  return (
    <div ref={rootRef} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    options: {
      storySort: {
        order: ['Foundations', 'Components', 'Patterns', 'AI Readiness', 'Prototypes'],
      },
    },
    docs: {
      canvas: {
        className: 'dse-docs-canvas',
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: { icon: 'paintbrush', items: ['light', 'dark'] },
    },
    language: {
      description: 'Typography language',
      defaultValue: 'english',
      toolbar: { icon: 'globe', items: ['english', 'arabic'] },
    },
  },
  decorators: [
    (Story, context) => {
      const presentation = resolveStoryPresentation({
        globals: context.globals,
        parameters: context.parameters,
        viewMode: context.viewMode,
      });

      document.documentElement.dataset.theme = presentation.document.theme;
      document.documentElement.dataset.language = languageCode(
        presentation.document.language,
      );
      document.documentElement.dir = direction(presentation.document.language);

      return (
        <DocsCanvasPresentationSync presentation={presentation.story}>
          <div
            data-dse-story-presentation=""
            data-theme={presentation.story.theme}
            data-language={languageCode(presentation.story.language)}
            dir={direction(presentation.story.language)}
            style={{ display: 'contents' }}
          >
            <Story />
          </div>
        </DocsCanvasPresentationSync>
      );
    },
  ],
};

export default preview;
