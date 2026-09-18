import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  Avatar,
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
  type SidebarItem,
  type TableRowData,
} from '@design-system-exercise/react';
import { ApplicationShell } from '@design-system-exercise/patterns';
import './ConnectedProductPrototype.css';
import './ProjectsManagementPrototype.css';

export type ProjectsPrototypeLanguage = 'english' | 'arabic';
export type ProjectsPrototypeTheme = 'light' | 'dark';
export type ProjectStatus = 'Active' | 'Draft';

export interface ProjectOwner {
  id: string;
  name: string;
  initials: string;
}

export interface PrototypeProject {
  id: string;
  name: string;
  key: string;
  owner: ProjectOwner;
  status: ProjectStatus;
}

export interface ProjectsManagementPrototypeProps {
  language?: ProjectsPrototypeLanguage;
  theme?: ProjectsPrototypeTheme;
}

type RequestPhase = 'editing' | 'submitting' | 'failed';
type SavePhase = 'idle' | 'saving' | 'failed' | 'saved';

const copyByLanguage = {
  english: {
    nav: {
      overview: 'Overview',
      projects: 'Projects',
      team: 'Team & access',
      settings: 'Settings',
      workspace: 'WORKSPACE',
    },
    account: 'Amal Hassan · Admin',
    workspaceName: 'Northstar workspace',
    signedIn: 'Signed in as Admin',
    context: 'Workspace administration',
    pageTitle: 'Projects',
    pageDescription: 'Create, find, and manage workspace projects.',
    breadcrumbLabel: 'Breadcrumbs',
    breadcrumbAncestor: 'Workspace',
    breadcrumbCurrent: 'Projects',
    createProject: 'Create project',
    searchLabel: 'Search projects',
    searchClear: 'Clear search',
    searchPlaceholder: 'Search by project name or key',
    project: 'Project',
    owner: 'Owner',
    status: 'Status',
    details: 'Details',
    view: 'View',
    active: 'Active',
    draft: 'Draft',
    projects: 'projects',
    shownSingle: 'project shown',
    shownPlural: 'projects shown',
    noProjects: 'No projects found',
    noMatchPrefix: 'No project names or keys match',
    noMatchSuffix: 'Try a different search or clear it to see all projects.',
    projectDetails: 'PROJECT DETAILS',
    closeProjectDetails: 'Close project details',
    projectName: 'Project name',
    projectKey: 'Project key',
    projectKeyHelp: 'Use 2–8 uppercase letters or numbers.',
    projectNameRequired: 'Enter a project name.',
    projectKeyRequired: 'Enter a project key.',
    projectKeyInvalid: 'Use 2–8 uppercase letters or numbers.',
    projectKeyTaken: 'This project key is already in use.',
    startingStatus: 'Starting status',
    savedStatus: 'Saved status',
    saveChanges: 'Save changes',
    retrySave: 'Retry save',
    saving: 'Saving…',
    changesNotSaved: 'Changes not saved',
    projectRetained: 'Your project edits are still here. Try again.',
    changesSaved: 'Changes saved',
    archiveProject: 'Archive project',
    archiveTitle: 'Archive project?',
    archiveDescription: 'This removes the project from the active directory.',
    archiveBody: 'You can continue managing other projects after this one is archived.',
    archive: 'Archive',
    cancel: 'Cancel',
    createTitle: 'Create project',
    createDescription: 'Add a project to the Northstar workspace.',
    create: 'Create project',
    retryCreate: 'Retry create',
    creating: 'Creating…',
    retrying: 'Retrying…',
    projectNotCreated: 'Project not created',
    createRetained: 'Your entries are still here. Try again.',
    projectCreated: 'Project created',
    createdMessage: 'The new project is now available in the directory.',
    projectArchived: 'Project archived',
    archivedMessage: 'The project was removed from the active directory.',
  },
  arabic: {
    nav: {
      overview: 'نظرة عامة',
      projects: 'المشاريع',
      team: 'الفريق والصلاحيات',
      settings: 'الإعدادات',
      workspace: 'مساحة العمل',
    },
    account: 'أمل حسن · مشرفة',
    workspaceName: 'مساحة نورث ستار',
    signedIn: 'تم تسجيل الدخول كمشرفة',
    context: 'إدارة مساحة العمل',
    pageTitle: 'المشاريع',
    pageDescription: 'أنشئ مشاريع مساحة العمل وابحث عنها وأدرها.',
    breadcrumbLabel: 'مسار الصفحة',
    breadcrumbAncestor: 'مساحة العمل',
    breadcrumbCurrent: 'المشاريع',
    createProject: 'إنشاء مشروع',
    searchLabel: 'البحث في المشاريع',
    searchClear: 'مسح البحث',
    searchPlaceholder: 'ابحث باسم المشروع أو المفتاح',
    project: 'المشروع',
    owner: 'المالك',
    status: 'الحالة',
    details: 'التفاصيل',
    view: 'عرض',
    active: 'نشط',
    draft: 'مسودة',
    projects: 'مشاريع',
    shownSingle: 'تم عرض مشروع واحد',
    shownPlural: 'تم عرض مشاريع',
    noProjects: 'لم يتم العثور على مشاريع',
    noMatchPrefix: 'لا توجد أسماء مشاريع أو مفاتيح تطابق',
    noMatchSuffix: 'جرّب بحثًا مختلفًا أو امسحه لرؤية جميع المشاريع.',
    projectDetails: 'تفاصيل المشروع',
    closeProjectDetails: 'إغلاق تفاصيل المشروع',
    projectName: 'اسم المشروع',
    projectKey: 'مفتاح المشروع',
    projectKeyHelp: 'استخدم من حرفين إلى 8 أحرف أو أرقام لاتينية كبيرة.',
    projectNameRequired: 'أدخل اسم المشروع.',
    projectKeyRequired: 'أدخل مفتاح المشروع.',
    projectKeyInvalid: 'استخدم من حرفين إلى 8 أحرف أو أرقام لاتينية كبيرة.',
    projectKeyTaken: 'مفتاح المشروع مستخدم بالفعل.',
    startingStatus: 'الحالة عند الإنشاء',
    savedStatus: 'الحالة المحفوظة',
    saveChanges: 'حفظ التغييرات',
    retrySave: 'إعادة محاولة الحفظ',
    saving: 'جارٍ الحفظ…',
    changesNotSaved: 'لم تُحفظ التغييرات',
    projectRetained: 'تعديلات المشروع ما زالت موجودة. حاول مرة أخرى.',
    changesSaved: 'تم حفظ التغييرات',
    archiveProject: 'أرشفة المشروع',
    archiveTitle: 'أرشفة المشروع؟',
    archiveDescription: 'سيتم حذف المشروع من قائمة المشاريع النشطة.',
    archiveBody: 'يمكنك متابعة إدارة المشاريع الأخرى بعد أرشفة هذا المشروع.',
    archive: 'أرشفة',
    cancel: 'إلغاء',
    createTitle: 'إنشاء مشروع',
    createDescription: 'أضف مشروعًا إلى مساحة عمل نورث ستار.',
    create: 'إنشاء المشروع',
    retryCreate: 'إعادة محاولة الإنشاء',
    creating: 'جارٍ الإنشاء…',
    retrying: 'جارٍ إعادة المحاولة…',
    projectNotCreated: 'لم يتم إنشاء المشروع',
    createRetained: 'تم الاحتفاظ بالبيانات. حاول مرة أخرى.',
    projectCreated: 'تم إنشاء المشروع',
    createdMessage: 'المشروع الجديد متاح الآن في القائمة.',
    projectArchived: 'تمت أرشفة المشروع',
    archivedMessage: 'تم حذف المشروع من قائمة المشاريع النشطة.',
  },
} as const;

