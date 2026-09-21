import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
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
  Sidebar,
  SidePanel,
  StatusBadge,
  Table,
  TextField,
  TopNavbar,
} from "@design-system-exercise/react";
import { ApplicationShell } from "@design-system-exercise/patterns";

export type TeamRole = "Member" | "Admin";
export type TeamLanguage = "en" | "ar";
export type TeamViewportMode = "auto" | "expanded" | "compact";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: TeamRole;
  status: "Active" | "Invitation pending";
  kind: "member" | "invitation";
  isCurrentUser?: boolean;
};

export type TeamEvaluationProps = {
  theme?: "light" | "dark";
  language?: TeamLanguage;
  viewportMode?: TeamViewportMode;
  initialQuery?: string;
  initialInviteOpen?: boolean;
  initialDetailId?: string;
};

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "amal",
    name: "Amal Hassan",
    email: "amal@example.com",
    initials: "AH",
    role: "Admin",
    status: "Active",
    kind: "member",
    isCurrentUser: true,
  },
  {
    id: "sara",
    name: "Sara Ahmed",
    email: "sara@example.com",
    initials: "SA",
    role: "Member",
    status: "Active",
    kind: "member",
  },
  {
    id: "omar",
    name: "Omar Khalid",
    email: "omar@example.com",
    initials: "OK",
    role: "Member",
    status: "Active",
    kind: "member",
  },
  {
    id: "leila",
    name: "Leila Ibrahim",
    email: "leila@example.com",
    initials: "LI",
    role: "Member",
    status: "Active",
    kind: "member",
  },
  {
    id: "daniel",
    name: "Daniel Chen",
    email: "daniel@example.com",
    initials: "DC",
    role: "Member",
    status: "Active",
    kind: "member",
  },
  {
    id: "jamal-invitation",
    name: "Has not joined yet",
    email: "jamal@example.com",
    initials: "@",
    role: "Member",
    status: "Invitation pending",
    kind: "invitation",
  },
  {
    id: "maya-invitation",
    name: "Has not joined yet",
    email: "maya@example.com",
    initials: "@",
    role: "Member",
    status: "Invitation pending",
    kind: "invitation",
  },
];

