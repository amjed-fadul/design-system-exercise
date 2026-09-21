import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import '@design-system-exercise/tokens/css';
import '@design-system-exercise/react/styles.css';
import '@design-system-exercise/patterns/styles.css';
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
} from '@design-system-exercise/react';
import { ApplicationShell } from '@design-system-exercise/patterns';
import './TeamEvaluation.css';

type Role = 'Member' | 'Admin';
type Locale = 'en' | 'ar';
type Theme = 'light' | 'dark';
type ViewportMode = 'expanded' | 'compact';
type MemberState = 'active' | 'invited';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  state: MemberState;
};

type TeamEvaluationProps = {
  locale?: Locale;
  theme?: Theme;
  viewportMode?: ViewportMode;
  initialDetailId?: string;
  initialDirty?: boolean;
  showMemberActions?: boolean;
  simulateInviteFailure?: boolean;
  simulateSaveFailure?: boolean;
};

const initialMembers: TeamMember[] = [
  { id: 'amal-hassan', name: 'Amal Hassan (you)', email: 'amal@example.com', initials: 'AH', role: 'Admin', state: 'active' },
  { id: 'sara-ahmed', name: 'Sara Ahmed', email: 'sara@example.com', initials: 'SA', role: 'Member', state: 'active' },
  { id: 'omar-khalid', name: 'Omar Khalid', email: 'omar@example.com', initials: 'OK', role: 'Member', state: 'active' },
  { id: 'leila-ibrahim', name: 'Leila Ibrahim', email: 'leila@example.com', initials: 'LI', role: 'Member', state: 'active' },
  { id: 'daniel-chen', name: 'Daniel Chen', email: 'daniel@example.com', initials: 'DC', role: 'Member', state: 'active' },
  { id: 'jamal-invitation', name: 'Has not joined yet', email: 'jamal@example.com', initials: '@', role: 'Member', state: 'invited' },
  { id: 'maya-invitation', name: 'Has not joined yet', email: 'maya@example.com', initials: '@', role: 'Member', state: 'invited' },
];

