export const inlineFeedbackIntents = ['error', 'success'] as const;

export type InlineFeedbackIntent = (typeof inlineFeedbackIntents)[number];

export interface InlineFeedbackProps {
  intent: InlineFeedbackIntent;
  message: string;
  title?: string;
}

function assertNonEmptyText(value: string, label: 'message' | 'title') {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`InlineFeedback requires a non-empty ${label}.`);
  }
}

export function InlineFeedback({ intent, message, title }: InlineFeedbackProps) {
  assertNonEmptyText(message, 'message');
  if (title !== undefined) assertNonEmptyText(title, 'title');

  const role = intent === 'error' ? 'alert' : 'status';

  return (
    <div className="dse-inline-feedback" data-intent={intent} role={role}>
      <span className="dse-inline-feedback__icon" aria-hidden="true" />
      <div className="dse-inline-feedback__text">
        {title !== undefined ? <p className="dse-inline-feedback__title">{title}</p> : null}
        <p className="dse-inline-feedback__message">{message}</p>
      </div>
    </div>
  );
}
