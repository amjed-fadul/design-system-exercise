import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
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

type Role = 'Member' | 'Admin';
type MemberStatus = 'Active' | 'Invitation pending';
type RequestPhase = 'editing' | 'sending' | 'failed';
type SavePhase = 'idle' | 'saving' | 'failed' | 'saved';

export type PrototypeLanguage = 'english' | 'arabic';
export type PrototypeTheme = 'light' | 'dark';

export interface ConnectedProductPrototypeProps {
  language?: PrototypeLanguage;
  theme?: PrototypeTheme;
}

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
    pageTitle: 'Team members',
    pageDescription: 'Manage members and pending invitations in your workspace.',
    breadcrumbLabel: 'Breadcrumbs',
    breadcrumbAncestor: 'Workspace',
    breadcrumbCurrent: 'Team & access',
    inviteMember: 'Invite member',
    searchLabel: 'Search team members',
    searchClear: 'Clear search',
    searchPlaceholder: 'Search by name or email',
    people: 'people',
    active: 'active',
    invitationsPending: 'invitations pending',
    person: 'Person',
    role: 'Role',
    status: 'Status',
    details: 'Details',
    view: 'View',
    noPeople: 'No people found',
    noMatchPrefix: 'No names or email addresses match',
    noMatchSuffix: 'Try a different search or clear it to see everyone.',
    shownSingle: 'person shown',
    shownPlural: 'people shown',
    member: 'Member',
    admin: 'Admin',
    roleMemberDescription: 'Use the workspace without managing people.',
    roleAdminDescription: 'Invite people and manage members and roles.',
    pending: 'Invitation pending',
    notJoined: 'Has not joined yet',
    switchDark: 'Switch to dark mode',
    switchLight: 'Switch to light mode',
    memberDetails: 'MEMBER DETAILS',
    closeMemberDetails: 'Close member details',
    currentSavedRole: 'Current saved role',
    close: 'Close',
    saveChanges: 'Save changes',
    retrySave: 'Retry save',
    saving: 'Saving…',
    saveNote: 'Changes take effect only after you save.',
    changesNotSaved: 'Changes not saved',
    roleRetained: 'Your role selection is still here. Try again.',
    changesSaved: 'Changes saved',
    inviteTitle: 'Invite member',
    inviteDescription: 'Send an invitation and choose the member’s workspace role.',
    cancel: 'Cancel',
    sendInvitation: 'Send invitation',
    retryInvitation: 'Retry invitation',
    sending: 'Sending…',
    retrying: 'Retrying…',
    emailAddress: 'Email address',
    emailSupporting: 'One person per invitation.',
    emailRequired: 'Enter an email address.',
    emailInvalid: 'Enter a valid email address.',
    invitationNotSent: 'Invitation not sent',
    invitationRetained: 'Your entries are kept here; try again.',
    discardTitle: 'Discard unsaved changes?',
    discardDescription: 'Your saved role will stay unchanged.',
    discard: 'Discard',
    keepEditing: 'Keep editing',
    discardBody:
      'You have a role change that has not been saved. Keep editing to return to the member details, or discard it and return to the directory.',
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
    pageTitle: 'أعضاء الفريق',
    pageDescription: 'إدارة الأعضاء والدعوات المعلقة في مساحة العمل.',
    breadcrumbLabel: 'مسار الصفحة',
    breadcrumbAncestor: 'مساحة العمل',
    breadcrumbCurrent: 'الفريق والصلاحيات',
    inviteMember: 'دعوة عضو',
    searchLabel: 'البحث عن عضو',
    searchClear: 'مسح البحث',
    searchPlaceholder: 'ابحث بالاسم أو البريد الإلكتروني',
    people: 'أشخاص',
    active: 'نشطين',
    invitationsPending: 'دعوات معلقة',
    person: 'الشخص',
    role: 'الدور',
    status: 'الحالة',
    details: 'التفاصيل',
    view: 'عرض',
    noPeople: 'لم يتم العثور على أشخاص',
    noMatchPrefix: 'لا توجد أسماء أو عناوين بريد إلكتروني تطابق',
    noMatchSuffix: 'جرّب بحثًا مختلفًا أو امسحه لرؤية الجميع.',
    shownSingle: 'تم عرض شخص واحد',
    shownPlural: 'تم عرض أشخاص',
    member: 'عضو',
    admin: 'مشرف',
    roleMemberDescription: 'استخدم مساحة العمل دون إدارة الأشخاص.',
    roleAdminDescription: 'ادعُ الأشخاص وأدر الأعضاء والأدوار.',
    pending: 'الدعوة معلقة',
    notJoined: 'لم ينضم بعد',
    switchDark: 'التبديل إلى الوضع الداكن',
    switchLight: 'التبديل إلى الوضع الفاتح',
    memberDetails: 'تفاصيل العضو',
    closeMemberDetails: 'إغلاق تفاصيل العضو',
    currentSavedRole: 'الدور المحفوظ حاليًا',
    close: 'إغلاق',
    saveChanges: 'حفظ التغييرات',
    retrySave: 'إعادة محاولة الحفظ',
    saving: 'جارٍ الحفظ…',
    saveNote: 'لن تصبح التغييرات نافذة إلا بعد الحفظ.',
    changesNotSaved: 'لم تُحفظ التغييرات',
    roleRetained: 'اختيار الدور ما زال محفوظًا هنا. حاول مرة أخرى.',
    changesSaved: 'تم حفظ التغييرات',
    inviteTitle: 'دعوة عضو',
    inviteDescription: 'أرسل دعوة وحدد دور العضو في مساحة العمل.',
    cancel: 'إلغاء',
    sendInvitation: 'إرسال الدعوة',
    retryInvitation: 'إعادة محاولة إرسال الدعوة',
    sending: 'جارٍ الإرسال…',
    retrying: 'جارٍ إعادة المحاولة…',
    emailAddress: 'عنوان البريد الإلكتروني',
    emailSupporting: 'شخص واحد لكل دعوة.',
    emailRequired: 'أدخل عنوان بريد إلكتروني.',
    emailInvalid: 'أدخل عنوان بريد إلكتروني صالحًا.',
    invitationNotSent: 'لم تُرسل الدعوة',
    invitationRetained: 'تم الاحتفاظ بالبيانات؛ حاول مرة أخرى.',
    discardTitle: 'تجاهل التغييرات غير المحفوظة؟',
    discardDescription: 'سيبقى الدور المحفوظ دون تغيير.',
    discard: 'تجاهل',
    keepEditing: 'متابعة التعديل',
    discardBody:
      'لديك تغيير في الدور لم يتم حفظه. تابع التعديل للعودة إلى تفاصيل العضو، أو تجاهله والعودة إلى القائمة.',
  },
} as const;