const owners = {
  amal: { id: 'amal', name: 'Amal Hassan', initials: 'AH' },
  sara: { id: 'sara', name: 'Sara Ahmed', initials: 'SA' },
  omar: { id: 'omar', name: 'Omar Khalid', initials: 'OK' },
  leila: { id: 'leila', name: 'Leila Ibrahim', initials: 'LI' },
  daniel: { id: 'daniel', name: 'Daniel Chen', initials: 'DC' },
} as const;

export const prototypeInitialProjects: readonly PrototypeProject[] = [
  {
    id: 'website-redesign',
    name: 'Website redesign',
    key: 'WEB',
    owner: owners.sara,
    status: 'Active',
  },
  {
    id: 'mobile-onboarding',
    name: 'Mobile onboarding',
    key: 'MOB',
    owner: owners.omar,
    status: 'Active',
  },
  {
    id: 'design-system',
    name: 'Design system',
    key: 'DS',
    owner: owners.amal,
    status: 'Draft',
  },
  {
    id: 'checkout-experiment',
    name: 'Checkout experiment',
    key: 'CHK',
    owner: owners.leila,
    status: 'Draft',
  },
  {
    id: 'research-hub',
    name: 'Research hub',
    key: 'RSH',
    owner: owners.daniel,
    status: 'Active',
  },
];