const COPY = {
  en: {
    active: "Active",
    activeMembers: (count: number) => count === 1 ? "active member" : "active members",
    admin: "Admin",
    adminDescription: "Invite people and manage members and roles.",
    breadcrumbLabel: "Breadcrumbs",
    close: "Close",
    closeDialog: "Close dialog",
    closePanel: "Close member details",
    currentSavedRole: "Current saved role",
    details: "Details",
    detailsUnavailable: "Member detail behavior in the compact layout is unresolved.",
    discardChanges: "Discard changes",
    discardDescription: "Your role selection has not been saved. Discard it and close member details?",
    discardTitle: "Discard unsaved changes?",
    email: "Email address",
    emailInvalid: "Enter a valid email address.",
    emailRequired: "Enter an email address.",
    emailSupport: "The invitation will be sent to this address.",
    emptyBody: "No names or email addresses match your search. Try a different search or clear it to see everyone.",
    emptyTitle: "No team members found",
    invitationPending: "Invitation pending",
    invitationSent: "Invitation sent.",
    invitations: (count: number) => count === 1 ? "invitation" : "invitations",
    inviteDescription: "Send an invitation to join the Northstar workspace.",
    inviteFailure: "The invitation could not be sent. Your email and role are still here; try again.",
    inviteMember: "Invite member",
    inviteRole: "Role",
    inviteTitle: "Invite a member",
    keepEditing: "Keep editing",
    member: "Member",
    memberDescription: "Use the workspace without managing people.",
    memberDetails: "Member details",
    memberDetailsFor: (name: string) => `Member details for ${name}`,
    membersShown: (count: number) => `Showing ${count} ${count === 1 ? "person" : "people"}`,
    name: "Name",
    notJoined: "Has not joined yet",
    pageDescription: "Manage members and pending invitations in your workspace.",
    role: "Role",
    roleRequired: "Choose a role for this invitation.",
    retryInvitation: "Retry invitation",
    saveChanges: "Save changes",
    saveFailure: "The role change could not be saved. Your selection is still here; try again.",
    saveSuccess: "Role changes saved.",
    search: "Search members and invitations",
    searchPlaceholder: "Search by name or email",
    searchClear: "Clear search",
    sendInvitation: "Send invitation",
    signedInAdmin: "Signed in as Admin",
    status: "Status",
    teamAccess: "Team & access",
    teamMembers: "Team members",
    useWorkspace: "Workspace administration",
    workspace: "Workspace",
    workspaceName: "Northstar workspace",
    you: "you",
    changesAfterSave: "Changes take effect only after you save.",
  },
  ar: {
    active: "نشط",
    activeMembers: (count: number) => count === 1 ? "عضو نشط" : "أعضاء نشطون",
    admin: "مسؤول",
    adminDescription: "ادعُ الأشخاص وأدِر الأعضاء والأدوار.",
    breadcrumbLabel: "مسار التنقل",
    close: "إغلاق",
    closeDialog: "إغلاق مربع الحوار",
    closePanel: "إغلاق تفاصيل العضو",
    currentSavedRole: "الدور المحفوظ الحالي",
    details: "التفاصيل",
    detailsUnavailable: "سلوك تفاصيل العضو في التخطيط المدمج غير محسوم.",
    discardChanges: "تجاهل التغييرات",
    discardDescription: "لم يتم حفظ اختيار الدور. هل تريد تجاهله وإغلاق تفاصيل العضو؟",
    discardTitle: "تجاهل التغييرات غير المحفوظة؟",
    email: "عنوان البريد الإلكتروني",
    emailInvalid: "أدخل عنوان بريد إلكتروني صالحًا.",
    emailRequired: "أدخل عنوان بريد إلكتروني.",
    emailSupport: "سيتم إرسال الدعوة إلى هذا العنوان.",
    emptyBody: "لا تتطابق الأسماء أو عناوين البريد الإلكتروني مع بحثك. جرّب بحثًا آخر أو امسح البحث لعرض الجميع.",
    emptyTitle: "لم يتم العثور على أعضاء الفريق",
    invitationPending: "الدعوة معلّقة",
    invitationSent: "تم إرسال الدعوة بنجاح.",
    invitations: (count: number) => count === 1 ? "دعوة معلّقة" : "دعوات معلّقة",
    inviteDescription: "أرسل دعوة للانضمام إلى مساحة عمل Northstar.",
    inviteFailure: "تعذر إرسال الدعوة. ما زال البريد والدور محفوظين هنا؛ حاول مرة أخرى.",
    inviteMember: "دعوة عضو",
    inviteRole: "الدور",
    inviteTitle: "دعوة عضو",
    keepEditing: "متابعة التعديل",
    member: "عضو",
    memberDescription: "استخدم مساحة العمل من دون إدارة الأشخاص.",
    memberDetails: "تفاصيل العضو",
    memberDetailsFor: (name: string) => `تفاصيل العضو: ${name}`,
    membersShown: (count: number) => count === 1 ? "عرض شخص واحد" : `عرض ${count} أشخاص`,
    name: "الاسم",
    notJoined: "لم ينضم بعد",
    pageDescription: "أدِر أعضاء مساحة العمل والدعوات المعلّقة.",
    role: "الدور",
    roleRequired: "اختر دورًا لهذه الدعوة.",
    retryInvitation: "إعادة إرسال الدعوة",
    saveChanges: "حفظ التغييرات",
    saveFailure: "تعذر حفظ تغيير الدور. ما زال اختيارك هنا؛ حاول مرة أخرى.",
    saveSuccess: "تم حفظ تغييرات الدور.",
    search: "البحث عن الأعضاء والدعوات",
    searchPlaceholder: "ابحث بالاسم أو البريد الإلكتروني",
    searchClear: "مسح البحث",
    sendInvitation: "إرسال الدعوة",
    signedInAdmin: "تم تسجيل الدخول بصفة مسؤول",
    status: "الحالة",
    teamAccess: "الفريق والوصول",
    teamMembers: "أعضاء الفريق",
    useWorkspace: "إدارة مساحة العمل",
    workspace: "مساحة العمل",
    workspaceName: "مساحة عمل Northstar",
    you: "أنت",
    changesAfterSave: "لا تسري التغييرات إلا بعد حفظها.",
  },
} as const;

