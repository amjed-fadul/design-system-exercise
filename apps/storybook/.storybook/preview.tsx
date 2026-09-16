import type { Preview } from '@storybook/react-vite';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
import '../src/styles.css';

const preview: Preview = {
  tags: ['autodocs'],
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
      const theme = context.globals.theme as 'light' | 'dark';
      const language = context.globals.language as 'english' | 'arabic';
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.language = language === 'arabic' ? 'ar' : 'en';
      document.documentElement.dir = language === 'arabic' ? 'rtl' : 'ltr';
      return <Story />;
    },
  ],
};

export default preview;
