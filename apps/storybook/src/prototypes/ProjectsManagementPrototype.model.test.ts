import { describe, expect, it } from 'vitest';
import {
  filterPrototypeProjects,
  projectKeyError,
  projectNameError,
  prototypeInitialProjects,
} from './ProjectsManagementPrototype';

describe('Projects Management prototype model helpers', () => {
  it('searches project names, keys, and Arabic display names', () => {
    expect(
      filterPrototypeProjects(prototypeInitialProjects, 'system').map(
        (project) => project.key,
      ),
    ).toEqual(['DS']);
    expect(
      filterPrototypeProjects(prototypeInitialProjects, 'MOB').map(
        (project) => project.name,
      ),
    ).toEqual(['Mobile onboarding']);
    expect(
      filterPrototypeProjects(
        prototypeInitialProjects,
        'الأبحاث',
        'arabic',
      ).map((project) => project.key),
    ).toEqual(['RSH']);
    expect(filterPrototypeProjects(prototypeInitialProjects, 'missing')).toEqual(
      [],
    );
  });

  it('validates required project names and governed project keys', () => {
    expect(projectNameError('')).toBe('Enter a project name.');
    expect(projectNameError('Northstar')).toBeNull();

    expect(projectKeyError('', prototypeInitialProjects)).toBe(
      'Enter a project key.',
    );
    expect(projectKeyError('a', prototypeInitialProjects)).toBe(
      'Use 2–8 uppercase letters or numbers.',
    );
    expect(projectKeyError('DS', prototypeInitialProjects)).toBe(
      'This project key is already in use.',
    );
    expect(projectKeyError('NEW', prototypeInitialProjects)).toBeNull();
    expect(
      projectKeyError('DS', prototypeInitialProjects, 'english', 'design-system'),
    ).toBeNull();
  });
});