function copyFor(language: TeamLanguage) {
  return COPY[language];
}

export function filterMembers(
  members: TeamMember[],
  query: string,
  localizedInvitationName = "Has not joined yet",
): TeamMember[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return members;

  return members.filter((member) => {
    const searchableName = member.kind === "invitation" ? localizedInvitationName : member.name;
    return [member.name, searchableName, member.email].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });
}

function displayName(member: TeamMember, invitationName: string): string {
  return member.kind === "invitation" ? invitationName : member.name;
}

function roleLabel(role: TeamRole, language: TeamLanguage): string {
  const copy = copyFor(language);
  return role === "Admin" ? copy.admin : copy.member;
}

function formatVisibleMembers(count: number, language: TeamLanguage): string {
  return copyFor(language).membersShown(count);
}

function NavigationMark({ letter }: { letter: string }) {
  return (
    <span className="team-evaluation__navigation-mark" aria-hidden="true">
      {letter}
    </span>
  );
}

function useResolvedLayout(viewportMode: TeamViewportMode): "wide" | "narrow" {
  const [layout, setLayout] = useState<"wide" | "narrow">(
    viewportMode === "compact" ? "narrow" : "wide",
  );

  useEffect(() => {
    if (viewportMode === "expanded") {
      setLayout("wide");
      return;
    }
    if (viewportMode === "compact") {
      setLayout("narrow");
      return;
    }

    const breakpoint = window.matchMedia("(min-width: 1200px)");
    const updateLayout = () => setLayout(breakpoint.matches ? "wide" : "narrow");
    updateLayout();
    breakpoint.addEventListener("change", updateLayout);
    return () => breakpoint.removeEventListener("change", updateLayout);
  }, [viewportMode]);

  return layout;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => {
    if (element.closest('[aria-hidden="true"]')) return false;
    if (element.matches('input[type="radio"]') && !(element as HTMLInputElement).checked) return false;
    return window.getComputedStyle(element).visibility !== "hidden";
  });
}

