import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
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
} from '@design-system-exercise/react';
import { ApplicationShell } from '@design-system-exercise/patterns';

export type TeamRole = 'Member' | 'Admin';
export type TeamRecordStatus = 'active' | 'invited';
export type TeamViewportMode = 'expanded' | 'compact';
export type TeamScenario =
  | 'default'
  | 'no-results'
  | 'invite-open'
  | 'invite-failure-once'
  | 'role-save-failure-once';

export interface TeamRecord {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: TeamRole;
  status: TeamRecordStatus;
  isCurrentUser?: boolean;
}

export interface TeamEvaluationProps {
  locale?: 'en' | 'ar';
  theme?: 'light' | 'dark';
  viewportMode?: TeamViewportMode;
  scenario?: TeamScenario;
}

const initialTeamRecords: TeamRecord[] = [
  {
    id: 'member-amal',
    name: 'Amal Hassan',
    email: 'amal@example.com',
    initials: 'AH',
    role: 'Admin',
    status: 'active',
    isCurrentUser: true,
  },
  {
    id: 'member-sara',
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    initials: 'SA',
    role: 'Member',
    status: 'active',
  },
  {
    id: 'member-omar',
    name: 'Omar Khalid',
    email: 'omar@example.com',
    initials: 'OK',
    role: 'Member',
    status: 'active',
  },
  {
    id: 'member-leila',
    name: 'Leila Ibrahim',
    email: 'leila@example.com',
    initials: 'LI',
    role: 'Member',
    status: 'active',
  },
  {
    id: 'member-daniel',
    name: 'Daniel Chen',
    email: 'daniel@example.com',
    initials: 'DC',
    role: 'Member',
    status: 'active',
  },
  {
    id: 'invitation-jamal',
    name: 'Has not joined yet',
    email: 'jamal@example.com',
    initials: '@',
    role: 'Member',
    status: 'invited',
  },
  {
    id: 'invitation-maya',
    name: 'Has not joined yet',
    email: 'maya@example.com',
    initials: '@',
    role: 'Member',
    status: 'invited',
  },
];

const roleOptions = [
  {
    value: 'Member',
    label: 'Member',
    description: 'Use the workspace without managing people.',
  },
  {
    value: 'Admin',
    label: 'Admin',
    description: 'Invite people and manage members and roles.',
  },
] as const;

export function filterTeamRecords(records: readonly TeamRecord[], query: string): TeamRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...records];
  }

  return records.filter((record) =>
    `${record.name} ${record.email}`.toLowerCase().includes(normalizedQuery),
  );
}

export function summarizeTeamRecords(records: readonly TeamRecord[]) {
  return {
    active: records.filter((record) => record.status === 'active').length,
    invitations: records.filter((record) => record.status === 'invited').length,
    visible: records.length,
  };
}

function formatVisibleCount(count: number): string {
  return `${count} ${count === 1 ? 'person' : 'people'} shown`;
}

function formatResultSummary(active: number, invitations: number): string {
  const invitationLabel = invitations === 1 ? 'pending invitation' : 'pending invitations';
  return `${active} active · ${invitations} ${invitationLabel}`;
}

function getRecordAccessibleName(record: TeamRecord): string {
  return record.status === 'invited'
    ? `View invitation details for ${record.email}`
    : `View details for ${record.name}`;
}

function useNarrowViewport(): boolean {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1199px)');
    const update = () => setIsNarrow(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isNarrow;
}

function ShellIcon({ name }: { name: 'overview' | 'projects' | 'team' | 'settings' }) {
  return <span aria-hidden="true" className={`team-shell-icon team-shell-icon--${name}`} />;
}

function NorthstarBrand() {
  return (
    <div className="team-brand">
      <span aria-hidden="true" className="team-brand-mark">N</span>
      <span className="team-brand-name" dir="ltr">
        Northstar
      </span>
    </div>
  );
}

