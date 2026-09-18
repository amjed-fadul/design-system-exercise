import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Dialog,
  EmptyState,
  IconButton,
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
): readonly PrototypeMember[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return members;

  return members.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(normalized),
  );
}

export function inviteEmailError(email: string): string | null {
  const normalized = email.trim();
  if (!normalized) return 'Enter an email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Enter a valid email address.';
  }
  return null;
}

function PrototypeNavIcon({ label }: { label: string }) {
  return (
    <span className="dse-product-prototype__nav-glyph" aria-hidden="true">
      {label.slice(0, 1)}
    </span>
  );
}

const navItems: readonly SidebarItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: <PrototypeNavIcon label="Overview" /> },
  { id: 'projects', label: 'Projects', href: '#projects', icon: <PrototypeNavIcon label="Projects" /> },
  { id: 'team', label: 'Team & access', href: '#team', icon: <PrototypeNavIcon label="Team" /> },
  { id: 'settings', label: 'Settings', href: '#settings', icon: <PrototypeNavIcon label="Settings" /> },
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

const moonIconUrl = new URL('../components/assets/top-navbar-moon.svg', import.meta.url).href;

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

function PersonIdentity({ member }: { member: PrototypeMember }) {
  return (
    <div className="dse-product-prototype__identity">
      <Avatar initials={member.initials} />
      <div className="dse-product-prototype__identity-copy">
        <strong>{member.name}</strong>
        <span dir="ltr">{member.email}</span>
      </div>
    </div>
  );
}

function WorkspaceFooter() {
  return (
    <div className="dse-product-prototype__workspace-footer">
      <strong>Northstar workspace</strong>
      <span>Signed in as Admin</span>
    </div>
  );
}