const arabicMemberNames: Record<string, string> = {
  amal: 'أمل حسن (أنت)',
  sara: 'سارة أحمد',
  omar: 'عمر خالد',
  leila: 'ليلى إبراهيم',
  daniel: 'دانيال تشين',
  jamal: 'لم ينضم بعد',
  maya: 'لم ينضم بعد',
};

function displayMemberName(member: PrototypeMember, language: PrototypeLanguage) {
  if (language === 'english') return member.name;
  return arabicMemberNames[member.id] ?? (member.joined ? member.name : copyByLanguage.arabic.notJoined);
}

function displayRole(role: Role, language: PrototypeLanguage) {
  const copy = copyByLanguage[language];
  return role === 'Admin' ? copy.admin : copy.member;
}

function displayStatus(status: MemberStatus, language: PrototypeLanguage) {
  const copy = copyByLanguage[language];
  return status === 'Active' ? (language === 'arabic' ? 'نشط' : 'Active') : copy.pending;
}

export interface PrototypeMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  status: MemberStatus;
  joined: boolean;
}

export const prototypeInitialMembers: readonly PrototypeMember[] = [
  {
    id: 'amal',
    name: 'Amal Hassan (you)',
    email: 'amal@example.com',
    initials: 'AH',
    role: 'Admin',
    status: 'Active',
    joined: true,
  },
  {
    id: 'sara',
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    initials: 'SA',
    role: 'Member',
    status: 'Active',
    joined: true,
  },
  {
    id: 'omar',
    name: 'Omar Khalid',
    email: 'omar@example.com',
    initials: 'OK',
    role: 'Member',
    status: 'Active',
    joined: true,
  },
  {
    id: 'leila',
    name: 'Leila Ibrahim',
    email: 'leila@example.com',
    initials: 'LI',
    role: 'Member',
    status: 'Active',
    joined: true,
  },
  {
    id: 'daniel',
    name: 'Daniel Chen',
    email: 'daniel@example.com',
    initials: 'DC',
    role: 'Member',
    status: 'Active',
    joined: true,
  },
  {
    id: 'jamal',
    name: 'Has not joined yet',
    email: 'jamal@example.com',
    initials: '@',
    role: 'Member',
    status: 'Invitation pending',
    joined: false,
  },
  {
    id: 'maya',
    name: 'Has not joined yet',
    email: 'maya@example.com',
    initials: '@',
    role: 'Member',
    status: 'Invitation pending',
    joined: false,
  },
];