const arabicProjectNames: Record<string, string> = {
  'website-redesign': 'إعادة تصميم الموقع',
  'mobile-onboarding': 'تهيئة تطبيق الهاتف',
  'design-system': 'نظام التصميم',
  'checkout-experiment': 'تجربة إتمام الشراء',
  'research-hub': 'مركز الأبحاث',
};

const arabicOwnerNames: Record<string, string> = {
  amal: 'أمل حسن',
  sara: 'سارة أحمد',
  omar: 'عمر خالد',
  leila: 'ليلى إبراهيم',
  daniel: 'دانيال تشين',
};

export function displayProjectName(
  project: PrototypeProject,
  language: ProjectsPrototypeLanguage,
) {
  if (language === 'english') return project.name;
  return arabicProjectNames[project.id] ?? project.name;
}

function displayOwnerName(
  owner: ProjectOwner,
  language: ProjectsPrototypeLanguage,
) {
  if (language === 'english') return owner.name;
  return arabicOwnerNames[owner.id] ?? owner.name;
}

function displayStatus(
  status: ProjectStatus,
  language: ProjectsPrototypeLanguage,
) {
  const copy = copyByLanguage[language];
  return status === 'Active' ? copy.active : copy.draft;
}

export function filterPrototypeProjects(
  projects: readonly PrototypeProject[],
  query: string,
  language: ProjectsPrototypeLanguage = 'english',
): readonly PrototypeProject[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return projects;

  return projects.filter((project) =>
    `${project.name} ${displayProjectName(project, language)} ${project.key}`
      .toLowerCase()
      .includes(normalized),
  );
}

export function projectNameError(
  name: string,
  language: ProjectsPrototypeLanguage = 'english',
): string | null {
  if (name.trim()) return null;
  return copyByLanguage[language].projectNameRequired;
}

export function projectKeyError(
  key: string,
  projects: readonly PrototypeProject[],
  language: ProjectsPrototypeLanguage = 'english',
  exceptId?: string,
): string | null {
  const copy = copyByLanguage[language];
  const normalized = key.trim().toUpperCase();
  if (!normalized) return copy.projectKeyRequired;
  if (!/^[A-Z0-9]{2,8}$/.test(normalized)) return copy.projectKeyInvalid;
  if (
    projects.some(
      (project) =>
        project.id !== exceptId && project.key.toUpperCase() === normalized,
    )
  ) {
    return copy.projectKeyTaken;
  }
  return null;
}

const overviewIconUrl = new URL('./assets/sidebar-overview.svg', import.meta.url).href;
const projectsIconUrl = new URL('./assets/sidebar-projects.svg', import.meta.url).href;
const teamIconUrl = new URL('./assets/sidebar-team.svg', import.meta.url).href;
const settingsIconUrl = new URL('./assets/sidebar-settings.svg', import.meta.url).href;
const plusIconUrl = new URL('./assets/invite-plus.svg', import.meta.url).href;
const viewIconUrl = new URL('./assets/view-chevron.svg', import.meta.url).href;