function NorthstarAccount({ locale }: { locale: 'en' | 'ar' }) {
  const accountLabel = locale === 'ar' ? 'أمل حسن · مشرفة' : 'Amal Hassan · Admin';
  const initials = locale === 'ar' ? 'أح' : 'AH';

  return (
    <div className="team-account">
      <span aria-hidden="true" className="team-appearance-utility">
        <span className="team-appearance-icon" />
      </span>
      <span className="team-account-identity">
        <span>{accountLabel}</span>
        <Avatar initials={initials} />
      </span>
    </div>
  );
}

function WorkspaceSidebar({ locale }: { locale: 'en' | 'ar' }) {
  const arabic = locale === 'ar';
  const items = [
    {
      id: 'overview',
      label: arabic ? 'نظرة عامة' : 'Overview',
      href: '#',
      icon: <ShellIcon name="overview" />,
    },
    {
      id: 'projects',
      label: arabic ? 'المشاريع' : 'Projects',
      href: '#',
      icon: <ShellIcon name="projects" />,
    },
    {
      id: 'team',
      label: arabic ? 'الفريق والصلاحيات' : 'Team & access',
      href: '#',
      icon: <ShellIcon name="team" />,
    },
    {
      id: 'settings',
      label: arabic ? 'الإعدادات' : 'Settings',
      href: '#',
      icon: <ShellIcon name="settings" />,
    },
  ];

  return (
    <Sidebar
      currentId="team"
      footer={
        <>
          <span className="team-sidebar-footer-primary">
            {arabic ? 'مساحة نورث ستار' : 'Northstar workspace'}
          </span>
          <span className="team-sidebar-footer-secondary">
            {arabic ? 'تم تسجيل الدخول كمشرفة' : 'Signed in as Admin'}
          </span>
        </>
      }
      items={items}
      label={arabic ? 'مساحة العمل' : 'WORKSPACE'}
    />
  );
}

function NorthstarTopNavbar({ locale }: { locale: 'en' | 'ar' }) {
  return (
    <TopNavbar
      account={<NorthstarAccount locale={locale} />}
      brand={<NorthstarBrand />}
      contextLabel={locale === 'ar' ? 'إدارة مساحة العمل' : 'Workspace administration'}
    />
  );
}

function PageContext({ onInvite }: { onInvite: () => void }) {
  const breadcrumbs = (
    <Breadcrumbs
      ancestors={[{ label: 'Workspace', href: '#' }]}
      ariaLabel="Breadcrumbs"
      currentLabel="Team & access"
    />
  );

  const actions = (
    <Button onClick={onInvite} type="button">
      Invite member
    </Button>
  );

  return (
    <PageHeading
      actions={actions}
      breadcrumbs={breadcrumbs}
      description="Manage members and pending invitations in your workspace."
      title="Team members"
    />
  );
}

function EmailAddress({ children }: { children: ReactNode }) {
  return (
    <span className="team-email" dir="ltr">
      {children}
    </span>
  );
}