export function filterPrototypeMembers(
  members: readonly PrototypeMember[],
  query: string,
  language: PrototypeLanguage = 'english',
): readonly PrototypeMember[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return members;

  return members.filter((member) =>
    `${member.name} ${displayMemberName(member, language)} ${member.email}`
      .toLowerCase()
      .includes(normalized),
  );
}

export function inviteEmailError(
  email: string,
  language: PrototypeLanguage = 'english',
): string | null {
  const normalized = email.trim();
  const copy = copyByLanguage[language];
  if (!normalized) return copy.emailRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return copy.emailInvalid;
  }
  return null;
}

const overviewIconUrl = new URL('./assets/sidebar-overview.svg', import.meta.url).href;
const projectsIconUrl = new URL('./assets/sidebar-projects.svg', import.meta.url).href;
const teamIconUrl = new URL('./assets/sidebar-team.svg', import.meta.url).href;
const settingsIconUrl = new URL('./assets/sidebar-settings.svg', import.meta.url).href;

function PrototypeNavIcon({ src }: { src: string }) {
  return (
    <span
      className="dse-product-prototype__nav-glyph"
      aria-hidden="true"
      style={{ '--dse-prototype-nav-image': `url("${src}")` } as CSSProperties}
    />
  );
}

const moonIconUrl = new URL('../components/assets/top-navbar-moon.svg', import.meta.url).href;
const inviteIconUrl = new URL('./assets/invite-plus.svg', import.meta.url).href;
const viewIconUrl = new URL('./assets/view-chevron.svg', import.meta.url).href;