function ProductIcon({
  src,
  directional = false,
}: {
  src: string;
  directional?: boolean;
}) {
  return (
    <span
      className="dse-product-prototype__button-icon"
      aria-hidden="true"
      data-dse-directional-icon={directional ? 'true' : undefined}
      style={
        {
          '--dse-prototype-button-image': `url("${src}")`,
        } as CSSProperties
      }
    />
  );
}

function NavIcon({ src }: { src: string }) {
  return (
    <span
      className="dse-product-prototype__nav-glyph"
      aria-hidden="true"
      style={
        {
          '--dse-prototype-nav-image': `url("${src}")`,
        } as CSSProperties
      }
    />
  );
}

function Brand() {
  return (
    <div className="dse-product-prototype__brand">
      <span className="dse-product-prototype__brand-mark" aria-hidden="true">
        N
      </span>
      <strong>Northstar</strong>
    </div>
  );
}

function WorkspaceFooter({ language }: { language: ProjectsPrototypeLanguage }) {
  const copy = copyByLanguage[language];
  return (
    <div className="dse-product-prototype__workspace-footer">
      <strong>{copy.workspaceName}</strong>
      <span>{copy.signedIn}</span>
    </div>
  );
}

function Account({ language }: { language: ProjectsPrototypeLanguage }) {
  const copy = copyByLanguage[language];
  return (
    <div className="dse-product-prototype__account">
      <div className="dse-product-prototype__account-identity">
        <span>{copy.account}</span>
        <Avatar initials={language === 'arabic' ? 'أح' : 'AH'} />
      </div>
    </div>
  );
}

function ProjectIdentity({
  project,
  language,
}: {
  project: PrototypeProject;
  language: ProjectsPrototypeLanguage;
}) {
  return (
    <div className="dse-projects-prototype__project-identity">
      <strong>{displayProjectName(project, language)}</strong>
      <span dir="ltr">{project.key}</span>
    </div>
  );
}

function OwnerIdentity({
  owner,
  language,
}: {
  owner: ProjectOwner;
  language: ProjectsPrototypeLanguage;
}) {
  return (
    <div className="dse-projects-prototype__owner">
      <Avatar initials={owner.initials} />
      <span>{displayOwnerName(owner, language)}</span>
    </div>
  );
}

function ProjectPanelHeader({
  project,
  language,
}: {
  project: PrototypeProject;
  language: ProjectsPrototypeLanguage;
}) {
  return (
    <div className="dse-projects-prototype__panel-header">
      <strong>{displayProjectName(project, language)}</strong>
      <span dir="ltr">{project.key}</span>
    </div>
  );
}