export function TeamEvaluation({
  theme = "light",
  language = "en",
  viewportMode = "auto",
  initialQuery = "",
  initialInviteOpen = false,
  initialDetailId,
}: TeamEvaluationProps) {
  const copy = copyFor(language);
  const layout = useResolvedLayout(viewportMode);
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [savedRoles, setSavedRoles] = useState<Record<string, TeamRole>>({});
  const [query, setQuery] = useState(initialQuery);
  const [inviteOpen, setInviteOpen] = useState(initialInviteOpen);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole | undefined>();
  const [inviteEmailError, setInviteEmailError] = useState<string>();
  const [inviteRoleError, setInviteRoleError] = useState(false);
  const [inviteRequestFailed, setInviteRequestFailed] = useState(false);
  const [inviteFailureUsed, setInviteFailureUsed] = useState(false);
  const [pageFeedback, setPageFeedback] = useState<{ intent: "success"; message: string }>();
  const [detailId, setDetailId] = useState<string | null>(initialDetailId ?? null);
  const [detailDraftRole, setDetailDraftRole] = useState<TeamRole>(() => {
    const initialMember = INITIAL_MEMBERS.find((member) => member.id === initialDetailId);
    return initialMember?.role ?? "Member";
  });
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [roleRequestFailureUsed, setRoleRequestFailureUsed] = useState(false);
  const [roleRequestFeedback, setRoleRequestFeedback] = useState<"error" | "success">();
  const shellRef = useRef<HTMLDivElement>(null);
  const detailHostRef = useRef<HTMLDivElement>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const inviteFormId = useId();
  const invitationRoleName = useId();

  const filteredMembers = useMemo(
    () => filterMembers(members, query, copy.notJoined),
    [members, query, copy.notJoined],
  );
  const activeCount = filteredMembers.filter((member) => member.kind === "member").length;
  const invitationCount = filteredMembers.filter((member) => member.kind === "invitation").length;
  const selectedMember = members.find((member) => member.id === detailId) ?? null;
  const savedRole = selectedMember ? savedRoles[selectedMember.id] ?? selectedMember.role : "Member";
  const isRoleDirty = Boolean(
    selectedMember && selectedMember.kind === "member" && detailDraftRole !== savedRole,
  );
  const detailsAvailable = layout === "wide";

  useEffect(() => {
    if (!detailId || !shellRef.current) return;

    const shell = shellRef.current;
    const previousInert = shell.inert;
    const previousAriaHidden = shell.getAttribute("aria-hidden");
    shell.inert = true;
    shell.setAttribute("aria-hidden", "true");

    const focusable = detailHostRef.current
      ? getFocusableElements(detailHostRef.current)[0]
      : undefined;
    (focusable ?? detailHostRef.current)?.focus();

    return () => {
      shell.inert = previousInert;
      if (previousAriaHidden === null) shell.removeAttribute("aria-hidden");
      else shell.setAttribute("aria-hidden", previousAriaHidden);
      if (detailTriggerRef.current?.isConnected) detailTriggerRef.current.focus();
    };
  }, [detailId]);

  function openInviteDialog() {
    setInviteEmail("");
    setInviteRole(undefined);
    setInviteEmailError(undefined);
    setInviteRoleError(false);
    setInviteRequestFailed(false);
    setInviteFailureUsed(false);
    setInviteOpen(true);
  }

  function openMemberDetails(member: TeamMember, trigger: HTMLButtonElement) {
    if (!detailsAvailable) {
      return;
    }
    detailTriggerRef.current = trigger;
    setDetailDraftRole(savedRoles[member.id] ?? member.role);
    setRoleRequestFailureUsed(false);
    setRoleRequestFeedback(undefined);
    setDetailId(member.id);
  }

  function requestCloseDetails() {
    if (!selectedMember) return;
    if (selectedMember.kind === "member" && detailDraftRole !== savedRole) {
      setDiscardDialogOpen(true);
      return;
    }
    setDetailId(null);
  }

  function discardRoleDraft() {
    setDetailDraftRole(savedRole);
    setDiscardDialogOpen(false);
    setDetailId(null);
  }

  function saveRoleDraft() {
    if (!selectedMember || selectedMember.kind !== "member" || !isRoleDirty) return;
    if (!roleRequestFailureUsed) {
      setRoleRequestFailureUsed(true);
      setRoleRequestFeedback("error");
      return;
    }

    setSavedRoles((current) => ({ ...current, [selectedMember.id]: detailDraftRole }));
    setRoleRequestFeedback("success");
  }

  function handleDetailHostKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (discardDialogOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      requestCloseDetails();
      return;
    }

    if (event.key !== "Tab" || !detailHostRef.current) return;
    const focusable = getFocusableElements(detailHostRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      detailHostRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === detailHostRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === detailHostRef.current)) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleInviteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("invite-email");
    const emailElement = emailInput instanceof HTMLInputElement ? emailInput : null;
    const normalizedEmail = inviteEmail.trim();

    if (!normalizedEmail) {
      setInviteEmailError(copy.emailRequired);
      emailElement?.focus();
      return;
    }
    if (emailElement?.validity.typeMismatch) {
      setInviteEmailError(copy.emailInvalid);
      emailElement.focus();
      return;
    }
    setInviteEmailError(undefined);

    if (!inviteRole) {
      setInviteRoleError(true);
      form.querySelector<HTMLInputElement>(`input[name="${invitationRoleName}"]`)?.focus();
      return;
    }
    setInviteRoleError(false);

    if (!inviteFailureUsed) {
      setInviteFailureUsed(true);
      setInviteRequestFailed(true);
      return;
    }

    const nextId = `invitation-${Date.now()}-${members.length + 1}`;
    setMembers((current) => [
      ...current,
      {
        id: nextId,
        name: "Has not joined yet",
        email: normalizedEmail,
        initials: "@",
        role: inviteRole,
        status: "Invitation pending",
        kind: "invitation",
      },
    ]);
    setInviteOpen(false);
    setInviteRequestFailed(false);
    setPageFeedback({ intent: "success", message: copy.invitationSent });
  }

  const sidebarItems = [
    { id: "overview", label: language === "ar" ? "نظرة عامة" : "Overview", href: "#overview", icon: <NavigationMark letter="O" /> },
    { id: "projects", label: language === "ar" ? "المشاريع" : "Projects", href: "#projects", icon: <NavigationMark letter="P" /> },
    { id: "team-access", label: copy.teamAccess, href: "#team-access", icon: <NavigationMark letter="T" /> },
    { id: "settings", label: language === "ar" ? "الإعدادات" : "Settings", href: "#settings", icon: <NavigationMark letter="S" /> },
  ];

  const topNavbar = (
    <TopNavbar
      brand={<span className="team-evaluation__brand" dir="ltr">Northstar</span>}
      contextLabel={copy.useWorkspace}
      showContext
      account={
        <span className="team-evaluation__account">
          <Avatar initials="AH" />
          <span className="team-evaluation__account-name">
            <bdi dir="ltr">Amal Hassan</bdi> · <bdi dir={language === "ar" ? "rtl" : "ltr"}>{copy.admin}</bdi>
          </span>
        </span>
      }
    />
  );

  const sidebar = (
    <Sidebar
      label={language === "ar" ? "مساحة العمل" : "WORKSPACE"}
      items={sidebarItems}
      currentId="team-access"
      footer={
        <>
          <span dir="auto">{copy.workspaceName}</span>
          <span>{copy.signedInAdmin}</span>
        </>
      }
    />
  );

  const pageHeading = (
    <PageHeading
      title={copy.teamMembers}
      description={copy.pageDescription}
      breadcrumbs={
        <Breadcrumbs
          ariaLabel={copy.breadcrumbLabel}
          ancestors={[{ label: copy.workspace, href: "#workspace" }]}
          currentLabel={copy.teamAccess}
        />
      }
      actions={
        <Button type="button" onClick={openInviteDialog}>
          {copy.inviteMember}
        </Button>
      }
    />
  );

  const tableRows = filteredMembers.map((member) => {
    const memberName = displayName(member, copy.notJoined);
    const savedMemberRole = savedRoles[member.id] ?? member.role;
    return {
      id: member.id,
      primary: (
        <div className="team-evaluation__person">
          <Avatar initials={member.initials} />
          <span className="team-evaluation__person-copy">
            <span
              className="team-evaluation__person-name"
              dir={member.kind === "invitation" ? "auto" : "ltr"}
            >
              {member.kind === "invitation" ? (
                <bdi dir="auto">{copy.notJoined}</bdi>
              ) : (
                <bdi dir="ltr">{member.name}</bdi>
              )}
              {member.isCurrentUser ? (
                <bdi dir={language === "ar" ? "rtl" : "ltr"}> ({copy.you})</bdi>
              ) : null}
            </span>
            <span className="team-evaluation__person-email" dir="ltr">{member.email}</span>
          </span>
        </div>
      ),
      secondary: roleLabel(savedMemberRole, language),
      status: <StatusBadge label={member.kind === "invitation" ? copy.invitationPending : copy.active} />,
      action: (
        <Button
          type="button"
          emphasis="text"
          disabled={!detailsAvailable}
          aria-label={`${copy.details}: ${memberName} (${member.email})`}
          aria-describedby={!detailsAvailable ? "team-detail-unresolved" : undefined}
          onClick={(event) => openMemberDetails(member, event.currentTarget)}
        >
          {copy.details}
        </Button>
      ),
      selected: detailId === member.id,
    };
  });

  const roleOptions = [
    {
      value: "Member",
      label: copy.member,
      description: copy.memberDescription,
    },
    {
      value: "Admin",
      label: copy.admin,
      description: copy.adminDescription,
    },
  ] as const;

  return (
    <div
      className="team-evaluation"
      data-theme={theme}
      data-language={language}
      data-layout={layout}
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
      style={{ colorScheme: theme }}
    >
      <div ref={shellRef} className="team-evaluation__shell">
        <ApplicationShell
          sidebar={sidebar}
          topNavbar={topNavbar}
          pageHeading={pageHeading}
          viewportMode={viewportMode}
        >
          <section className="team-evaluation__directory" aria-label={copy.teamMembers}>
            {pageFeedback ? (
              <div className="team-evaluation__page-feedback">
                <InlineFeedback intent={pageFeedback.intent} message={pageFeedback.message} />
              </div>
            ) : null}
            <div className="team-evaluation__controls">
              <div className="team-evaluation__search">
                <SearchField
                  aria-label={copy.search}
                  clearButtonLabel={copy.searchClear}
                  dir={query.includes("@") ? "ltr" : undefined}
                  placeholder={copy.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  onClear={() => setQuery("")}
                />
              </div>
              <div className="team-evaluation__summary" aria-live="polite" aria-atomic="true">
                <span>{activeCount} {copy.activeMembers(activeCount)}</span>
                <span className="team-evaluation__summary-separator" aria-hidden="true">·</span>
                <span>{invitationCount} {copy.invitations(invitationCount)}</span>
              </div>
            </div>
            {!detailsAvailable ? (
              <p id="team-detail-unresolved" className="team-evaluation__unresolved" role="status">
                {copy.detailsUnavailable}
              </p>
            ) : null}
            {filteredMembers.length > 0 ? (
              <div className="team-evaluation__table-scroll">
                <Table
                  rows={tableRows}
                  primaryLabel={copy.name}
                  secondaryLabel={copy.role}
                  statusLabel={copy.status}
                  actionLabel={copy.details}
                  footerText={formatVisibleMembers(filteredMembers.length, language)}
                />
              </div>
            ) : (
              <EmptyState
                title={copy.emptyTitle}
                body={copy.emptyBody}
                actions={
                  <Button type="button" emphasis="secondary" onClick={() => setQuery("")}>
                    {copy.searchClear}
                  </Button>
                }
              />
            )}
          </section>
        </ApplicationShell>
      </div>

      {inviteOpen ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setInviteOpen(false);
          }}
          title={copy.inviteTitle}
          description={copy.inviteDescription}
          closeLabel={copy.closeDialog}
          actions={
            <div className="team-evaluation__dialog-actions">
              <Button type="button" emphasis="secondary" onClick={() => setInviteOpen(false)}>
                {copy.close}
              </Button>
              <Button type="submit" form={inviteFormId}>
                {inviteRequestFailed ? copy.retryInvitation : copy.sendInvitation}
              </Button>
            </div>
          }
        >
          <form
            id={inviteFormId}
            className="team-evaluation__invite-form"
            noValidate
            onSubmit={handleInviteSubmit}
          >
            <TextField
              label={copy.email}
              supportingText={copy.emailSupport}
              errorMessage={inviteEmailError}
              invalid={Boolean(inviteEmailError)}
              dir="ltr"
              type="email"
              name="invite-email"
              autoComplete="email"
              required
              value={inviteEmail}
              onChange={(event) => {
                setInviteEmail(event.currentTarget.value);
                setInviteEmailError(undefined);
                setInviteRequestFailed(false);
              }}
            />
            <RadioGroup
              label={copy.inviteRole}
              name={invitationRoleName}
              options={roleOptions}
              value={inviteRole}
              required
              onValueChange={(value) => {
                setInviteRole(value as TeamRole);
                setInviteRoleError(false);
                setInviteRequestFailed(false);
              }}
            />
            {inviteRoleError ? (
              <p className="team-evaluation__field-error" role="alert">{copy.roleRequired}</p>
            ) : null}
            {inviteRequestFailed ? (
              <InlineFeedback intent="error" message={copy.inviteFailure} />
            ) : null}
          </form>
        </Dialog>
      ) : null}

      {detailId && selectedMember ? (
        <div
          ref={detailHostRef}
          className="team-evaluation__detail-host"
          data-layout="wide"
          role="dialog"
          aria-modal="true"
          aria-label={copy.memberDetailsFor(displayName(selectedMember, copy.notJoined))}
          tabIndex={-1}
          onKeyDown={handleDetailHostKeyDown}
        >
          <SidePanel
            eyebrow={copy.memberDetails}
            className="team-evaluation__detail-panel"
            style={{
              inlineSize: "var(--dse-layout-semantic-detail-available-width)",
              blockSize: "100%",
              maxInlineSize: "100%",
            }}
            header={
              <div className="team-evaluation__detail-identity">
                <Avatar initials={selectedMember.initials} size="lg" />
                <div className="team-evaluation__detail-person">
                  <h2 dir={selectedMember.kind === "invitation" ? undefined : "ltr"}>
                    {displayName(selectedMember, copy.notJoined)}
                  </h2>
                  {selectedMember.kind === "invitation" ? (
                    <span className="team-evaluation__pending-name">{copy.notJoined}</span>
                  ) : null}
                  <span className="team-evaluation__detail-email" dir="ltr">{selectedMember.email}</span>
                </div>
                <StatusBadge
                  label={selectedMember.kind === "invitation" ? copy.invitationPending : copy.active}
                />
              </div>
            }
            showClose={false}
            closeLabel={copy.closePanel}
            onClose={requestCloseDetails}
            actions={
              <div className="team-evaluation__panel-actions">
                <Button type="button" emphasis="secondary" onClick={requestCloseDetails}>
                  {copy.close}
                </Button>
                {selectedMember.kind === "member" ? (
                  <Button
                    type="button"
                    disabled={!isRoleDirty}
                    onClick={saveRoleDraft}
                  >
                    {copy.saveChanges}
                  </Button>
                ) : null}
              </div>
            }
          >
            {selectedMember.kind === "member" ? (
              <div className="team-evaluation__member-editor">
                <div className="team-evaluation__saved-role">
                  <span className="team-evaluation__saved-role-label">{copy.currentSavedRole}</span>
                  <span className="team-evaluation__saved-role-value">{roleLabel(savedRole, language)}</span>
                </div>
                <p className="team-evaluation__save-note">{copy.changesAfterSave}</p>
                <RadioGroup
                  label={copy.role}
                  name={`member-role-${selectedMember.id}`}
                  options={roleOptions}
                  value={detailDraftRole}
                  required
                  onValueChange={(value) => {
                    setDetailDraftRole(value as TeamRole);
                    setRoleRequestFeedback(undefined);
                  }}
                />
                {roleRequestFeedback === "error" ? (
                  <InlineFeedback intent="error" message={copy.saveFailure} />
                ) : null}
                {roleRequestFeedback === "success" ? (
                  <InlineFeedback intent="success" message={copy.saveSuccess} />
                ) : null}
              </div>
            ) : (
              <dl className="team-evaluation__invitation-details">
                <div>
                  <dt>{copy.email}</dt>
                  <dd dir="ltr">{selectedMember.email}</dd>
                </div>
                <div>
                  <dt>{copy.role}</dt>
                  <dd>{roleLabel(selectedMember.role, language)}</dd>
                </div>
                <div>
                  <dt>{copy.status}</dt>
                  <dd>{copy.invitationPending}</dd>
                </div>
              </dl>
            )}
          </SidePanel>
        </div>
      ) : null}

      {discardDialogOpen ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setDiscardDialogOpen(false);
          }}
          title={copy.discardTitle}
          description={copy.discardDescription}
          closeLabel={copy.closeDialog}
          actions={
            <div className="team-evaluation__dialog-actions">
              <Button type="button" emphasis="secondary" onClick={() => setDiscardDialogOpen(false)}>
                {copy.keepEditing}
              </Button>
              <Button type="button" tone="critical" onClick={discardRoleDraft}>
                {copy.discardChanges}
              </Button>
            </div>
          }
        >
          <p className="team-evaluation__confirmation-copy">
            {copy.currentSavedRole}: {roleLabel(detailDraftRole, language)}
          </p>
        </Dialog>
      ) : null}
    </div>
  );
}