function PrototypeButtonIcon({ src }: { src: string }) {
  return (
    <span
      className="dse-product-prototype__button-icon"
      aria-hidden="true"
      style={{ '--dse-prototype-button-image': `url("${src}")` } as CSSProperties}
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

function PersonIdentity({
  member,
  language,
}: {
  member: PrototypeMember;
  language: PrototypeLanguage;
}) {
  return (
    <div className="dse-product-prototype__identity">
      <Avatar initials={member.initials} />
      <div className="dse-product-prototype__identity-copy">
        <strong>{displayMemberName(member, language)}</strong>
        <span dir="ltr">{member.email}</span>
      </div>
    </div>
  );
}

function PanelIdentity({
  member,
  language,
}: {
  member: PrototypeMember;
  language: PrototypeLanguage;
}) {
  return (
    <div className="dse-product-prototype__panel-member-identity">
      <Avatar initials={member.initials} size="lg" />
      <div className="dse-product-prototype__panel-member-copy">
        <strong>{displayMemberName(member, language)}</strong>
        <span dir="ltr">{member.email}</span>
      </div>
    </div>
  );
}

function WorkspaceFooter({ language }: { language: PrototypeLanguage }) {
  const copy = copyByLanguage[language];
  return (
    <div className="dse-product-prototype__workspace-footer">
      <strong>{copy.workspaceName}</strong>
      <span>{copy.signedIn}</span>
    </div>
  );
}

export function ConnectedProductPrototype({
  language = 'english',
  theme = 'light',
}: ConnectedProductPrototypeProps) {
  const copy = copyByLanguage[language];
  const arabic = language === 'arabic';

  const navItems: readonly SidebarItem[] = [
    { id: 'overview', label: copy.nav.overview, href: '#overview', icon: <PrototypeNavIcon src={overviewIconUrl} /> },
    { id: 'projects', label: copy.nav.projects, href: '#projects', icon: <PrototypeNavIcon src={projectsIconUrl} /> },
    { id: 'team', label: copy.nav.team, href: '#team', icon: <PrototypeNavIcon src={teamIconUrl} /> },
    { id: 'settings', label: copy.nav.settings, href: '#settings', icon: <PrototypeNavIcon src={settingsIconUrl} /> },
  ];

  const roleOptions = [
    {
      value: 'Member',
      label: copy.member,
      description: copy.roleMemberDescription,
    },
    {
      value: 'Admin',
      label: copy.admin,
      description: copy.roleAdminDescription,
    },
  ] as const;
  const [members, setMembers] = useState<readonly PrototypeMember[]>(prototypeInitialMembers);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.dataset.theme;
    const previousLanguage = root.dataset.language;
    const previousDir = root.dir;
    const previousLang = root.lang;

    root.dataset.theme = theme;
    root.dataset.language = arabic ? 'ar' : 'en';
    root.dir = arabic ? 'rtl' : 'ltr';
    root.lang = arabic ? 'ar' : 'en';

    return () => {
      if (previousTheme === undefined) delete root.dataset.theme;
      else root.dataset.theme = previousTheme;

      if (previousLanguage === undefined) delete root.dataset.language;
      else root.dataset.language = previousLanguage;

      root.dir = previousDir;
      root.lang = previousLang;
    };
  }, [theme, arabic]);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Member');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [invitePhase, setInvitePhase] = useState<RequestPhase>('editing');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<Role>('Member');
  const [savePhase, setSavePhase] = useState<SavePhase>('idle');
  const [discardOpen, setDiscardOpen] = useState(false);

  const timers = useRef<number[]>([]);
  const lastRoleTrigger = useRef<HTMLElement | null>(null);
  const detailDialogRef = useRef<HTMLDivElement>(null);
  const shellHostRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
    },
    [],
  );

  const visibleMembers = useMemo(
    () => filterPrototypeMembers(members, query, language),
    [members, query, language],
  );

  const selectedMember = selectedId
    ? (members.find((member) => member.id === selectedId) ?? null)
    : null;

  useEffect(() => {
    const host = shellHostRef.current;
    if (!host) return;

    if (selectedMember) {
      host.inert = true;
      host.setAttribute('aria-hidden', 'true');
    } else {
      host.inert = false;
      host.removeAttribute('aria-hidden');
    }
  }, [selectedMember]);

  useEffect(() => {
    if (!selectedMember || discardOpen) return;

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
      (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true',
    );

    (firstFocusable ?? dialog).focus();
  }, [selectedMember?.id, discardOpen]);

  useEffect(() => {
    if (!selectedMember || discardOpen) return;

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
        (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true',
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestRoleClose();
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
    selectedMember?.id,
    selectedMember?.role,
    discardOpen,
    draftRole,
    savePhase,
  ]);

  const activeCount = members.filter((member) => member.status === 'Active').length;
  const pendingCount = members.length - activeCount;

  const openInvite = () => {
    setInviteEmail('');
    setInviteRole('Member');
    setInviteError(null);
    setInvitePhase('editing');
    setInviteOpen(true);
  };

  const closeInvite = () => {
    if (invitePhase === 'sending') return;
    setInviteOpen(false);
  };

  const submitInvite = () => {
    if (invitePhase === 'sending') return;

    const validationMessage = inviteEmailError(inviteEmail, language);
    if (validationMessage) {
      setInviteError(validationMessage);
      return;
    }

    setInviteError(null);
    const retrying = invitePhase === 'failed';
    setInvitePhase('sending');

    const timer = window.setTimeout(
      () => {
        if (!retrying) {
          setInvitePhase('failed');
          return;
        }

        const normalizedEmail = inviteEmail.trim().toLowerCase();
        const id = `invite-${normalizedEmail.replace(/[^a-z0-9]+/g, '-')}`;
        setMembers((current) => [
          ...current.filter((member) => member.email.toLowerCase() !== normalizedEmail),
          {
            id,
            name: 'Has not joined yet',
            email: normalizedEmail,
            initials: '@',
            role: inviteRole,
            status: 'Invitation pending',
            joined: false,
          },
        ]);
        setInviteOpen(false);
        setInvitePhase('editing');
      },
      retrying ? 1000 : 1200,
    );
    timers.current.push(timer);
  };

  const openMember = (member: PrototypeMember, trigger: HTMLElement | null) => {
    if (member.id !== 'sara' && member.id !== 'omar') return;
    lastRoleTrigger.current = trigger;
    setSelectedId(member.id);
    setDraftRole(member.role);
    setSavePhase('idle');
    setDiscardOpen(false);
  };

  const closeRoleCleanly = () => {
    setSelectedId(null);
    setDiscardOpen(false);
    setSavePhase('idle');
    window.setTimeout(() => lastRoleTrigger.current?.focus(), 0);
  };

  const requestRoleClose = () => {
    if (!selectedMember) return;
    const dirty = draftRole !== selectedMember.role || savePhase === 'failed';
    if (dirty) {
      setDiscardOpen(true);
      return;
    }
    closeRoleCleanly();
  };

  const discardRoleChanges = () => {
    if (selectedMember) setDraftRole(selectedMember.role);
    closeRoleCleanly();
  };

  const saveRole = () => {
    if (!selectedMember || savePhase === 'saving') return;

    const retrying = savePhase === 'failed';
    setSavePhase('saving');

    const timer = window.setTimeout(
      () => {
        if (!retrying) {
          setSavePhase('failed');
          return;
        }

        setMembers((current) =>
          current.map((member) =>
            member.id === selectedMember.id ? { ...member, role: draftRole } : member,
          ),
        );
        setSavePhase('saved');
      },
      retrying ? 1000 : 1200,
    );
    timers.current.push(timer);
  };

  const rows: readonly TableRowData[] = visibleMembers.map((member) => ({
    id: member.id,
    primary: <PersonIdentity member={member} language={language} />,
    secondary: (
      <span className="dse-product-prototype__cell-text">
        {displayRole(member.role, language)}
      </span>
    ),
    status: <StatusBadge label={displayStatus(member.status, language)} />,
    selected: member.id === selectedId,
    action:
      member.joined && member.id !== 'amal' ? (
        <Button
          emphasis="text"
          icon={<PrototypeButtonIcon src={viewIconUrl} />}
          iconPosition="trailing"
          aria-label={
            arabic
              ? `عرض تفاصيل ${displayMemberName(member, language)}`
              : `View ${member.name} details`
          }
          onClick={
            member.id === 'sara' || member.id === 'omar'
              ? (event) => openMember(member, event.currentTarget)
              : undefined
          }
        >
          {copy.view}
        </Button>
      ) : (
        <span className="dse-product-prototype__dash" aria-hidden="true">
          —
        </span>
      ),
  }));

  const account = (
    <div className="dse-product-prototype__account">
      <span
        aria-hidden="true"
        style={{
          display: 'grid',
          placeItems: 'center',
          inlineSize: 40,
          blockSize: 40,
        }}
      >
        <span
          className="dse-product-prototype__moon-icon"
          style={{ '--dse-prototype-moon-image': `url("${moonIconUrl}")` } as React.CSSProperties}
        />
      </span>
      <div className="dse-product-prototype__account-identity">
        <span>{copy.account}</span>
        <Avatar initials={arabic ? 'أح' : 'AH'} />
      </div>
    </div>
  );

  const directory = (
    <div className="dse-product-prototype__directory">
      <div className="dse-product-prototype__toolbar">
        <div className="dse-product-prototype__search">
          <SearchField
            aria-label={copy.searchLabel}
            clearButtonLabel={copy.searchClear}
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value)}
            onClear={() => setQuery('')}
          />
        </div>
        <span className="dse-product-prototype__count">
          {arabic
            ? `${members.length} ${copy.people} · ${activeCount} ${copy.active} · ${pendingCount} ${copy.invitationsPending}`
            : `${members.length} ${copy.people} · ${activeCount} ${copy.active} · ${pendingCount} ${copy.invitationsPending}`}
        </span>
      </div>

      {visibleMembers.length > 0 ? (
        <div className="dse-product-prototype__table-scroll">
          <Table
            rows={rows}
            primaryLabel={copy.person}
            secondaryLabel={copy.role}
            statusLabel={copy.status}
            actionLabel={copy.details}
            footerText={
              arabic
                ? visibleMembers.length === 1
                  ? copy.shownSingle
                  : `تم عرض ${visibleMembers.length} أشخاص`
                : `${visibleMembers.length} ${visibleMembers.length === 1 ? copy.shownSingle : copy.shownPlural}`
            }
          />
        </div>
      ) : (
        <EmptyState
          title={copy.noPeople}
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

  const pageHeading = (
    <PageHeading
      title={copy.pageTitle}
      description={copy.pageDescription}
      breadcrumbs={
        <Breadcrumbs
          ariaLabel={copy.breadcrumbLabel}
          ancestors={[{ label: copy.breadcrumbAncestor, href: '#workspace' }]}
          currentLabel={copy.breadcrumbCurrent}
        />
      }
      actions={
        <Button
          icon={<PrototypeButtonIcon src={inviteIconUrl} />}
          iconPosition="leading"
          onClick={openInvite}
        >
          {copy.inviteMember}
        </Button>
      }
    />
  );

  return (
    <div
      className="dse-product-prototype"
      data-theme={theme}
      data-language={arabic ? 'ar' : 'en'}
      data-figma-source="199:10635"
      dir={arabic ? 'rtl' : 'ltr'}
      lang={arabic ? 'ar' : 'en'}
    >
      <div ref={shellHostRef} className="dse-product-prototype__shell-host">
        <ApplicationShell
          viewportMode="expanded"
          sidebar={
            <Sidebar
              label={copy.nav.workspace}
              items={navItems}
              currentId="team"
              footer={<WorkspaceFooter language={language} />}
            />
          }
          topNavbar={
            <TopNavbar
              brand={<Brand />}
              contextLabel={copy.context}
              account={account}
            />
          }
          pageHeading={pageHeading}
        >
          {directory}
        </ApplicationShell>
      </div>

      {selectedMember ? (
        <div
          className="dse-product-prototype__detail-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) requestRoleClose();
          }}
        >
          <div
            ref={detailDialogRef}
            className="dse-product-prototype__detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={
              arabic
                ? `تفاصيل العضو ${displayMemberName(selectedMember, language)}`
                : `${selectedMember.name} member details`
            }
            tabIndex={-1}
          >
            <SidePanel
              eyebrow={copy.memberDetails}
              closeLabel={copy.closeMemberDetails}
              onClose={requestRoleClose}
              className="dse-product-prototype__detail-panel"
              style={{ blockSize: '100%', minBlockSize: '100%', maxBlockSize: '100%' }}
              header={<PanelIdentity member={selectedMember} language={language} />}
              actions={
                <>
                  <Button emphasis="secondary" onClick={requestRoleClose}>
                    {copy.close}
                  </Button>
                  <Button
                    disabled={
                      savePhase !== 'failed' &&
                      savePhase !== 'saving' &&
                      draftRole === selectedMember.role
                    }
                    loading={savePhase === 'saving'}
                    loadingLabel={copy.saving}
                    onClick={saveRole}
                  >
                    {savePhase === 'failed' ? copy.retrySave : copy.saveChanges}
                  </Button>
                </>
              }
            >
              <div className="dse-product-prototype__detail-row">
                <strong>{copy.status}</strong>
                <StatusBadge label={displayStatus(selectedMember.status, language)} />
              </div>

              <div className="dse-product-prototype__detail-row">
                <strong>{copy.currentSavedRole}</strong>
                <span>{displayRole(selectedMember.role, language)}</span>
              </div>

              <RadioGroup
                label={copy.role}
                name={`role-${selectedMember.id}`}
                options={roleOptions}
                value={draftRole}
                onValueChange={(value) => {
                  setDraftRole(value as Role);
                  if (savePhase === 'saved') setSavePhase('idle');
                }}
              />

              <p className="dse-product-prototype__save-note">
                {copy.saveNote}
              </p>

              {savePhase === 'failed' ? (
                <InlineFeedback
                  intent="error"
                  title={copy.changesNotSaved}
                  message={copy.roleRetained}
                />
              ) : null}

              {savePhase === 'saved' ? (
                <InlineFeedback
                  intent="success"
                  title={copy.changesSaved}
                  message={
                    arabic
                      ? `${displayMemberName(selectedMember, language)} أصبح الآن ${displayRole(draftRole, language)}.`
                      : `${selectedMember.name} is now ${draftRole}.`
                  }
                />
              ) : null}
            </SidePanel>
          </div>
        </div>
      ) : null}

      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          if (!open) closeInvite();
        }}
        title={copy.inviteTitle}
        description={copy.inviteDescription}
        actions={
          <>
            <Button emphasis="secondary" onClick={closeInvite} disabled={invitePhase === 'sending'}>
              {copy.cancel}
            </Button>
            <Button
              loading={invitePhase === 'sending'}
              loadingLabel={invitePhase === 'failed' ? copy.retrying : copy.sending}
              onClick={submitInvite}
            >
              {invitePhase === 'failed' ? copy.retryInvitation : copy.sendInvitation}
            </Button>
          </>
        }
      >
        <TextField
          label={copy.emailAddress}
          type="email"
          required
          value={inviteEmail}
          invalid={inviteError !== null}
          errorMessage={inviteError ?? undefined}
          supportingText={copy.emailSupporting}
          onChange={(event) => {
            setInviteEmail(event.currentTarget.value);
            if (inviteError) setInviteError(null);
            if (invitePhase === 'failed') setInvitePhase('editing');
          }}
        />

        <RadioGroup
          label={copy.role}
          name="invite-role"
          options={roleOptions}
          value={inviteRole}
          onValueChange={(value) => {
            setInviteRole(value as Role);
            if (invitePhase === 'failed') setInvitePhase('editing');
          }}
        />

        {invitePhase === 'failed' ? (
          <InlineFeedback
            intent="error"
            title={copy.invitationNotSent}
            message={copy.invitationRetained}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={discardOpen}
        onOpenChange={(open) => {
          if (!open) setDiscardOpen(false);
        }}
        title={copy.discardTitle}
        description={copy.discardDescription}
        actions={
          <>
            <Button emphasis="secondary" onClick={discardRoleChanges}>
              {copy.discard}
            </Button>
            <Button onClick={() => setDiscardOpen(false)}>{copy.keepEditing}</Button>
          </>
        }
      >
        <p className="dse-product-prototype__guard-copy">
          {copy.discardBody}
        </p>
      </Dialog>
    </div>
  );
}
