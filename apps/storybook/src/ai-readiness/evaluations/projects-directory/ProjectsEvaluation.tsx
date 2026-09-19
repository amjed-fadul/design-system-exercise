import {
  Breadcrumbs,
  Button,
  Dialog,
  EmptyState,
  InlineFeedback,
  PageHeading,
  RadioGroup,
  SearchField,
  SidePanel,
  Sidebar,
  StatusBadge,
  Table,
  TextField,
  TopNavbar,
} from '@design-system-exercise/react';
import { ApplicationShell } from '@design-system-exercise/patterns';
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
import '@design-system-exercise/patterns/styles.css';
import './ProjectsEvaluation.css';

type Language = 'en' | 'ar';
type ProjectStatus = 'Active' | 'Draft';
type RequestPhase = 'idle' | 'pending' | 'failure' | 'success';

export type ProjectsEvaluationScenario =
  | 'default'
  | 'filtered'
  | 'no-results'
  | 'create-invalid'
  | 'create-pending'
  | 'create-failure'
  | 'create-success'
  | 'detail-open'
  | 'save-failure'
  | 'save-success'
  | 'archive-confirmation'
  | 'archived';

export interface ProjectsEvaluationProps {
  language?: Language;
  theme?: 'light' | 'dark';
  viewportMode?: 'auto' | 'expanded' | 'compact';
  scenario?: ProjectsEvaluationScenario;
}

interface Project {
  id: string;
  key: string;
  name: string;
  owner: string;
  status: ProjectStatus;
}

interface ProjectDraft {
  key: string;
  name: string;
  status: ProjectStatus;
}

const PROJECTS: Project[] = [
  {
    id: 'billing-revamp',
    key: 'BILL',
    name: 'Billing revamp',
    owner: 'Sara Ahmed',
    status: 'Active',
  },
  {
    id: 'mobile-onboarding',
    key: 'MOB',
    name: 'Mobile onboarding',
    owner: 'Omar Khalid',
    status: 'Active',
  },
  {
    id: 'research-hub',
    key: 'RSH',
    name: 'Research hub',
    owner: 'Daniel Chen',
    status: 'Draft',
  },
];

const CREATED_PROJECT: Project = {
  id: 'platform-migration',
  key: 'PLT',
  name: 'Platform migration',
  owner: '—',
  status: 'Draft',
};

const EMPTY_DRAFT: ProjectDraft = {
  key: '',
  name: '',
  status: 'Active',
};

