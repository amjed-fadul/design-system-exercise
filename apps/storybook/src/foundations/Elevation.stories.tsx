import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokenDocumentation } from '@design-system-exercise/tokens';
import { formatTokenValue } from '../shared/TokenTable';

const meta = { title: 'Foundations/Elevation' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Planes: Story = {
  render: () => {
    const planes = tokenDocumentation
      .filter(
        (entry) =>
          entry.layer === 'foundation' &&
          entry.path.startsWith('elevation.plane.') &&
          entry.mode === null,
      )
      .sort(
        (a, b) =>
          Number(b.resolvedValue) - Number(a.resolvedValue),
      );

    return (
      <div className="plane-stack" aria-label="Elevation plane order">
        {planes.map((plane) => (
          <div className="plane-row" key={plane.path}>
            <span className="plane-level">
              {formatTokenValue(plane.resolvedValue)}
            </span>
            <div>
              <strong>
                {plane.path.split('.').at(-1)}
              </strong>
              <code>{plane.path}</code>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
