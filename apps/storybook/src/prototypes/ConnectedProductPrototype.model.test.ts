import { describe, expect, it } from 'vitest';
import {
  filterPrototypeMembers,
  inviteEmailError,
  prototypeInitialMembers,
} from './ConnectedProductPrototype';

describe('Connected Product Prototype model helpers', () => {
  it('reproduces the Figma sara / zoe search fixtures from the seven-person directory', () => {
    expect(filterPrototypeMembers(prototypeInitialMembers, 'sara').map((member) => member.email)).toEqual([
      'sara@example.com',
    ]);
    expect(filterPrototypeMembers(prototypeInitialMembers, 'zoe')).toEqual([]);
    expect(filterPrototypeMembers(prototypeInitialMembers, '')).toHaveLength(7);
  });

  it('keeps required-email and malformed-email validation separate', () => {
    expect(inviteEmailError('')).toBe('Enter an email address.');
    expect(inviteEmailError('not-an-email')).toBe('Enter a valid email address.');
    expect(inviteEmailError('alex@example.com')).toBeNull();
  });
});