const copy = {
  en: {
    workspace: 'Workspace',
    navLabel: 'WORKSPACE',
    overview: 'Overview',
    projects: 'Projects',
    team: 'Team & access',
    settings: 'Settings',
    footerPrimary: 'Northstar workspace',
    footerSecondary: 'Signed in as Admin',
    context: 'Workspace administration',
    account: 'Amal Hassan · Admin',
    accountInitials: 'AH',
    breadcrumbs: 'Breadcrumbs',
    title: 'Team members',
    description: 'Manage members and pending invitations in your workspace.',
    invite: 'Invite member',
    searchLabel: 'Search team members and invitations',
    searchPlaceholder: 'Search by name or email',
    clearSearch: 'Clear search',
    visibleCounts: (active: number, invited: number) => `${active} active · ${invited} invited`,
    tableFooter: (count: number) => `Showing ${count} ${count === 1 ? 'person' : 'people'}`,
    person: 'Person',
    role: 'Role',
    status: 'Status',
    details: 'Details',
    view: 'View',
    active: 'Active',
    invitationPending: 'Invitation pending',
    emptyTitle: 'No people found',
    emptyBody: (query: string) => `No names or email addresses match “${query}”. Try a different search or clear it to see everyone.`,
    clearFilters: 'Clear search',
    memberDetails: 'MEMBER DETAILS',
    memberDetailsFor: (name: string) => `Member details for ${name}`,
    currentSavedRole: 'Current saved role',
    roleDescriptionMember: 'Use the workspace without managing people.',
    roleDescriptionAdmin: 'Invite people and manage members and roles.',
    roleNote: 'Changes take effect only after you save.',
    close: 'Close',
    saveChanges: 'Save changes',
    keepEditing: 'Keep editing',
    discardChanges: 'Discard changes',
    discardTitle: 'Discard unsaved changes?',
    discardDescription: 'Your role change has not been saved. Choose whether to keep editing or discard it.',
    saveFailure: 'The role could not be saved. Your draft is unchanged. Try saving again.',
    saveSuccess: 'Role changes saved.',
    inviteTitle: 'Invite a member',
    inviteDescription: 'Enter an email address and choose a workspace role.',
    email: 'Email address',
    emailRequired: 'Enter an email address.',
    emailInvalid: 'Enter a valid email address.',
    inviteFailure: 'The invitation could not be sent. Your email and role are unchanged. You can retry.',
    inviteSuccess: (email: string) => `Invitation sent to ${email}.`,
    cancel: 'Cancel',
    sendInvitation: 'Send invitation',
    closeDialog: 'Close dialog',
    inviteRole: 'Workspace role',
    compactDetailNote: 'Evaluation note: member detail behavior on the compact shell is unresolved by the approved guidance.',
  },
  ar: {
    workspace: 'مساحة العمل',
    navLabel: 'مساحة العمل',
    overview: 'نظرة عامة',
    projects: 'المشاريع',
    team: 'الفريق والصلاحيات',
    settings: 'الإعدادات',
    footerPrimary: 'مساحة نورث ستار',
    footerSecondary: 'تم تسجيل الدخول كمشرفة',
    context: 'إدارة مساحة العمل',
    account: 'أمل حسن · مشرفة',
    accountInitials: 'أح',
    breadcrumbs: 'مسار التنقل',
    title: 'أعضاء الفريق',
    description: 'إدارة الأعضاء والدعوات المعلّقة في مساحة العمل.',
    invite: 'دعوة عضو',
    searchLabel: 'البحث عن أعضاء الفريق والدعوات',
    searchPlaceholder: 'البحث بالاسم أو البريد الإلكتروني',
    clearSearch: 'مسح البحث',
    visibleCounts: (active: number, invited: number) => `${active} نشط · ${invited} دعوة معلّقة`,
    tableFooter: (count: number) => `عرض ${count} ${count === 1 ? 'شخص' : 'أشخاص'}`,
    person: 'الشخص',
    role: 'الدور',
    status: 'الحالة',
    details: 'التفاصيل',
    view: 'عرض',
    active: 'نشط',
    invitationPending: 'الدعوة معلّقة',
    emptyTitle: 'لم يتم العثور على أشخاص',
    emptyBody: (query: string) => `لا توجد أسماء أو عناوين بريد إلكتروني تطابق «${query}». جرّب بحثاً آخر أو امسح البحث لعرض الجميع.`,
    clearFilters: 'مسح البحث',
    memberDetails: 'تفاصيل العضو',
    memberDetailsFor: (name: string) => `تفاصيل العضو: ${name}`,
    currentSavedRole: 'الدور المحفوظ حالياً',
    roleDescriptionMember: 'Use the workspace without managing people.',
    roleDescriptionAdmin: 'Invite people and manage members and roles.',
    roleNote: 'لن تُطبّق التغييرات إلا بعد حفظها.',
    close: 'إغلاق',
    saveChanges: 'حفظ التغييرات',
    keepEditing: 'متابعة التعديل',
    discardChanges: 'تجاهل التغييرات',
    discardTitle: 'تجاهل التغييرات غير المحفوظة؟',
    discardDescription: 'لم يتم حفظ تغيير الدور. اختر متابعة التعديل أو تجاهل التغيير.',
    saveFailure: 'تعذّر حفظ الدور. لم يتغير المسودّة. حاول الحفظ مجدداً.',
    saveSuccess: 'تم حفظ تغييرات الدور.',
    inviteTitle: 'دعوة عضو',
    inviteDescription: 'أدخل عنوان البريد الإلكتروني واختر دوراً في مساحة العمل.',
    email: 'عنوان البريد الإلكتروني',
    emailRequired: 'أدخل عنوان البريد الإلكتروني.',
    emailInvalid: 'أدخل عنوان بريد إلكتروني صالحاً.',
    inviteFailure: 'تعذّر إرسال الدعوة. لم يتغير البريد الإلكتروني أو الدور. يمكنك إعادة المحاولة.',
    inviteSuccess: (email: string) => `تم إرسال الدعوة إلى ${email}.`,
    cancel: 'إلغاء',
    sendInvitation: 'إرسال الدعوة',
    closeDialog: 'إغلاق الحوار',
    inviteRole: 'دور مساحة العمل',
    compactDetailNote: 'ملاحظة تقييم: إرشادات السلوك التفصيلي للأعضاء في الشريط المضغوط غير محسومة.',
  },
} as const;

function roleOptions(strings: (typeof copy)[Locale]) {
  return [
    { value: 'Member', label: 'Member', description: strings.roleDescriptionMember },
    { value: 'Admin', label: 'Admin', description: strings.roleDescriptionAdmin },
  ] as const;
}

function Icon({ name }: { name: 'overview' | 'projects' | 'team' | 'settings' | 'appearance' }) {
  return <span aria-hidden="true" className={`team-eval-icon team-eval-icon--${name}`} />;
}

