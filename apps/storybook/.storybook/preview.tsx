import type { Preview } from '@storybook/react-vite';
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
import { direction, languageCode, resolveStoryPresentation } from '../src/presentation';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    options: {
      storySort: {
        order: ['Foundations', 'Components', 'Patterns', 'Prototypes'],
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
        <div
          data-dse-story-presentation=""
          data-theme={presentation.story.theme}
          data-language={languageCode(presentation.story.language)}
          dir={direction(presentation.story.language)}
          style={{ display: 'contents' }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
