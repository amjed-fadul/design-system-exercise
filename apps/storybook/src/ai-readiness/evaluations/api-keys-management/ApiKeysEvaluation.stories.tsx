import "@design-system-exercise/tokens/css";
import "@design-system-exercise/react/styles.css";
import "./ApiKeysEvaluation.css";
import { ApiKeysEvaluation } from "./ApiKeysEvaluation";

const meta = {
  title: "AI Readiness/Evaluations/API Keys Management",
  component: ApiKeysEvaluation,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    language: {
      control: "inline-radio",
      options: ["en", "ar"],
    },
    theme: {
      control: "inline-radio",
      options: ["light", "dark"],
    },
    layout: {
      control: "inline-radio",
      options: ["auto", "wide", "compact"],
    },
  },
};

export default meta;

export const EnglishLightWide = {
  args: {
    language: "en",
    theme: "light",
    layout: "wide",
  },
};

export const ArabicDarkWide = {
  args: {
    language: "ar",
    theme: "dark",
    layout: "wide",
  },
};

export const CompactDirectory = {
  args: {
    language: "en",
    theme: "light",
    layout: "compact",
  },
};

export const ResponsiveDirectory = {
  args: {
    language: "en",
    theme: "light",
    layout: "auto",
  },
};