export function TeamEvaluation({
  locale = 'en',
  theme = 'light',
  viewportMode = 'expanded',
  scenario = 'default',
}: TeamEvaluationProps) {
  const isNarrowViewport = useNarrowViewport();
  const isCompactPresentation = viewportMode === 'compact';
  const isDetailAvailable = !isNarrowViewport && !isCompactPresentation;
  const [records, setRecords] = useState<TeamRecord[]>(() => [...initialTeamRecords]);
  const [query, setQuery] = useState(scenario === 'no-results' ? 'nobody@example.com' : '');
  const [inviteOpen, setInviteOpen] = useState(
    scenario === 'invite-open' || scenario === 'invite-failure-once',
  );
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('Member');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteFailure, setInviteFailure] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    scenario === 'role-save-failure-once' ? 'member-sara' : null,
  );
  const [detailOpen, setDetailOpen] = useState(scenario === 'role-save-failure-once');
  const [draftRole, setDraftRole] = useState<TeamRole>('Member');
  const [roleFeedback, setRoleFeedback] = useState<
    { intent: 'error' | 'success'; message: string } | null
  >(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  const detailHostRef = useRef<HTMLDivElement | null>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const inviteFormRef = useRef<HTMLFormElement | null>(null);
  const inviteFailureUsed = useRef(false);
  const roleFailureUsed = useRef(false);
  const nextInvitationNumber = useRef(1);
  const discardOpenRef = useRef(discardOpen);
  const requestDetailCloseRef = useRef<() => void>(() => undefined);
  discardOpenRef.current = discardOpen;

  const visibleRecords = filterTeamRecords(records, query);
  const summary = summarizeTeamRecords(visibleRecords);
  const selectedRecord = records.find((record) => record.id === selectedRecordId) ?? null;
  const detailIsVisible = detailOpen && isDetailAvailable && selectedRecord !== null;
  const hasUnsavedRole =
    selectedRecord?.status === 'active' && draftRole !== selectedRecord.role;

  const closeInvite = () => {
    setInviteOpen(false);
    setInviteEmail('');
    setInviteRole('Member');
    setInviteError(null);
    setInviteFailure(false);
  };

  const openInvite = () => {
    setInviteSuccess(null);
    setInviteOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDiscardOpen(false);
    setSelectedRecordId(null);
    setRoleFeedback(null);
  };

  const requestDetailClose = () => {
    if (hasUnsavedRole) {
      setDiscardOpen(true);
      return;
    }
    closeDetail();
  };
  requestDetailCloseRef.current = requestDetailClose;

  useEffect(() => {
    if (!detailIsVisible) {
      return;
    }

    const host = detailHostRef.current;
    const previousTrigger = detailTriggerRef.current;
    host?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (discardOpenRef.current) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        requestDetailCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !host) {
        return;
      }

      const focusableElements = Array.from(
        host.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => {
        if (element.getAttribute('aria-hidden') === 'true') {
          return false;
        }
        if (element instanceof HTMLInputElement && element.type === 'radio' && !element.checked) {
          return false;
        }
        return true;
      });

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!first || !last) {
        event.preventDefault();
        host.focus();
        return;
      }

      if (event.shiftKey && (activeElement === first || activeElement === host || !host.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeElement === last || !host.contains(activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      if (previousTrigger?.isConnected) {
        previousTrigger.focus();
      }
    };
  }, [detailIsVisible]);

  const handleInviteSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const form = event?.currentTarget ?? inviteFormRef.current;
    const emailInput = form?.elements.namedItem('email') as HTMLInputElement | null;
    const normalizedEmail = inviteEmail.trim();

    if (!normalizedEmail) {
      setInviteError('Enter an email address.');
      setInviteFailure(false);
      return;
    }

    if (!emailInput?.validity.valid) {
      setInviteError('Enter a valid email address.');
      setInviteFailure(false);
      return;
    }

    setInviteError(null);
    setInviteFailure(false);

    if (scenario === 'invite-failure-once' && !inviteFailureUsed.current) {
      inviteFailureUsed.current = true;
      setInviteFailure(true);
      return;
    }

    const invitation: TeamRecord = {
      id: `invitation-local-${nextInvitationNumber.current}`,
      name: 'Has not joined yet',
      email: normalizedEmail,
      initials: '@',
      role: inviteRole,
      status: 'invited',
    };
    nextInvitationNumber.current += 1;
    setRecords((currentRecords) => [...currentRecords, invitation]);
    setInviteSuccess(normalizedEmail);
    closeInvite();
  };

  const openRecordDetails = (record: TeamRecord, trigger: HTMLButtonElement) => {
    if (!isDetailAvailable) {
      return;
    }
    detailTriggerRef.current = trigger;
    setSelectedRecordId(record.id);
    setDraftRole(record.role);
    setRoleFeedback(null);
    setDiscardOpen(false);
    setDetailOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedRecord || selectedRecord.status !== 'active' || !hasUnsavedRole) {
      return;
    }

    if (scenario === 'role-save-failure-once' && !roleFailureUsed.current) {
      roleFailureUsed.current = true;
      setRoleFeedback({
        intent: 'error',
        message: 'We couldn’t save this role. Try again.',
      });
      return;
    }

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === selectedRecord.id ? { ...record, role: draftRole } : record,
      ),
    );
    setRoleFeedback({ intent: 'success', message: 'Role updated.' });
  };

  const tableRows = visibleRecords.map((record) => {
    const rowName = record.isCurrentUser ? `${record.name} (you)` : record.name;

    return {
      id: record.id,
      primary: (
        <div className="team-table-identity">
          <Avatar initials={record.initials} />
          <span className="team-table-identity-copy">
            <span className="team-table-identity-name">{rowName}</span>
            <EmailAddress>{record.email}</EmailAddress>
          </span>
        </div>
      ),
      secondary: record.role,
      status: <StatusBadge label={record.status === 'active' ? 'Active' : 'Invitation pending'} />,
      action: (
        <Button
          aria-describedby={!isDetailAvailable ? 'team-detail-unresolved' : undefined}
          aria-label={getRecordAccessibleName(record)}
          disabled={!isDetailAvailable}
          emphasis="text"
          onClick={(event) => openRecordDetails(record, event.currentTarget)}
          type="button"
        >
          Details
        </Button>
      ),
      selected: detailIsVisible && selectedRecordId === record.id,
    };
  });

  const inviteDialogBody = (
    <form
      id="team-invite-form"
      noValidate
      onSubmit={(event) => void handleInviteSubmit(event)}
      ref={inviteFormRef}
    >
      <div className="team-dialog-fields">
        <TextField
          autoComplete="email"
          dir="ltr"
          errorMessage={inviteError ?? undefined}
          id="team-invite-email"
          invalid={Boolean(inviteError)}
          label="Email address"
          name="email"
          onChange={(event) => {
            setInviteEmail(event.currentTarget.value);
            setInviteError(null);
            setInviteFailure(false);
          }}
          required
          type="email"
          value={inviteEmail}
        />
        <RadioGroup
          label="Role"
          name="team-invite-role"
          onValueChange={(value) => setInviteRole(value as TeamRole)}
          options={roleOptions}
          required
          value={inviteRole}
        />
        {inviteFailure && (
          <div className="team-request-feedback">
            <InlineFeedback
              intent="error"
              message="We couldn’t send the invitation. Your details are still here; try again."
            />
            <Button
              emphasis="text"
              onClick={() => void handleInviteSubmit()}
              type="button"
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </form>
  );

  const inviteDialogActions = (
    <>
      <Button emphasis="secondary" onClick={closeInvite} type="button">
        Cancel
      </Button>
      <Button
        form="team-invite-form"
        type="submit"
      >
        Invite member
      </Button>
    </>
  );

  const detailHeader = selectedRecord ? (
    <div className="team-detail-header">
      <Avatar initials={selectedRecord.initials} />
      <div className="team-detail-header-copy">
        <h2 id="team-detail-title">{selectedRecord.name}</h2>
        <EmailAddress>{selectedRecord.email}</EmailAddress>
      </div>
    </div>
  ) : null;

  let detailBody: ReactNode = null;
  let detailActions: ReactNode = null;

  if (selectedRecord) {
    const isJoinedMember = selectedRecord.status === 'active';

    detailBody = (
      <div className="team-detail-body">
        <div className="team-detail-status">
          <span className="team-detail-label">Status</span>
          <StatusBadge label={isJoinedMember ? 'Active' : 'Invitation pending'} />
        </div>

        {isJoinedMember ? (
          <section className="team-role-editor" aria-label="Member role">
            <p className="team-saved-role">
              <span className="team-detail-label">Current saved role</span>
              <span>{selectedRecord.role}</span>
            </p>
            <RadioGroup
              label="Role"
              name={`team-role-${selectedRecord.id}`}
              onValueChange={(value) => {
                setDraftRole(value as TeamRole);
                setRoleFeedback(null);
              }}
              options={roleOptions}
              value={draftRole}
            />
            <p className="team-save-note">Changes take effect only after you save.</p>
            {roleFeedback && (
              <InlineFeedback intent={roleFeedback.intent} message={roleFeedback.message} />
            )}
          </section>
        ) : (
          <div className="team-invitation-detail">
            <span className="team-detail-label">Invitation role</span>
            <span>{selectedRecord.role}</span>
          </div>
        )}
      </div>
    );

    detailActions = (
      <>
        <Button emphasis="secondary" onClick={requestDetailClose} type="button">
          Close
        </Button>
        {isJoinedMember && (
          <Button disabled={!hasUnsavedRole} onClick={handleSaveRole} type="button">
            Save changes
          </Button>
        )}
      </>
    );
  }

  return (
    <div
      className="team-evaluation"
      data-layout={isCompactPresentation ? 'narrow' : 'wide'}
      data-language={locale === 'ar' ? 'ar' : 'en'}
      data-theme={theme}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale === 'ar' ? 'ar' : 'en'}
    >
      <div
        aria-hidden={detailIsVisible || undefined}
        className="team-shell-region"
        inert={detailIsVisible}
      >
        <ApplicationShell
          pageHeading={<PageContext onInvite={openInvite} />}
          sidebar={<WorkspaceSidebar locale={locale} />}
          topNavbar={<NorthstarTopNavbar locale={locale} />}
          viewportMode={viewportMode}
        >
          <div className="team-page-content">
            <div className="team-directory-controls">
              <SearchField
                aria-label="Search members and invitations"
                clearButtonLabel="Clear search"
                className="team-search-field"
                onChange={(event) => setQuery(event.currentTarget.value)}
                onClear={() => setQuery('')}
                placeholder="Search by name or email"
                value={query}
              />
              <p className="team-result-summary">{formatResultSummary(summary.active, summary.invitations)}</p>
            </div>

            {!isDetailAvailable && (
              <p className="team-detail-unresolved" id="team-detail-unresolved" role="note">
                Member details are authored for the wide view. Narrow detail behavior is unresolved.
              </p>
            )}

            {inviteSuccess && (
              <InlineFeedback
                intent="success"
                message={`Invitation sent to ${inviteSuccess}.`}
              />
            )}

            <div className="team-table-overflow">
              {visibleRecords.length > 0 ? (
                <Table
                  actionLabel="Details"
                  footerText={formatVisibleCount(summary.visible)}
                  primaryLabel="Person"
                  rows={tableRows}
                  secondaryLabel="Role"
                  statusLabel="Status"
                />
              ) : (
                <EmptyState
                  body="No names or email addresses match this search. Try another search to see people and invitations."
                  title="No matching people"
                />
              )}
            </div>
          </div>
        </ApplicationShell>
      </div>

      <Dialog
        actions={inviteDialogActions}
        closeLabel="Close invite dialog"
        onOpenChange={(open) => {
          if (!open) {
            closeInvite();
          }
        }}
        open={inviteOpen}
        title="Invite member"
      >
        {inviteDialogBody}
      </Dialog>

      {detailIsVisible && selectedRecord && (
        <div className="team-detail-overlay">
          <div
            aria-labelledby="team-detail-title"
            aria-modal="true"
            className="team-detail-host"
            ref={detailHostRef}
            role="dialog"
            tabIndex={-1}
          >
            <SidePanel
              actions={detailActions}
              className="team-detail-panel"
              closeLabel="Close member details"
              eyebrow={selectedRecord.status === 'active' ? 'Member details' : 'Invitation details'}
              header={detailHeader}
              onClose={requestDetailClose}
              showClose={false}
            >
              {detailBody}
            </SidePanel>
          </div>
        </div>
      )}

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={() => setDiscardOpen(false)} type="button">
              Keep editing
            </Button>
            <Button
              onClick={() => {
                setDraftRole(selectedRecord?.role ?? 'Member');
                closeDetail();
              }}
              tone="critical"
              type="button"
            >
              Discard changes
            </Button>
          </>
        }
        description="Your role change has not been saved."
        onOpenChange={(open) => setDiscardOpen(open)}
        open={discardOpen}
        title="Unsaved role changes"
      >
        <p className="team-confirmation-copy">
          Choose Keep editing to return to the role choice, or Discard changes to close member details.
        </p>
      </Dialog>
    </div>
  );
}
