import { describe, expect, it } from 'vitest';
import {
  filterTeamRecords,
  summarizeTeamRecords,
  type TeamRecord,
} from './TeamEvaluation';

const records: TeamRecord[] = [
  {
    id: 'amal',
    name: 'Amal Hassan',
    email: 'amal@example.com',
    initials: 'AH',
    role: 'Admin',
    status: 'active',
  },
  {
    id: 'sara',
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    initials: 'SA',
    role: 'Member',
    status: 'active',
  },
  {
    id: 'jamal',
    name: 'Has not joined yet',
    email: 'jamal@example.com',
    initials: '@',
    role: 'Member',
    status: 'invited',
  },
];

describe('team directory data', () => {
  it('filters members and invitations by a case-insensitive name or email', () => {
    expect(filterTeamRecords(records, '  JAMAL@EXAMPLE.COM  ')).toEqual([records[2]]);
    expect(filterTeamRecords(records, 'sara')).toEqual([records[1]]);
  });

  it('summarizes only the visible records', () => {
    expect(summarizeTeamRecords(records.slice(1))).toEqual({
      active: 1,
      invitations: 1,
      visible: 2,
    });
  });
});