export function ConnectedProductPrototype() {
  const [members, setMembers] = useState<readonly PrototypeMember[]>(prototypeInitialMembers);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
    () => filterPrototypeMembers(members, query),
    [members, query],
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

    detailDialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestRoleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

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

    const validationMessage = inviteEmailError(inviteEmail);
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
    if (!member.joined || member.id === 'amal') return;
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
    primary: <PersonIdentity member={member} />,
    secondary: <span className="dse-product-prototype__cell-text">{member.role}</span>,
    status: <StatusBadge label={member.status} />,
    selected: member.id === selectedId,
    action:
      member.joined && member.id !== 'amal' ? (
        <Button
          emphasis="text"
          aria-label={`View ${member.name} details`}
          onClick={(event) => openMember(member, event.currentTarget)}
        >
          View
        </Button>
      ) : (
        <span className="dse-product-prototype__dash" aria-hidden="true">
          —
        </span>
      ),
  }));

  const account = (
    <div className="dse-product-prototype__account">
      <IconButton
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        icon={
          <span
            className="dse-product-prototype__moon-icon"
            style={{ '--dse-prototype-moon-image': `url("${moonIconUrl}")` } as React.CSSProperties}
          />
        }
        onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />
      <div className="dse-product-prototype__account-identity">
        <span>Amal Hassan · Admin</span>
        <Avatar initials="AH" />
      </div>
    </div>
  );

  const directory = (
    <div className="dse-product-prototype__directory">
      <div className="dse-product-prototype__toolbar">
        <div className="dse-product-prototype__search">
          <SearchField
            aria-label="Search team members"
            clearButtonLabel="Clear search"
            placeholder="Search by name or email"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value)}
            onClear={() => setQuery('')}
          />
        </div>
        <span className="dse-product-prototype__count">
          {members.length} people · {activeCount} active · {pendingCount} invitations pending
        </span>
      </div>

      {visibleMembers.length > 0 ? (
        <div className="dse-product-prototype__table-scroll">
          <Table
            rows={rows}
            primaryLabel="Person"
            secondaryLabel="Role"
            statusLabel="Status"
            actionLabel="Details"
            footerText={`${visibleMembers.length} ${visibleMembers.length === 1 ? 'person' : 'people'} shown`}
          />
        </div>
      ) : (
        <EmptyState
          title="No people found"
          body={`No names or email addresses match “${query}”.\nTry a different search or clear it to see everyone.`}
          actions={
            <Button emphasis="secondary" onClick={() => setQuery('')}>
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );

  const pageHeading = (
    <PageHeading
      title="Team members"
      description="Manage members and pending invitations in your workspace."
      breadcrumbs={
        <Breadcrumbs
          ariaLabel="Breadcrumbs"
          ancestors={[{ label: 'Workspace', href: '#workspace' }]}
          currentLabel="Team & access"
        />
      }
      actions={<Button onClick={openInvite}>Invite member</Button>}
    />
  );

  return (
    <div
      className="dse-product-prototype"
      data-theme={theme}
      data-figma-source="199:10635"
    >
      <div ref={shellHostRef} className="dse-product-prototype__shell-host">
        <ApplicationShell
          viewportMode="expanded"
          sidebar={
            <Sidebar
              label="WORKSPACE"
              items={navItems}
              currentId="team"
              footer={<WorkspaceFooter />}
            />
          }
          topNavbar={
            <TopNavbar
              brand={<Brand />}
              contextLabel="Workspace administration"
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
            aria-label={`${selectedMember.name} member details`}
            tabIndex={-1}
          >
            <SidePanel
              eyebrow="MEMBER DETAILS"
              closeLabel="Close member details"
              onClose={requestRoleClose}
              header={
                <div className="dse-product-prototype__panel-identity">
                  <PersonIdentity member={selectedMember} />
                </div>
              }
              actions={
                <>
                  <Button emphasis="text" onClick={requestRoleClose}>
                    Back
                  </Button>
                  {savePhase === 'saved' ? (
                    <Button onClick={closeRoleCleanly}>Close</Button>
                  ) : (
                    <Button
                      loading={savePhase === 'saving'}
                      loadingLabel={savePhase === 'failed' ? 'Retrying…' : 'Saving…'}
                      onClick={saveRole}
                    >
                      {savePhase === 'failed' ? 'Retry save' : 'Save changes'}
                    </Button>
                  )}
                </>
              }
            >
              <RadioGroup
                label="Role"
                name={`role-${selectedMember.id}`}
                options={roleOptions}
                value={draftRole}
                onValueChange={(value) => {
                  setDraftRole(value as Role);
                  if (savePhase === 'saved') setSavePhase('idle');
                }}
              />

              {savePhase === 'failed' ? (
                <InlineFeedback
                  intent="error"
                  title="Changes not saved"
                  message="Your role selection is still here. Try again."
                />
              ) : null}

              {savePhase === 'saved' ? (
                <InlineFeedback
                  intent="success"
                  title="Changes saved"
                  message={`${selectedMember.name} is now ${draftRole}.`}
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
        title="Invite member"
        description="Send an invitation and choose the member’s workspace role."
        actions={
          <>
            <Button emphasis="secondary" onClick={closeInvite} disabled={invitePhase === 'sending'}>
              Cancel
            </Button>
            <Button
              loading={invitePhase === 'sending'}
              loadingLabel={invitePhase === 'failed' ? 'Retrying…' : 'Sending…'}
              onClick={submitInvite}
            >
              {invitePhase === 'failed' ? 'Retry invitation' : 'Send invitation'}
            </Button>
          </>
        }
      >
        <TextField
          label="Email address"
          type="email"
          required
          value={inviteEmail}
          invalid={inviteError !== null}
          errorMessage={inviteError ?? undefined}
          supportingText="One person per invitation."
          onChange={(event) => {
            setInviteEmail(event.currentTarget.value);
            if (inviteError) setInviteError(null);
            if (invitePhase === 'failed') setInvitePhase('editing');
          }}
        />

        <RadioGroup
          label="Role"
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
            title="Invitation not sent"
            message="Your entries are kept here; try again."
          />
        ) : null}
      </Dialog>

      <Dialog
        open={discardOpen}
        onOpenChange={(open) => {
          if (!open) setDiscardOpen(false);
        }}
        title="Discard unsaved changes?"
        description="Your saved role will stay unchanged."
        actions={
          <>
            <Button emphasis="secondary" onClick={discardRoleChanges}>
              Discard
            </Button>
            <Button onClick={() => setDiscardOpen(false)}>Keep editing</Button>
          </>
        }
      >
        <p className="dse-product-prototype__guard-copy">
          You have a role change that has not been saved. Keep editing to return to the
          member details, or discard it and return to the directory.
        </p>
      </Dialog>
    </div>
  );
}
