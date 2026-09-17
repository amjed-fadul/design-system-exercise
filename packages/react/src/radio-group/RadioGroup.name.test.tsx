import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RadioGroup } from './RadioGroup';

afterEach(cleanup);

describe('RadioGroup native group name invariant', () => {
  it('rejects an empty shared name because native radios require a non-empty name to form one group', () => {
    expect(() =>
      render(
        <RadioGroup
          label="Role"
          name=""
          options={[
            { value: 'member', label: 'Member' },
            { value: 'admin', label: 'Admin' },
          ]}
        />,
      ),
    ).toThrow(/non-empty.*name|name.*non-empty/i);
  });
});