export function ProjectsManagementPrototype({
  language = 'english',
  theme = 'light',
}: ProjectsManagementPrototypeProps) {
  const copy = copyByLanguage[language];
  const arabic = language === 'arabic';

  const [projects, setProjects] =
    useState<readonly PrototypeProject[]>(prototypeInitialProjects);
  const [query, setQuery] = useState('');
  const [directoryFeedback, setDirectoryFeedback] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createKey, setCreateKey] = useState('');
  const [createStatus, setCreateStatus] = useState<ProjectStatus>('Draft');
  const [createNameValidation, setCreateNameValidation] = useState<string | null>(null);
  const [createKeyValidation, setCreateKeyValidation] = useState<string | null>(null);
  const [createPhase, setCreatePhase] = useState<RequestPhase>('editing');
  const [createFailedOnce, setCreateFailedOnce] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftKey, setDraftKey] = useState('');
  const [draftStatus, setDraftStatus] = useState<ProjectStatus>('Draft');
  const [draftNameValidation, setDraftNameValidation] = useState<string | null>(null);
  const [draftKeyValidation, setDraftKeyValidation] = useState<string | null>(null);
  const [savePhase, setSavePhase] = useState<SavePhase>('idle');
  const [saveFailedOnce, setSaveFailedOnce] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const timers = useRef<number[]>([]);
  const shellHostRef = useRef<HTMLDivElement>(null);
  const detailDialogRef = useRef<HTMLDivElement>(null);
  const lastProjectTrigger = useRef<HTMLElement | null>(null);

  const schedule = (callback: () => void) => {
    const id = window.setTimeout(callback, 450);
    timers.current.push(id);
  };

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
    },
    [],
  );

  const visibleProjects = useMemo(
    () => filterPrototypeProjects(projects, query, language),
    [projects, query, language],
  );

  const selectedProject = selectedId
    ? projects.find((project) => project.id === selectedId) ?? null
    : null;

  useEffect(() => {
    const host = shellHostRef.current;
    if (!host) return;

    if (selectedProject) {
      host.inert = true;
      host.setAttribute('aria-hidden', 'true');
    } else {
      host.inert = false;
      host.removeAttribute('aria-hidden');
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject || archiveOpen) return;

    const dialog = detailDialogRef.current;
    if (!dialog) return;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const firstFocusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector),
    ).find(
      (element) =>
        !element.hidden && element.getAttribute('aria-hidden') !== 'true',
    );

    (firstFocusable ?? dialog).focus();
  }, [selectedProject?.id, archiveOpen]);

  useEffect(() => {
    if (!selectedProject || archiveOpen) return;

    const dialog = detailDialogRef.current;
    if (!dialog) return;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusables = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) =>
          !element.hidden && element.getAttribute('aria-hidden') !== 'true',
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeProject();
        return;
      }

      if (event.key !== 'Tab') return;

      const elements = focusables();
      if (elements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = elements[0]!;
      const last = elements[elements.length - 1]!;
      const active = document.activeElement;
      const inside = active instanceof Node && dialog.contains(active);

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedProject?.id,
    archiveOpen,
    draftName,
    draftKey,
    draftStatus,
    savePhase,
  ]);

  const activeCount = projects.filter((project) => project.status === 'Active').length;
  const draftCount = projects.length - activeCount;

  const navItems: readonly SidebarItem[] = [
    {
      id: 'overview',
      label: copy.nav.overview,
      href: '#overview',
      icon: <NavIcon src={overviewIconUrl} />,
    },
    {
      id: 'projects',
      label: copy.nav.projects,
      href: '#projects',
      icon: <NavIcon src={projectsIconUrl} />,
    },
    {
      id: 'team',
      label: copy.nav.team,
      href: '#team',
      icon: <NavIcon src={teamIconUrl} />,
    },
    {
      id: 'settings',
      label: copy.nav.settings,
      href: '#settings',
      icon: <NavIcon src={settingsIconUrl} />,
    },
  ];

  const statusOptions = [
    {
      value: 'Draft',
      label: copy.draft,
      description:
        language === 'arabic'
          ? 'احتفظ بالمشروع كمسودة قبل بدء العمل النشط.'
          : 'Keep the project as a draft before active work starts.',
    },
    {
      value: 'Active',
      label: copy.active,
      description:
        language === 'arabic'
          ? 'اجعل المشروع متاحًا للعمل النشط الآن.'
          : 'Make the project available for active work now.',
    },
  ] as const;

  const openCreate = () => {
    setDirectoryFeedback(null);
    setCreateName('');
    setCreateKey('');
    setCreateStatus('Draft');
    setCreateNameValidation(null);
    setCreateKeyValidation(null);
    setCreatePhase('editing');
    setCreateFailedOnce(false);
    setCreateOpen(true);
  };

  const submitCreate = () => {
    const nameError = projectNameError(createName, language);
    const keyError = projectKeyError(createKey, projects, language);
    setCreateNameValidation(nameError);
    setCreateKeyValidation(keyError);
    if (nameError || keyError) return;

    setCreatePhase('submitting');

    schedule(() => {
      if (!createFailedOnce) {
        setCreateFailedOnce(true);
        setCreatePhase('failed');
        return;
      }

      const key = createKey.trim().toUpperCase();
      const nextProject: PrototypeProject = {
        id: key.toLowerCase(),
        name: createName.trim(),
        key,
        owner: owners.amal,
        status: createStatus,
      };

      setProjects((current) => [...current, nextProject]);
      setCreateOpen(false);
      setCreatePhase('editing');
      setDirectoryFeedback({
        title: copy.projectCreated,
        message: copy.createdMessage,
      });
    });
  };

  const openProject = (
    project: PrototypeProject,
    trigger?: HTMLElement | null,
  ) => {
    setDirectoryFeedback(null);
    lastProjectTrigger.current = trigger ?? null;
    setSelectedId(project.id);
    setDraftName(project.name);
    setDraftKey(project.key);
    setDraftStatus(project.status);
    setDraftNameValidation(null);
    setDraftKeyValidation(null);
    setSavePhase('idle');
    setSaveFailedOnce(false);
  };

  const closeProject = () => {
    setSelectedId(null);
    window.setTimeout(() => lastProjectTrigger.current?.focus(), 0);
  };

  const updateDraft = () => {
    if (!selectedProject) return;

    const nameError = projectNameError(draftName, language);
    const keyError = projectKeyError(
      draftKey,
      projects,
      language,
      selectedProject.id,
    );
    setDraftNameValidation(nameError);
    setDraftKeyValidation(keyError);
    if (nameError || keyError) return;

    setSavePhase('saving');

    schedule(() => {
      if (!saveFailedOnce) {
        setSaveFailedOnce(true);
        setSavePhase('failed');
        return;
      }

      const normalizedKey = draftKey.trim().toUpperCase();
      setProjects((current) =>
        current.map((project) =>
          project.id === selectedProject.id
            ? {
                ...project,
                name: draftName.trim(),
                key: normalizedKey,
                status: draftStatus,
              }
            : project,
        ),
      );
      setSavePhase('saved');
    });
  };

  const archiveProject = () => {
    if (!selectedProject) return;
    setProjects((current) =>
      current.filter((project) => project.id !== selectedProject.id),
    );
    setArchiveOpen(false);
    setSelectedId(null);
    setDirectoryFeedback({
      title: copy.projectArchived,
      message: copy.archivedMessage,
    });
  };

  const tableRows: readonly TableRowData[] = visibleProjects.map((project) => ({
    id: project.id,
    primary: <ProjectIdentity project={project} language={language} />,
    secondary: <OwnerIdentity owner={project.owner} language={language} />,
    status: <StatusBadge label={displayStatus(project.status, language)} />,
    action: (
      <Button
        emphasis="text"
        icon={<ProductIcon src={viewIconUrl} directional />}
        iconPosition="trailing"
        aria-label={
          language === 'arabic'
            ? `عرض تفاصيل ${displayProjectName(project, language)}`
            : `View ${project.name} details`
        }
        onClick={(event) => openProject(project, event.currentTarget)}
      >
        {copy.view}
      </Button>
    ),
    selected: selectedId === project.id,
  }));

  const footerText =
    language === 'arabic'
      ? visibleProjects.length === 1
        ? copy.shownSingle
        : `${visibleProjects.length} ${copy.shownPlural}`
      : visibleProjects.length === 1
        ? `1 ${copy.shownSingle}`
        : `${visibleProjects.length} ${copy.shownPlural}`;

  const directory = (
    <div className="dse-projects-prototype__directory">
      {directoryFeedback ? (
        <InlineFeedback
          intent="success"
          title={directoryFeedback.title}
          message={directoryFeedback.message}
        />
      ) : null}

      <div className="dse-product-prototype__toolbar">
        <div className="dse-product-prototype__search">
          <SearchField
            aria-label={copy.searchLabel}
            clearButtonLabel={copy.searchClear}
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setDirectoryFeedback(null);
            }}
            onClear={() => {
              setQuery('');
              setDirectoryFeedback(null);
            }}
          />
        </div>
        <span className="dse-product-prototype__count">
          {language === 'arabic'
            ? `${projects.length} ${copy.projects} · ${activeCount} ${copy.active} · ${draftCount} ${copy.draft}`
            : `${projects.length} projects · ${activeCount} active · ${draftCount} draft`}
        </span>
      </div>

      {visibleProjects.length > 0 ? (
        <div className="dse-product-prototype__table-scroll">
          <Table
            rows={tableRows}
            primaryLabel={copy.project}
            secondaryLabel={copy.owner}
            statusLabel={copy.status}
            actionLabel={copy.details}
            footerText={footerText}
          />
        </div>
      ) : (
        <EmptyState
          title={copy.noProjects}
          body={`${copy.noMatchPrefix} “${query}”.\n${copy.noMatchSuffix}`}
          actions={
            <Button emphasis="secondary" onClick={() => setQuery('')}>
              {copy.searchClear}
            </Button>
          }
        />
      )}
    </div>
  );

  const sidebar = (
    <Sidebar
      label={copy.nav.workspace}
      items={navItems}
      currentId="projects"
      footer={<WorkspaceFooter language={language} />}
    />
  );

  const topNavbar = (
    <TopNavbar
      brand={<Brand />}
      contextLabel={copy.context}
      account={<Account language={language} />}
    />
  );

  const pageHeading = (
    <PageHeading
      title={copy.pageTitle}
      description={copy.pageDescription}
      breadcrumbs={
        <Breadcrumbs
          ariaLabel={copy.breadcrumbLabel}
          ancestors={[
            {
              label: copy.breadcrumbAncestor,
              href: '#workspace',
            },
          ]}
          currentLabel={copy.breadcrumbCurrent}
        />
      }
      actions={
        <Button
          icon={<ProductIcon src={plusIconUrl} />}
          iconPosition="leading"
          onClick={openCreate}
        >
          {copy.createProject}
        </Button>
      }
    />
  );

  return (
    <div
      className="dse-product-prototype dse-projects-prototype"
      data-theme={theme}
      data-language={arabic ? 'ar' : 'en'}
      dir={arabic ? 'rtl' : 'ltr'}
      lang={arabic ? 'ar' : 'en'}
    >
      <div
        ref={shellHostRef}
        className="dse-product-prototype__shell-host"
      >
        <ApplicationShell
          viewportMode="expanded"
          sidebar={sidebar}
          topNavbar={topNavbar}
          pageHeading={pageHeading}
        >
          <div className="dse-projects-prototype__workspace">
            {directory}
          </div>
        </ApplicationShell>
      </div>

      {selectedProject ? (
        <div
          className="dse-product-prototype__detail-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProject();
          }}
        >
          <div
            ref={detailDialogRef}
            className="dse-product-prototype__detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={
              language === 'arabic'
                ? `تفاصيل المشروع ${displayProjectName(selectedProject, language)}`
                : `${selectedProject.name} project details`
            }
            tabIndex={-1}
          >
            <SidePanel
              eyebrow={copy.projectDetails}
              closeLabel={copy.closeProjectDetails}
              onClose={closeProject}
              className="dse-product-prototype__detail-panel"
              style={{
                blockSize: '100%',
                minBlockSize: '100%',
                maxBlockSize: '100%',
              }}
              header={
                <ProjectPanelHeader
                  project={selectedProject}
                  language={language}
                />
              }
              actions={
                <>
                  <Button
                    emphasis="secondary"
                    tone="critical"
                    onClick={() => setArchiveOpen(true)}
                  >
                    {copy.archiveProject}
                  </Button>
                  <Button
                    loading={savePhase === 'saving'}
                    loadingLabel={copy.saving}
                    onClick={updateDraft}
                  >
                    {savePhase === 'failed' ? copy.retrySave : copy.saveChanges}
                  </Button>
                </>
              }
            >
              <div className="dse-projects-prototype__owner-detail">
                <strong>{copy.owner}</strong>
                <OwnerIdentity
                  owner={selectedProject.owner}
                  language={language}
                />
              </div>

              <TextField
                label={copy.projectName}
                required
                value={draftName}
                invalid={draftNameValidation !== null}
                errorMessage={draftNameValidation ?? undefined}
                onChange={(event) => {
                  setDraftName(event.currentTarget.value);
                  setDraftNameValidation(null);
                  if (savePhase === 'saved') setSavePhase('idle');
                }}
              />

              <TextField
                label={copy.projectKey}
                required
                dir="ltr"
                value={draftKey}
                invalid={draftKeyValidation !== null}
                errorMessage={draftKeyValidation ?? undefined}
                supportingText={copy.projectKeyHelp}
                onChange={(event) => {
                  setDraftKey(event.currentTarget.value.toUpperCase());
                  setDraftKeyValidation(null);
                  if (savePhase === 'saved') setSavePhase('idle');
                }}
              />

              <RadioGroup
                label={copy.status}
                name={`project-status-${selectedProject.id}`}
                options={statusOptions}
                value={draftStatus}
                onValueChange={(value) => {
                  setDraftStatus(value as ProjectStatus);
                  if (savePhase === 'saved') setSavePhase('idle');
                }}
              />

              {savePhase === 'failed' ? (
                <InlineFeedback
                  intent="error"
                  title={copy.changesNotSaved}
                  message={copy.projectRetained}
                />
              ) : null}

              {savePhase === 'saved' ? (
                <InlineFeedback
                  intent="success"
                  title={copy.changesSaved}
                  message={
                    language === 'arabic'
                      ? `تم حفظ ${draftName.trim()} بالحالة ${displayStatus(draftStatus, language)}.`
                      : `${draftName.trim()} is saved as ${draftStatus}.`
                  }
                />
              ) : null}
            </SidePanel>
          </div>
        </div>
      ) : null}

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) setCreateOpen(false);
        }}
        title={copy.createTitle}
        description={copy.createDescription}
        actions={
          <>
            <Button
              emphasis="secondary"
              disabled={createPhase === 'submitting'}
              onClick={() => setCreateOpen(false)}
            >
              {copy.cancel}
            </Button>
            <Button
              loading={createPhase === 'submitting'}
              loadingLabel={
                createPhase === 'failed' ? copy.retrying : copy.creating
              }
              onClick={submitCreate}
            >
              {createPhase === 'failed' ? copy.retryCreate : copy.create}
            </Button>
          </>
        }
      >
        <TextField
          label={copy.projectName}
          required
          value={createName}
          invalid={createNameValidation !== null}
          errorMessage={createNameValidation ?? undefined}
          onChange={(event) => {
            setCreateName(event.currentTarget.value);
            setCreateNameValidation(null);
            if (createPhase === 'failed') setCreatePhase('editing');
          }}
        />

        <TextField
          label={copy.projectKey}
          required
          dir="ltr"
          value={createKey}
          invalid={createKeyValidation !== null}
          errorMessage={createKeyValidation ?? undefined}
          supportingText={copy.projectKeyHelp}
          onChange={(event) => {
            setCreateKey(event.currentTarget.value.toUpperCase());
            setCreateKeyValidation(null);
            if (createPhase === 'failed') setCreatePhase('editing');
          }}
        />

        <RadioGroup
          label={copy.startingStatus}
          name="create-project-status"
          options={statusOptions}
          value={createStatus}
          onValueChange={(value) => {
            setCreateStatus(value as ProjectStatus);
            if (createPhase === 'failed') setCreatePhase('editing');
          }}
        />

        {createPhase === 'failed' ? (
          <InlineFeedback
            intent="error"
            title={copy.projectNotCreated}
            message={copy.createRetained}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={copy.archiveTitle}
        description={copy.archiveDescription}
        actions={
          <>
            <Button emphasis="secondary" onClick={() => setArchiveOpen(false)}>
              {copy.cancel}
            </Button>
            <Button tone="critical" onClick={archiveProject}>
              {copy.archive}
            </Button>
          </>
        }
      >
        <p className="dse-projects-prototype__archive-copy">
          {copy.archiveBody}
        </p>
      </Dialog>
    </div>
  );
}