const COPY = {
  en: {
    active: 'Active',
    archive: 'Archive project',
    archiveBody:
      'This removes the project from the active directory. This action should only continue when you are sure.',
    archiveClose: 'Close archive confirmation',
    archiveDescription: 'Confirm this consequential change before continuing.',
    archivePending: 'Archiving…',
    archiveSuccess: 'Project archived',
    archiveSuccessMessage: 'The project was removed from the active directory.',
    archiveTitle: (name: string) => `Archive ${name}?`,
    breadcrumbs: 'Breadcrumbs',
    cancel: 'Cancel',
    clearSearch: 'Clear search',
    closeCreate: 'Close create project dialog',
    closeDetails: 'Close project details',
    create: 'Create project',
    createDescription: 'Add the project identity and choose its starting status.',
    createFailure: 'Project was not created. Your entries are still here—try again.',
    createFailureTitle: 'Could not create project',
    createPending: 'Creating…',
    createSuccess: 'Project created',
    createSuccessMessage: 'The project was added to the directory.',
    description: 'Browse, create, and maintain the projects in this workspace.',
    details: 'Details',
    detailsEyebrow: 'PROJECT DETAILS',
    detailsFor: (name: string) => `View details for ${name}`,
    detailsHost: (name: string) => `${name} project details`,
    directoryLabel: 'Projects directory',
    draft: 'Draft',
    emptyBody: (query: string) =>
      `No project names or keys match “${query}”. Try a different search or clear it to see every project.`,
    emptyTitle: 'No projects found',
    key: 'Project key',
    keyError: 'Enter a project key.',
    keyHint: 'Use the short key your team recognizes.',
    name: 'Project name',
    nameError: 'Enter a project name.',
    navProjects: 'Projects',
    newProject: 'Create project',
    owner: 'Owner',
    primary: 'Project',
    resultCount: (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`,
    retryCreate: 'Retry create',
    retrySave: 'Retry save',
    save: 'Save changes',
    saveFailure: 'Changes were not saved. Your edits are still here—try again.',
    saveFailureTitle: 'Could not save changes',
    savePending: 'Saving…',
    saveSuccess: 'Changes saved',
    saveSuccessMessage: 'The directory now reflects the latest project details.',
    search: 'Search projects',
    searchPlaceholder: 'Search by project name or key',
    shellContext: 'Workspace administration',
    startingStatus: 'Starting status',
    status: 'Status',
    workspace: 'Workspace',
    workspaceNav: 'WORKSPACE',
  },
  ar: {
    active: 'نشط',
    archive: 'أرشفة المشروع',
    archiveBody: 'سيؤدي هذا إلى إزالة المشروع من الدليل النشط. تابع فقط إذا كنت متأكدًا.',
    archiveClose: 'إغلاق تأكيد الأرشفة',
    archiveDescription: 'أكّد هذا التغيير المهم قبل المتابعة.',
    archivePending: 'جارٍ الأرشفة…',
    archiveSuccess: 'تمت أرشفة المشروع',
    archiveSuccessMessage: 'تمت إزالة المشروع من الدليل النشط.',
    archiveTitle: (name: string) => `أرشفة ${name}؟`,
    breadcrumbs: 'مسار التنقل',
    cancel: 'إلغاء',
    clearSearch: 'مسح البحث',
    closeCreate: 'إغلاق نافذة إنشاء المشروع',
    closeDetails: 'إغلاق تفاصيل المشروع',
    create: 'إنشاء المشروع',
    createDescription: 'أضف هوية المشروع واختر حالته الأولية.',
    createFailure: 'لم يتم إنشاء المشروع. ما زالت بياناتك محفوظة—حاول مرة أخرى.',
    createFailureTitle: 'تعذر إنشاء المشروع',
    createPending: 'جارٍ الإنشاء…',
    createSuccess: 'تم إنشاء المشروع',
    createSuccessMessage: 'تمت إضافة المشروع إلى الدليل.',
    description: 'استعرض مشاريع مساحة العمل وأنشئها وحافظ على بياناتها.',
    details: 'التفاصيل',
    detailsEyebrow: 'تفاصيل المشروع',
    detailsFor: (name: string) => `عرض تفاصيل ${name}`,
    detailsHost: (name: string) => `تفاصيل مشروع ${name}`,
    directoryLabel: 'دليل المشاريع',
    draft: 'مسودة',
    emptyBody: (query: string) =>
      `لا توجد أسماء مشاريع أو مفاتيح تطابق «${query}». جرّب بحثًا مختلفًا أو امسحه لعرض كل المشاريع.`,
    emptyTitle: 'لم يتم العثور على مشاريع',
    key: 'مفتاح المشروع',
    keyError: 'أدخل مفتاح المشروع.',
    keyHint: 'استخدم المفتاح المختصر الذي يعرفه فريقك.',
    name: 'اسم المشروع',
    nameError: 'أدخل اسم المشروع.',
    navProjects: 'المشاريع',
    newProject: 'إنشاء مشروع',
    owner: 'المالك',
    primary: 'المشروع',
    resultCount: (count: number) => `${count} ${count === 1 ? 'مشروع' : 'مشاريع'}`,
    retryCreate: 'إعادة محاولة الإنشاء',
    retrySave: 'إعادة محاولة الحفظ',
    save: 'حفظ التغييرات',
    saveFailure: 'لم يتم حفظ التغييرات. ما زالت تعديلاتك محفوظة—حاول مرة أخرى.',
    saveFailureTitle: 'تعذر حفظ التغييرات',
    savePending: 'جارٍ الحفظ…',
    saveSuccess: 'تم حفظ التغييرات',
    saveSuccessMessage: 'يعرض الدليل الآن أحدث تفاصيل المشروع.',
    search: 'البحث في المشاريع',
    searchPlaceholder: 'ابحث باسم المشروع أو مفتاحه',
    shellContext: 'إدارة مساحة العمل',
    startingStatus: 'الحالة الأولية',
    status: 'الحالة',
    workspace: 'مساحة العمل',
    workspaceNav: 'مساحة العمل',
  },
} as const;

const waitForDemoRequest = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, 180);
  });

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="projects-nav-icon"
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

const PROJECTS_ICON = (
  <NavIcon>
    <path d="M3.5 7.5h6l2-2h9v13h-17z" />
  </NavIcon>
);

function initialProjectsForScenario(scenario: ProjectsEvaluationScenario) {
  if (scenario === 'create-success') {
    return [...PROJECTS, CREATED_PROJECT];
  }

  if (scenario === 'save-success') {
    return PROJECTS.map((project) =>
      project.id === 'billing-revamp'
        ? { ...project, name: 'Billing modernization' }
        : project,
    );
  }

  if (scenario === 'archived') {
    return PROJECTS.filter((project) => project.id !== 'billing-revamp');
  }

  return PROJECTS;
}

function initialQueryForScenario(scenario: ProjectsEvaluationScenario) {
  if (scenario === 'filtered') return 'MOB';
  if (scenario === 'no-results') return 'missing';
  return '';
}

function initialCreateDraftForScenario(
  scenario: ProjectsEvaluationScenario,
): ProjectDraft {
  if (scenario === 'create-pending' || scenario === 'create-failure') {
    return {
      key: CREATED_PROJECT.key,
      name: CREATED_PROJECT.name,
      status: CREATED_PROJECT.status,
    };
  }

  return EMPTY_DRAFT;
}

function isCreateScenario(scenario: ProjectsEvaluationScenario) {
  return (
    scenario === 'create-invalid' ||
    scenario === 'create-pending' ||
    scenario === 'create-failure'
  );
}

function initialDetailScenario(scenario: ProjectsEvaluationScenario) {
  return (
    scenario === 'detail-open' ||
    scenario === 'save-failure' ||
    scenario === 'save-success' ||
    scenario === 'archive-confirmation'
  );
}

export function ProjectsEvaluation({
  language = 'en',
  theme = 'light',
  viewportMode = 'auto',
  scenario = 'default',
}: ProjectsEvaluationProps) {
  const copy = COPY[language];
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const createFormId = `create-project-${useId()}`;
  const editFormId = `edit-project-${useId()}`;
  const detailTitleId = `project-detail-${useId()}`;
  const shellRef = useRef<HTMLDivElement>(null);
  const detailHostRef = useRef<HTMLDivElement>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const createAttemptsRef = useRef(scenario === 'create-failure' ? 1 : 0);
  const saveAttemptsRef = useRef(scenario === 'save-failure' ? 1 : 0);

  const [projects, setProjects] = useState<Project[]>(() =>
    initialProjectsForScenario(scenario),
  );
  const [query, setQuery] = useState(() => initialQueryForScenario(scenario));
  const [createOpen, setCreateOpen] = useState(() => isCreateScenario(scenario));
  const [createDraft, setCreateDraft] = useState<ProjectDraft>(() =>
    initialCreateDraftForScenario(scenario),
  );
  const [createAttempted, setCreateAttempted] = useState(
    scenario === 'create-invalid',
  );
  const [createPhase, setCreatePhase] = useState<RequestPhase>(() => {
    if (scenario === 'create-pending') return 'pending';
    if (scenario === 'create-failure') return 'failure';
    return 'idle';
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() =>
    initialDetailScenario(scenario) ? 'billing-revamp' : null,
  );
  const [editDraft, setEditDraft] = useState<ProjectDraft>(() => {
    const project = initialProjectsForScenario(scenario).find(
      (candidate) => candidate.id === 'billing-revamp',
    );
    return {
      key: project?.key ?? '',
      name: project?.name ?? '',
      status: project?.status ?? 'Active',
    };
  });
  const [editAttempted, setEditAttempted] = useState(false);
  const [editPhase, setEditPhase] = useState<RequestPhase>(() => {
    if (scenario === 'save-failure') return 'failure';
    if (scenario === 'save-success') return 'success';
    return 'idle';
  });
  const [archiveOpen, setArchiveOpen] = useState(
    scenario === 'archive-confirmation',
  );
  const [archivePending, setArchivePending] = useState(false);
  const [pageOutcome, setPageOutcome] = useState<
    'created' | 'archived' | null
  >(() => {
    if (scenario === 'create-success') return 'created';
    if (scenario === 'archived') return 'archived';
    return null;
  });

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return projects;

    return projects.filter(
      (project) =>
        project.name.toLocaleLowerCase().includes(normalizedQuery) ||
        project.key.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [projects, query]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    if (selectedProject) {
      shell.setAttribute('inert', '');
      shell.setAttribute('aria-hidden', 'true');
    } else {
      shell.removeAttribute('inert');
      shell.removeAttribute('aria-hidden');
    }

    return () => {
      shell.removeAttribute('inert');
      shell.removeAttribute('aria-hidden');
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject || archiveOpen) return;

    window.requestAnimationFrame(() => {
      const firstFocusable = detailHostRef.current?.querySelector<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    });
  }, [archiveOpen, selectedProject]);

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateDraft(EMPTY_DRAFT);
    setCreateAttempted(false);
    setCreatePhase('idle');
    createAttemptsRef.current = 0;
  };

  const openCreate = () => {
    setPageOutcome(null);
    setCreateDraft(EMPTY_DRAFT);
    setCreateAttempted(false);
    setCreatePhase('idle');
    createAttemptsRef.current = 0;
    setCreateOpen(true);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateAttempted(true);

    if (!createDraft.name.trim() || !createDraft.key.trim()) return;

    setCreatePhase('pending');
    await waitForDemoRequest();

    if (createAttemptsRef.current === 0) {
      createAttemptsRef.current += 1;
      setCreatePhase('failure');
      return;
    }

    const project: Project = {
      id: `${createDraft.key.trim().toLocaleLowerCase()}-${Date.now()}`,
      key: createDraft.key.trim(),
      name: createDraft.name.trim(),
      owner: '—',
      status: createDraft.status,
    };

    setProjects((current) => [...current, project]);
    setPageOutcome('created');
    closeCreate();
  };

  const openDetails = (
    project: Project,
    trigger: HTMLButtonElement,
  ) => {
    detailTriggerRef.current = trigger;
    setEditDraft({ key: project.key, name: project.name, status: project.status });
    setEditAttempted(false);
    setEditPhase('idle');
    saveAttemptsRef.current = 0;
    setSelectedProjectId(project.id);
  };

  const closeDetails = () => {
    setArchiveOpen(false);
    setSelectedProjectId(null);
    setEditPhase('idle');
    window.requestAnimationFrame(() => detailTriggerRef.current?.focus());
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditAttempted(true);

    if (!selectedProject || !editDraft.name.trim() || !editDraft.key.trim()) {
      return;
    }

    setEditPhase('pending');
    await waitForDemoRequest();

    if (saveAttemptsRef.current === 0) {
      saveAttemptsRef.current += 1;
      setEditPhase('failure');
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              key: editDraft.key.trim(),
              name: editDraft.name.trim(),
              status: editDraft.status,
            }
          : project,
      ),
    );
    setEditPhase('success');
  };

  const handleArchive = async () => {
    if (!selectedProject) return;

    setArchivePending(true);
    await waitForDemoRequest();
    setProjects((current) =>
      current.filter((project) => project.id !== selectedProject.id),
    );
    setArchivePending(false);
    setArchiveOpen(false);
    setSelectedProjectId(null);
    setPageOutcome('archived');
    window.requestAnimationFrame(() => detailTriggerRef.current?.focus());
  };

  const handleDetailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (archiveOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDetails();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      detailHostRef.current?.querySelectorAll<HTMLElement>(
        'input:not(:disabled), button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => !element.hasAttribute('aria-hidden'));

    if (focusable.length === 0) {
      event.preventDefault();
      detailHostRef.current?.focus();
      return;
    }

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const statusOptions = [
    {
      label: copy.active,
      value: 'Active',
    },
    {
      label: copy.draft,
      value: 'Draft',
    },
  ] as const;

  const navigationItems = [
    {
      href: '#projects',
      icon: PROJECTS_ICON,
      id: 'projects',
      label: copy.navProjects,
    },
  ];

  const tableRows = filteredProjects.map((project) => ({
    action: (
      <Button
        aria-label={copy.detailsFor(project.name)}
        emphasis="text"
        onClick={(event) => openDetails(project, event.currentTarget)}
      >
        {copy.details}
      </Button>
    ),
    id: project.id,
    primary: (
      <span className="project-identity">
        <span className="project-identity__name">{project.name}</span>
        <span className="project-key" dir="ltr">
          {project.key}
        </span>
      </span>
    ),
    secondary: project.owner,
    selected: project.id === selectedProjectId,
    status: (
      <StatusBadge
        label={project.status === 'Active' ? copy.active : copy.draft}
      />
    ),
  }));

  return (
    <div
      className="projects-evaluation"
      data-language={language === 'ar' ? 'arabic' : 'english'}
      data-theme={theme}
      dir={direction}
      lang={language}
    >
      <div ref={shellRef}>
        <ApplicationShell
          pageHeading={
            <PageHeading
              actions={<Button onClick={openCreate}>{copy.newProject}</Button>}
              breadcrumbs={
                <Breadcrumbs
                  ancestors={[{ href: '#workspace', label: copy.workspace }]}
                  ariaLabel={copy.breadcrumbs}
                  currentLabel={copy.navProjects}
                />
              }
              description={copy.description}
              title={copy.navProjects}
            />
          }
          sidebar={
            <Sidebar
              currentId="projects"
              items={navigationItems}
              label={copy.workspaceNav}
            />
          }
          topNavbar={
            <TopNavbar
              brand={
                <span className="projects-brand" dir="ltr">
                  Northstar
                </span>
              }
              contextLabel={copy.shellContext}
            />
          }
          viewportMode={viewportMode}
        >
          <section
            aria-label={copy.directoryLabel}
            className="projects-directory"
          >
            {pageOutcome === 'created' ? (
              <InlineFeedback
                intent="success"
                message={copy.createSuccessMessage}
                title={copy.createSuccess}
              />
            ) : null}
            {pageOutcome === 'archived' ? (
              <InlineFeedback
                intent="success"
                message={copy.archiveSuccessMessage}
                title={copy.archiveSuccess}
              />
            ) : null}

            <div className="projects-directory__controls">
              <div className="projects-directory__search">
                <SearchField
                  aria-label={copy.search}
                  clearButtonLabel={copy.clearSearch}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  onClear={() => setQuery('')}
                  placeholder={copy.searchPlaceholder}
                  value={query}
                />
              </div>
              <p aria-live="polite" className="projects-directory__count">
                {copy.resultCount(filteredProjects.length)}
              </p>
            </div>

            <div className="projects-directory__results">
              {filteredProjects.length > 0 ? (
                <div className="projects-directory__table-scroll">
                  <Table
                    actionLabel={copy.details}
                    primaryLabel={copy.primary}
                    rows={tableRows}
                    secondaryLabel={copy.owner}
                    statusLabel={copy.status}
                  />
                </div>
              ) : (
                <EmptyState
                  actions={
                    <Button emphasis="secondary" onClick={() => setQuery('')}>
                      {copy.clearSearch}
                    </Button>
                  }
                  body={copy.emptyBody(query)}
                  title={copy.emptyTitle}
                />
              )}
            </div>
          </section>
        </ApplicationShell>
      </div>

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={closeCreate}>
              {copy.cancel}
            </Button>
            <Button
              form={createFormId}
              loading={createPhase === 'pending'}
              loadingLabel={copy.createPending}
              type="submit"
            >
              {createPhase === 'failure' ? copy.retryCreate : copy.create}
            </Button>
          </>
        }
        closeLabel={copy.closeCreate}
        description={copy.createDescription}
        onOpenChange={(open) => {
          if (!open) closeCreate();
        }}
        open={createOpen}
        title={copy.create}
      >
        <form
          className="project-form"
          id={createFormId}
          noValidate
          onSubmit={handleCreate}
        >
          <TextField
            autoComplete="off"
            errorMessage={copy.nameError}
            invalid={createAttempted && !createDraft.name.trim()}
            label={copy.name}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setCreateDraft((current) => ({
                ...current,
                name: value,
              }));
              setCreatePhase('idle');
            }}
            required
            value={createDraft.name}
          />
          <TextField
            autoComplete="off"
            dir="ltr"
            errorMessage={copy.keyError}
            invalid={createAttempted && !createDraft.key.trim()}
            label={copy.key}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setCreateDraft((current) => ({
                ...current,
                key: value,
              }));
              setCreatePhase('idle');
            }}
            required
            supportingText={copy.keyHint}
            value={createDraft.key}
          />
          <RadioGroup
            label={copy.startingStatus}
            name="create-project-status"
            onValueChange={(value) =>
              setCreateDraft((current) => ({
                ...current,
                status: value as ProjectStatus,
              }))
            }
            options={statusOptions}
            value={createDraft.status}
          />
          {createPhase === 'failure' ? (
            <InlineFeedback
              intent="error"
              message={copy.createFailure}
              title={copy.createFailureTitle}
            />
          ) : null}
        </form>
      </Dialog>

      {selectedProject ? (
        <div
          aria-labelledby={detailTitleId}
          aria-modal="true"
          className="projects-detail-modal"
          onKeyDown={handleDetailKeyDown}
          ref={detailHostRef}
          role="dialog"
          tabIndex={-1}
        >
          <span className="projects-visually-hidden" id={detailTitleId}>
            {copy.detailsHost(selectedProject.name)}
          </span>
          <div aria-hidden="true" className="projects-detail-modal__backdrop" />
          <div className="projects-detail-modal__panel">
            <SidePanel
              actions={
                <>
                  <Button
                    emphasis="text"
                    onClick={() => setArchiveOpen(true)}
                    tone="critical"
                  >
                    {copy.archive}
                  </Button>
                  <Button
                    form={editFormId}
                    loading={editPhase === 'pending'}
                    loadingLabel={copy.savePending}
                    type="submit"
                  >
                    {editPhase === 'failure' ? copy.retrySave : copy.save}
                  </Button>
                </>
              }
              className="projects-detail-panel"
              closeLabel={copy.closeDetails}
              eyebrow={copy.detailsEyebrow}
              header={
                <div className="project-detail-header">
                  <h2>{selectedProject.name}</h2>
                  <span className="project-key" dir="ltr">
                    {selectedProject.key}
                  </span>
                  <p>{selectedProject.owner}</p>
                </div>
              }
              onClose={closeDetails}
            >
              <form
                className="project-form"
                id={editFormId}
                noValidate
                onSubmit={handleSave}
              >
                <TextField
                  autoComplete="off"
                  errorMessage={copy.nameError}
                  invalid={editAttempted && !editDraft.name.trim()}
                  label={copy.name}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setEditDraft((current) => ({
                      ...current,
                      name: value,
                    }));
                    setEditPhase('idle');
                  }}
                  required
                  value={editDraft.name}
                />
                <TextField
                  autoComplete="off"
                  dir="ltr"
                  errorMessage={copy.keyError}
                  invalid={editAttempted && !editDraft.key.trim()}
                  label={copy.key}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setEditDraft((current) => ({
                      ...current,
                      key: value,
                    }));
                    setEditPhase('idle');
                  }}
                  required
                  supportingText={copy.keyHint}
                  value={editDraft.key}
                />
                <RadioGroup
                  label={copy.status}
                  name="edit-project-status"
                  onValueChange={(value) => {
                    setEditDraft((current) => ({
                      ...current,
                      status: value as ProjectStatus,
                    }));
                    setEditPhase('idle');
                  }}
                  options={statusOptions}
                  value={editDraft.status}
                />
                {editPhase === 'failure' ? (
                  <InlineFeedback
                    intent="error"
                    message={copy.saveFailure}
                    title={copy.saveFailureTitle}
                  />
                ) : null}
                {editPhase === 'success' ? (
                  <InlineFeedback
                    intent="success"
                    message={copy.saveSuccessMessage}
                    title={copy.saveSuccess}
                  />
                ) : null}
              </form>
            </SidePanel>
          </div>

          <Dialog
            actions={
              <>
                <Button
                  emphasis="secondary"
                  onClick={() => setArchiveOpen(false)}
                >
                  {copy.cancel}
                </Button>
                <Button
                  loading={archivePending}
                  loadingLabel={copy.archivePending}
                  onClick={handleArchive}
                  tone="critical"
                >
                  {copy.archive}
                </Button>
              </>
            }
            closeLabel={copy.archiveClose}
            description={copy.archiveDescription}
            onOpenChange={setArchiveOpen}
            open={archiveOpen}
            title={copy.archiveTitle(selectedProject.name)}
          >
            <p className="projects-confirmation-copy">{copy.archiveBody}</p>
          </Dialog>
        </div>
      ) : null}
    </div>
  );
}