export function TeamEvaluation({
  locale = 'en',
  theme = 'light',
  viewportMode = 'expanded',
  initialDetailId,
  initialDirty = false,
  showMemberActions = true,
  simulateInviteFailure = false,
  simulateSaveFailure = false,
}: TeamEvaluationProps) {
  const strings = copy[locale];
  const isArabic = locale === 'ar';
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState('');
  const [detailId, setDetailId] = useState<string | null>(initialDetailId ?? null);
  const initialMember = initialMembers.find((member) => member.id === initialDetailId);
  const [roleDraft, setRoleDraft] = useState<Role>(() =>
    initialDirty && initialMember?.role === 'Member' ? 'Admin' : initialMember?.role ?? 'Member',
  );
  const [saveFeedback, setSaveFeedback] = useState<'error' | 'success' | null>(null);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Member');
  const [inviteAttempted, setInviteAttempted] = useState(false);
  const [inviteTouched, setInviteTouched] = useState(false);
  const [inviteFailure, setInviteFailure] = useState(false);
  const [inviteSuccessEmail, setInviteSuccessEmail] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const modalHostRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const restoreOnCloseRef = useRef(false);
  const nextInviteIdRef = useRef(0);
  const selectedMember = members.find((member) => member.id === detailId) ?? null;
  const savedRole = selectedMember?.role ?? 'Member';
  const isRoleDirty = Boolean(selectedMember && roleDraft !== savedRole);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim());
  const showEmailError = inviteAttempted || inviteTouched;
  const emailError = inviteEmail.trim().length === 0
    ? strings.emailRequired
    : strings.emailInvalid;

  const filteredMembers = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return members;
    return members.filter((member) =>
      `${member.name} ${member.email}`.toLocaleLowerCase().includes(search),
    );
  }, [members, query]);

  const activeCount = filteredMembers.filter((member) => member.state === 'active').length;
  const invitedCount = filteredMembers.filter((member) => member.state === 'invited').length;
  const isCompact = viewportMode === 'compact';
  const canOpenMemberDetails = !isCompact && showMemberActions;
  const shellItems = [
    { id: 'overview', label: strings.overview, href: '#overview', icon: <Icon name="overview" /> },
    { id: 'projects', label: strings.projects, href: '#projects', icon: <Icon name="projects" /> },
    { id: 'team', label: strings.team, href: '#team-and-access', icon: <Icon name="team" /> },
    { id: 'settings', label: strings.settings, href: '#settings', icon: <Icon name="settings" /> },
  ];

  function openMember(member: TeamMember, trigger: HTMLButtonElement) {
    if (!canOpenMemberDetails) return;
    returnFocusRef.current = trigger;
    restoreOnCloseRef.current = false;
    setRoleDraft(member.role);
    setSaveFeedback(null);
    setDetailId(member.id);
  }

  function closeMemberDetail() {
    if (isRoleDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    restoreOnCloseRef.current = true;
    setDetailId(null);
  }

  function discardRoleDraft() {
    setDiscardDialogOpen(false);
    restoreOnCloseRef.current = true;
    setDetailId(null);
  }

  function handleRoleSave() {
    if (!selectedMember || !isRoleDirty) return;
    if (simulateSaveFailure) {
      setSaveFeedback('error');
      return;
    }
    setMembers((current) => current.map((member) =>
      member.id === selectedMember.id ? { ...member, role: roleDraft } : member,
    ));
    setSaveFeedback('success');
  }

  function closeInviteDialog() {
    setInviteDialogOpen(false);
    setInviteAttempted(false);
    setInviteTouched(false);
    setInviteFailure(false);
  }

  function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInviteAttempted(true);
    if (!emailIsValid) return;
    if (simulateInviteFailure) {
      setInviteFailure(true);
      return;
    }
    const email = inviteEmail.trim();
    nextInviteIdRef.current += 1;
    setMembers((current) => [
      ...current,
      {
        id: `invitation-${nextInviteIdRef.current}`,
        name: 'Has not joined yet',
        email,
        initials: '@',
        role: inviteRole,
        state: 'invited',
      },
    ]);
    setInviteSuccessEmail(email);
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteRole('Member');
    setInviteAttempted(false);
    setInviteTouched(false);
    setInviteFailure(false);
  }

  useEffect(() => {
    if (!detailId) {
      if (restoreOnCloseRef.current) {
        returnFocusRef.current?.focus();
        restoreOnCloseRef.current = false;
      }
      return;
    }

    const app = appRef.current;
    if (app) {
      app.inert = true;
      app.setAttribute('aria-hidden', 'true');
    }

    const host = modalHostRef.current;
    const focusTarget = host?.querySelector<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusTarget?.focus();

    return () => {
      if (app) {
        app.inert = false;
        app.removeAttribute('aria-hidden');
      }
    };
  }, [detailId]);

  useEffect(() => {
    if (!detailId || discardDialogOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (!modalHostRef.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMemberDetail();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(modalHostRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute('hidden'));
      if (focusable.length === 0) {
        event.preventDefault();
        modalHostRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [detailId, discardDialogOpen, isRoleDirty]);

  const topNavbarBrand = (
    <div className="team-eval-brand">
      <span aria-hidden="true" className="team-eval-brand-mark">N</span>
      <span className="team-eval-brand-name" dir="ltr">Northstar</span>
    </div>
  );
  const account = (
    <div className="team-eval-account">
      <span aria-hidden="true" className="team-eval-appearance"><Icon name="appearance" /></span>
      <div className="team-eval-account-identity">
        <span className="team-eval-account-label">{strings.account}</span>
        <Avatar initials={strings.accountInitials} />
      </div>
    </div>
  );
  const pageHeading = (
    <PageHeading
      title={strings.title}
      description={strings.description}
      breadcrumbs={(
        <Breadcrumbs
          ancestors={[{ label: strings.workspace, href: '#workspace' }]}
          currentLabel={strings.team}
          ariaLabel={strings.breadcrumbs}
        />
      )}
      actions={<Button onClick={() => { setInviteDialogOpen(true); setInviteSuccessEmail(null); }}>{strings.invite}</Button>}
    />
  );

  const tableRows = filteredMembers.map((member) => ({
    id: member.id,
    primary: (
      <div className="team-eval-person">
        <Avatar initials={member.initials} />
        <div className="team-eval-person-copy">
          <span className="team-eval-person-name" dir="ltr">{member.name}</span>
          <span className="team-eval-person-email" dir="ltr">{member.email}</span>
        </div>
      </div>
    ),
    secondary: <span>{member.role}</span>,
    status: <StatusBadge label={member.state === 'active' ? strings.active : strings.invitationPending} />,
    action: member.state === 'active' && canOpenMemberDetails
      ? (
        <Button
          emphasis="text"
          aria-label={`${strings.view} ${strings.memberDetails.toLocaleLowerCase()} ${member.name}`}
          onClick={(event) => openMember(member, event.currentTarget)}
        >
          {strings.view}
        </Button>
      )
      : <span aria-hidden="true">—</span>,
    selected: member.id === detailId,
  }));

  return (
    <div
      className="team-eval-root"
      data-theme={theme}
      data-language={locale}
      data-layout={isCompact ? 'narrow' : 'wide'}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={isArabic ? 'ar' : 'en'}
    >
      <div className="team-eval-app" ref={appRef}>
        <ApplicationShell
          viewportMode={viewportMode}
          topNavbar={<TopNavbar brand={topNavbarBrand} contextLabel={strings.context} account={account} />}
          sidebar={(
            <Sidebar
              label={strings.navLabel}
              items={shellItems}
              currentId="team"
              footer={(
                <div className="team-eval-sidebar-footer">
                  <span>{strings.footerPrimary}</span>
                  <span>{strings.footerSecondary}</span>
                </div>
              )}
            />
          )}
          pageHeading={pageHeading}
        >
          <div className="team-eval-directory">
            {inviteSuccessEmail && (
              <InlineFeedback intent="success" message={strings.inviteSuccess(inviteSuccessEmail)} />
            )}
            {isCompact && (
              <p className="team-eval-evaluation-note" role="note">{strings.compactDetailNote}</p>
            )}
            <div className="team-eval-directory-controls">
              <div className="team-eval-search">
                <SearchField
                  aria-label={strings.searchLabel}
                  clearButtonLabel={strings.clearSearch}
                  placeholder={strings.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  onClear={() => setQuery('')}
                />
              </div>
              <p className="team-eval-summary" aria-live="polite">
                {strings.visibleCounts(activeCount, invitedCount)}
              </p>
            </div>
            <div className="team-eval-table-region">
              {filteredMembers.length > 0 ? (
                <Table
                  rows={tableRows}
                  primaryLabel={strings.person}
                  secondaryLabel={strings.role}
                  statusLabel={strings.status}
                  actionLabel={strings.details}
                  footerText={strings.tableFooter(filteredMembers.length)}
                />
              ) : (
                <EmptyState
                  title={strings.emptyTitle}
                  body={strings.emptyBody(query.trim())}
                  actions={<Button emphasis="text" onClick={() => setQuery('')}>{strings.clearFilters}</Button>}
                />
              )}
            </div>
          </div>
        </ApplicationShell>
      </div>

      {selectedMember && (
        <div className="team-eval-detail-host" ref={modalHostRef} role="dialog" aria-modal="true" aria-label={strings.memberDetailsFor(selectedMember.name)} tabIndex={-1}>
          <div className="team-eval-detail-backdrop" aria-hidden="true" />
          <div className="team-eval-detail-panel">
            <SidePanel
              className="team-eval-side-panel"
              eyebrow={strings.memberDetails}
              closeLabel={strings.close}
              onClose={closeMemberDetail}
              header={(
                <div className="team-eval-detail-identity">
                  <Avatar initials={selectedMember.initials} size="lg" />
                  <div className="team-eval-detail-person-copy">
                    <h2 dir="ltr">{selectedMember.name}</h2>
                    <p dir="ltr">{selectedMember.email}</p>
                    <span className="team-eval-detail-status"><StatusBadge label={strings.active} /></span>
                  </div>
                </div>
              )}
              actions={(
                <div className="team-eval-detail-actions">
                  <Button emphasis="secondary" onClick={closeMemberDetail}>{strings.close}</Button>
                  <Button disabled={!isRoleDirty} onClick={handleRoleSave}>{strings.saveChanges}</Button>
                </div>
              )}
            >
              <div className="team-eval-detail-body">
                <div className="team-eval-saved-role">
                  <span>{strings.currentSavedRole}</span>
                  <strong>{savedRole}</strong>
                </div>
                <RadioGroup
                  label={isArabic ? 'الدور' : 'Role'}
                  name="member-role"
                  options={roleOptions(strings)}
                  value={roleDraft}
                  required={false}
                  onValueChange={(value) => {
                    setRoleDraft(value as Role);
                    setSaveFeedback(null);
                  }}
                />
                <p className="team-eval-role-note">{strings.roleNote}</p>
                {saveFeedback === 'error' && <InlineFeedback intent="error" message={strings.saveFailure} />}
                {saveFeedback === 'success' && <InlineFeedback intent="success" message={strings.saveSuccess} />}
              </div>
            </SidePanel>
          </div>
        </div>
      )}

      <Dialog
        open={discardDialogOpen}
        onOpenChange={(open) => setDiscardDialogOpen(open)}
        title={strings.discardTitle}
        closeLabel={strings.closeDialog}
        actions={(
          <div className="team-eval-confirm-actions">
            <Button emphasis="secondary" onClick={() => setDiscardDialogOpen(false)}>{strings.keepEditing}</Button>
            <Button emphasis="secondary" tone="critical" onClick={discardRoleDraft}>{strings.discardChanges}</Button>
          </div>
        )}
      >
        <p>{strings.discardDescription}</p>
      </Dialog>

      <Dialog
        open={inviteDialogOpen}
        onOpenChange={(open) => { if (!open) closeInviteDialog(); }}
        title={strings.inviteTitle}
        description={strings.inviteDescription}
        closeLabel={strings.closeDialog}
        actions={(
          <div className="team-eval-invite-actions">
            <Button emphasis="secondary" onClick={closeInviteDialog}>{strings.cancel}</Button>
            <Button type="submit" form="team-eval-invite-form">{strings.sendInvitation}</Button>
          </div>
        )}
      >
        <form
          id="team-eval-invite-form"
          className="team-eval-invite-form"
          noValidate
          onInvalidCapture={() => setInviteAttempted(true)}
          onSubmit={submitInvite}
        >
          <TextField
            label={strings.email}
            type="email"
            value={inviteEmail}
            required
            dir="ltr"
            autoComplete="email"
            invalid={showEmailError && (!emailIsValid || inviteEmail.trim().length === 0)}
            errorMessage={showEmailError ? emailError : undefined}
            onChange={(event) => {
              setInviteEmail(event.currentTarget.value);
              setInviteFailure(false);
            }}
            onBlur={() => setInviteTouched(true)}
          />
          <RadioGroup
            label={strings.inviteRole}
            name="invite-role"
            options={roleOptions(strings)}
            value={inviteRole}
            required={false}
            onValueChange={(value) => {
              setInviteRole(value as Role);
              setInviteFailure(false);
            }}
          />
          {inviteFailure && <InlineFeedback intent="error" message={strings.inviteFailure} />}
        </form>
      </Dialog>
    </div>
  );
}

export type { TeamEvaluationProps };
