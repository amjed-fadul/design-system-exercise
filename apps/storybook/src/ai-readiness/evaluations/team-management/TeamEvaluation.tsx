import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Avatar,
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
} from "@design-system-exercise/react";
import { ApplicationShell } from "@design-system-exercise/patterns";

export type TeamLanguage = "en" | "ar";
export type TeamTheme = "light" | "dark";
export type TeamViewportMode = "auto" | "expanded" | "compact";

export type TeamScenario =
  | "populated"
  | "filtered-empty"
  | "invite-validation"
  | "invite-retry"
  | "invite-success"
  | "member-detail"
  | "role-save-failure"
  | "role-save-success"
  | "unsaved-close-guard";

type MemberRole = "admin" | "member";

type Member = {
  id: string;
  name: string;
  initials: string;
  role: MemberRole;
  email?: string;
};

type Invitation = {
  id: string;
  email: string;
  role: MemberRole;
};

type RecordReference =
  | { kind: "member"; id: string }
  | { kind: "invitation"; id: string };

type TeamEvaluationProps = {
  scenario?: TeamScenario;
  language?: TeamLanguage;
  theme?: TeamTheme;
  viewportMode?: TeamViewportMode;
};

const INITIAL_MEMBERS: Member[] = [
  { id: "amal-hassan", name: "Amal Hassan", initials: "AH", role: "admin" },
  { id: "sara-ahmed", name: "Sara Ahmed", initials: "SA", role: "member" },
  { id: "omar-khalid", name: "Omar Khalid", initials: "OK", role: "member" },
];

const INITIAL_INVITATIONS: Invitation[] = [
  { id: "invitation-1", email: "invitee.one@example.com", role: "member" },
  { id: "invitation-2", email: "invitee.two@example.com", role: "member" },
];

const ENGLISH = {
  workspace: "Workspace",
  team: "Team",
  shellContext: "Workspace administration",
  pageTitle: "Team & access",
  pageDescription: "Manage the people who can access your workspace.",
  inviteMember: "Invite member",
  searchLabel: "Search members and invitations",
  searchPlaceholder: "Search by name or email",
  clearSearch: "Clear search",
  activeCount: (count: string) => `${count} active`,
  invitedCount: (count: string) => `${count} invited`,
  resultCount: (count: string) => `${count} results`,
  person: "Person",
  role: "Role",
  status: "Status",
  action: "Action",
  memberRole: "Member",
  adminRole: "Admin",
  active: "Active",
  invitationPending: "Invitation pending",
  viewMember: "View details",
  viewInvitation: "View invitation",
  viewMemberFor: (name: string) => `View details for ${name}`,
  viewInvitationFor: (email: string) => `View invitation for ${email}`,
  detailUnavailable: "Contextual details are available in the wide presentation. Compact detail behavior is unresolved.",
  noPeopleTitle: "No people found",
  noPeopleBody: "Try a different search or clear it to see everyone.",
  inviteDialogTitle: "Invite a member",
  inviteDialogDescription: "Send an invitation to join this workspace and choose the access level.",
  emailAddress: "Email address",
  emailPlaceholder: "name@company.com",
  emailRequired: "Enter an email address.",
  emailInvalid: "Enter a valid email address.",
  inviteRole: "Workspace role",
  sendInvite: "Send invitation",
  retryInvite: "Retry invitation",
  cancel: "Cancel",
  closeInvite: "Close invitation dialog",
  inviteFailureTitle: "Invitation could not be sent",
  inviteFailureMessage: "The invitation was not sent. Your email and role are still here; retry when you are ready.",
  inviteSuccessTitle: "Invitation sent",
  inviteSuccessMessage: "The invitation was sent successfully.",
  memberDetail: "Member details",
  invitationDetail: "Invitation details",
  detailForMember: (name: string) => `Member details for ${name}`,
  detailForInvitation: (email: string) => `Invitation details for ${email}`,
  closeDetails: "Close details",
  saveChanges: "Save changes",
  retrySave: "Retry save",
  saveFailureTitle: "Changes could not be saved",
  saveFailureMessage: "The saved role has not changed. Your selection is still here; retry to save it.",
  saveSuccessTitle: "Role updated",
  saveSuccessMessage: "The member role was updated.",
  discardDialogTitle: "Discard unsaved changes?",
  discardDialogDescription: "This role change has not been saved. Choose whether to keep editing or discard it.",
  keepEditing: "Keep editing",
  discardChanges: "Discard changes",
  closeConfirmation: "Keep editing",
  invitationEmail: "Invited email",
};

const ARABIC = {
  workspace: "مساحة العمل",
  team: "الفريق",
  shellContext: "إدارة مساحة العمل",
  pageTitle: "الفريق وإمكانية الوصول",
  pageDescription: "أدر الأشخاص الذين يمكنهم الوصول إلى مساحة العمل.",
  inviteMember: "دعوة عضو",
  searchLabel: "البحث عن الأعضاء والدعوات",
  searchPlaceholder: "ابحث بالاسم أو البريد الإلكتروني",
  clearSearch: "مسح البحث",
  activeCount: (count: string) => `${count} نشط`,
  invitedCount: (count: string) => `${count} مدعو`,
  resultCount: (count: string) => `${count} نتيجة`,
  person: "الشخص",
  role: "الدور",
  status: "الحالة",
  action: "الإجراء",
  memberRole: "عضو",
  adminRole: "مسؤول",
  active: "نشط",
  invitationPending: "الدعوة معلّقة",
  viewMember: "عرض التفاصيل",
  viewInvitation: "عرض الدعوة",
  viewMemberFor: (name: string) => `عرض تفاصيل ${name}`,
  viewInvitationFor: (email: string) => `عرض الدعوة إلى ${email}`,
  detailUnavailable: "تتوفر التفاصيل السياقية في العرض الواسع. سلوكها في العرض المضغوط غير محسوم.",
  noPeopleTitle: "لم يتم العثور على أشخاص",
  noPeopleBody: "جرّب بحثًا آخر أو امسح البحث لعرض الجميع.",
  inviteDialogTitle: "دعوة عضو",
  inviteDialogDescription: "أرسل دعوة للانضمام إلى مساحة العمل واختر مستوى الوصول.",
  emailAddress: "عنوان البريد الإلكتروني",
  emailPlaceholder: "name@company.com",
  emailRequired: "أدخل عنوان البريد الإلكتروني.",
  emailInvalid: "أدخل عنوان بريد إلكتروني صالحًا.",
  inviteRole: "دور مساحة العمل",
  sendInvite: "إرسال الدعوة",
  retryInvite: "إعادة إرسال الدعوة",
  cancel: "إلغاء",
  closeInvite: "إغلاق نافذة الدعوة",
  inviteFailureTitle: "تعذر إرسال الدعوة",
  inviteFailureMessage: "لم تُرسل الدعوة. ما زال البريد والدور محفوظين هنا؛ أعد المحاولة عندما تكون مستعدًا.",
  inviteSuccessTitle: "تم إرسال الدعوة",
  inviteSuccessMessage: "تم إرسال الدعوة بنجاح.",
  memberDetail: "تفاصيل العضو",
  invitationDetail: "تفاصيل الدعوة",
  detailForMember: (name: string) => `تفاصيل العضو ${name}`,
  detailForInvitation: (email: string) => `تفاصيل الدعوة إلى ${email}`,
  closeDetails: "إغلاق التفاصيل",
  saveChanges: "حفظ التغييرات",
  retrySave: "إعادة محاولة الحفظ",
  saveFailureTitle: "تعذر حفظ التغييرات",
  saveFailureMessage: "لم يتغير الدور المحفوظ. ما زال اختيارك هنا؛ أعد المحاولة لحفظه.",
  saveSuccessTitle: "تم تحديث الدور",
  saveSuccessMessage: "تم تحديث دور العضو.",
  discardDialogTitle: "هل تريد تجاهل التغييرات غير المحفوظة؟",
  discardDialogDescription: "لم يتم حفظ تغيير الدور. اختر متابعة التعديل أو تجاهله.",
  keepEditing: "متابعة التعديل",
  discardChanges: "تجاهل التغييرات",
  closeConfirmation: "متابعة التعديل",
  invitationEmail: "البريد المدعو",
};

function roleLabel(role: MemberRole, language: TeamLanguage): string {
  if (language === "ar") return role === "admin" ? ARABIC.adminRole : ARABIC.memberRole;
  return role === "admin" ? ENGLISH.adminRole : ENGLISH.memberRole;
}

function initialMembersFor(scenario: TeamScenario): Member[] {
  return INITIAL_MEMBERS.map((member) => {
    if (scenario === "role-save-success" && member.id === "sara-ahmed") {
      return { ...member, role: "admin" };
    }
    return { ...member };
  });
}

function initialInvitationsFor(scenario: TeamScenario): Invitation[] {
  const invitations = INITIAL_INVITATIONS.map((invitation) => ({ ...invitation }));
  if (scenario === "invite-success") {
    invitations.push({ id: "invitation-3", email: "riley.kim@example.com", role: "member" });
  }
  return invitations;
}

function initialDetailFor(
  scenario: TeamScenario,
  viewportMode: TeamViewportMode,
): RecordReference | null {
  const compactViewport =
    viewportMode === "compact" ||
    (typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 1199px)").matches);
  if (compactViewport) return null;

  if (
    scenario === "member-detail" ||
    scenario === "role-save-failure" ||
    scenario === "role-save-success" ||
    scenario === "unsaved-close-guard"
  ) {
    return { kind: "member", id: "sara-ahmed" };
  }
  return null;
}

function isFocusTarget(element: HTMLElement): boolean {
  return !element.hasAttribute("disabled") && element.getAttribute("tabindex") !== "-1";
}

function focusFirst(host: HTMLElement): void {
  const target = host.querySelector<HTMLElement>(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  if (target && isFocusTarget(target)) target.focus();
  else host.focus();
}

function TeamNavigationIcon() {
  return (
    <svg
      aria-hidden="true"
      className="team-evaluation__nav-icon"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M16 4.3a3.5 3.5 0 0 1 0 6.7M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" />
    </svg>
  );
}

export function TeamEvaluation({
  scenario = "populated",
  language = "en",
  theme = "light",
  viewportMode = "auto",
}: TeamEvaluationProps) {
  const copy = language === "ar" ? ARABIC : ENGLISH;
  const [members, setMembers] = useState<Member[]>(() => initialMembersFor(scenario));
  const [invitations, setInvitations] = useState<Invitation[]>(() => initialInvitationsFor(scenario));
  const [search, setSearch] = useState(() => (scenario === "filtered-empty" ? "no-match@example.com" : ""));
  const [inviteOpen, setInviteOpen] = useState(
    () => scenario === "invite-validation" || scenario === "invite-retry",
  );
  const [inviteEmail, setInviteEmail] = useState(() => {
    if (scenario === "invite-validation") return "not-an-email";
    if (scenario === "invite-retry") return "invitee.retry@example.com";
    return "";
  });
  const [inviteRole, setInviteRole] = useState<MemberRole>("member");
  const [inviteFieldError, setInviteFieldError] = useState<"required" | "invalid" | null>(
    () => (scenario === "invite-validation" ? "invalid" : null),
  );
  const [inviteRequestError, setInviteRequestError] = useState(() => scenario === "invite-retry");
  const [invitePageSuccess, setInvitePageSuccess] = useState(() => scenario === "invite-success");
  const [selectedRecord, setSelectedRecord] = useState<RecordReference | null>(() =>
    initialDetailFor(scenario, viewportMode),
  );
  const [roleDraft, setRoleDraft] = useState<MemberRole>(() => {
    if (scenario === "role-save-failure" || scenario === "unsaved-close-guard") return "admin";
    if (scenario === "role-save-success") return "admin";
    return "member";
  });
  const [roleRequestError, setRoleRequestError] = useState(() => scenario === "role-save-failure");
  const [roleSaveSuccess, setRoleSaveSuccess] = useState(() => scenario === "role-save-success");
  const [saveFailureAvailable, setSaveFailureAvailable] = useState(
    () => scenario === "member-detail",
  );
  const [confirmationOpen, setConfirmationOpen] = useState(
    () => scenario === "unsaved-close-guard" && initialDetailFor(scenario, viewportMode) !== null,
  );
  const [viewportIsNarrow, setViewportIsNarrow] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(max-width: 1199px)").matches;
  });

  const shellRootRef = useRef<HTMLDivElement>(null);
  const detailHostRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const invitationCounter = useRef(scenario === "invite-success" ? 4 : 3);

  const layoutVariant: "wide" | "narrow" =
    viewportMode === "compact" || (viewportMode === "auto" && viewportIsNarrow)
      ? "narrow"
      : "wide";
  const detailAvailable = viewportMode !== "compact" && !viewportIsNarrow;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1199px)");
    const update = () => setViewportIsNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const attributes = ["data-theme", "data-language", "data-layout", "dir"];
    const before = new Map(attributes.map((attribute) => [attribute, root.getAttribute(attribute)]));

    root.setAttribute("data-theme", theme);
    root.setAttribute("data-language", language);
    root.setAttribute("data-layout", layoutVariant);
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

    return () => {
      for (const attribute of attributes) {
        const previous = before.get(attribute);
        if (previous === null || previous === undefined) root.removeAttribute(attribute);
        else root.setAttribute(attribute, previous);
      }
    };
  }, [language, layoutVariant, theme]);

  useEffect(() => {
    const shell = shellRootRef.current;
    if (!shell) return;
    if (selectedRecord) shell.setAttribute("inert", "");
    else shell.removeAttribute("inert");
    return () => shell.removeAttribute("inert");
  }, [selectedRecord]);

  useEffect(() => {
    if (selectedRecord) {
      if (!confirmationOpen && detailHostRef.current) focusFirst(detailHostRef.current);
      return;
    }

    if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    returnFocusRef.current = null;
  }, [selectedRecord?.id]);

  const currentMember =
    selectedRecord?.kind === "member"
      ? members.find((member) => member.id === selectedRecord.id) ?? null
      : null;
  const currentInvitation =
    selectedRecord?.kind === "invitation"
      ? invitations.find((invitation) => invitation.id === selectedRecord.id) ?? null
      : null;
  const roleIsDirty = currentMember !== null && roleDraft !== currentMember.role;

  const activeCount = members.length;
  const invitedCount = invitations.length;
  const localizedNumber = (value: number) => new Intl.NumberFormat(language).format(value);

  const normalizedSearch = search.trim().toLocaleLowerCase(language);
  const filteredMembers = members.filter((member) => {
    if (!normalizedSearch) return true;
    return (
      member.name.toLocaleLowerCase(language).includes(normalizedSearch) ||
      (member.email?.toLocaleLowerCase(language).includes(normalizedSearch) ?? false)
    );
  });
  const filteredInvitations = invitations.filter((invitation) => {
    if (!normalizedSearch) return true;
    return invitation.email.toLocaleLowerCase(language).includes(normalizedSearch);
  });
  const resultCount = filteredMembers.length + filteredInvitations.length;

  const invitationRoleOptions = [
    { value: "member", label: copy.memberRole },
    { value: "admin", label: copy.adminRole },
  ] as const;

  function openInvitationDialog() {
    setInviteEmail("");
    setInviteRole("member");
    setInviteFieldError(null);
    setInviteRequestError(false);
    setInviteOpen(true);
  }

  function closeInvitationDialog() {
    setInviteOpen(false);
  }

  function submitInvitation() {
    const email = inviteEmail.trim();
    if (!email) {
      setInviteFieldError("required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteFieldError("invalid");
      return;
    }

    setInviteFieldError(null);
    const invitation: Invitation = {
      id: `invitation-${invitationCounter.current++}`,
      email,
      role: inviteRole,
    };
    setInvitations((current) => [...current, invitation]);
    setInviteRequestError(false);
    setInvitePageSuccess(true);
    setInviteOpen(false);
  }

  function openRecordDetail(
    reference: RecordReference,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) {
    if (!detailAvailable) return;
    returnFocusRef.current = event.currentTarget;
    setSelectedRecord(reference);
    setRoleRequestError(false);
    setRoleSaveSuccess(false);
    if (reference.kind === "member") {
      const member = members.find((item) => item.id === reference.id);
      setRoleDraft(member?.role ?? "member");
    }
  }

  function requestCloseDetail() {
    if (roleIsDirty) {
      setConfirmationOpen(true);
      return;
    }
    setSelectedRecord(null);
  }

  function saveRole() {
    if (!currentMember || !roleIsDirty) return;
    if (saveFailureAvailable) {
      setSaveFailureAvailable(false);
      setRoleRequestError(true);
      setRoleSaveSuccess(false);
      return;
    }
    setMembers((current) =>
      current.map((member) =>
        member.id === currentMember.id ? { ...member, role: roleDraft } : member,
      ),
    );
    setRoleRequestError(false);
    setRoleSaveSuccess(true);
  }

  function keepEditing() {
    setConfirmationOpen(false);
  }

  function discardRoleChanges() {
    if (currentMember) setRoleDraft(currentMember.role);
    setConfirmationOpen(false);
    setRoleRequestError(false);
    setRoleSaveSuccess(false);
    setSelectedRecord(null);
  }

  function handleDetailKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (confirmationOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      requestCloseDetail();
      return;
    }
    if (event.key !== "Tab" || !detailHostRef.current) return;

    const host = detailHostRef.current;
    const focusable = Array.from(
      host.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(isFocusTarget);
    const first = focusable[0];
    const last = focusable.at(-1);
    const active = document.activeElement;

    if (!first || !last) {
      event.preventDefault();
      host.focus();
    } else if (event.shiftKey && (active === first || active === host)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === host)) {
      event.preventDefault();
      first.focus();
    }
  }

  const tableRows = [
    ...filteredMembers.map((member) => ({
      id: member.id,
      primary: (
        <div className="team-evaluation__identity">
          <Avatar initials={member.initials} size="sm" />
          <span className="team-evaluation__identity-name">{member.name}</span>
          {member.email && (
            <bdi className="team-evaluation__identity-email" dir="ltr">
              {member.email}
            </bdi>
          )}
        </div>
      ),
      secondary: roleLabel(member.role, language),
      status: <StatusBadge label={copy.active} />,
      action: (
        <Button
          aria-label={copy.viewMemberFor(member.name)}
          disabled={!detailAvailable}
          emphasis="text"
          onClick={(event) => openRecordDetail({ kind: "member", id: member.id }, event)}
        >
          {copy.viewMember}
        </Button>
      ),
      selected: selectedRecord?.kind === "member" && selectedRecord.id === member.id,
    })),
    ...filteredInvitations.map((invitation) => ({
      id: invitation.id,
      primary: (
        <span className="team-evaluation__identity-email" dir="ltr">
          {invitation.email}
        </span>
      ),
      secondary: roleLabel(invitation.role, language),
      status: <StatusBadge label={copy.invitationPending} />,
      action: (
        <Button
          aria-label={copy.viewInvitationFor(invitation.email)}
          disabled={!detailAvailable}
          emphasis="text"
          onClick={(event) => openRecordDetail({ kind: "invitation", id: invitation.id }, event)}
        >
          {copy.viewInvitation}
        </Button>
      ),
      selected:
        selectedRecord?.kind === "invitation" && selectedRecord.id === invitation.id,
    })),
  ];

  const invitationFieldError =
    inviteFieldError === "required"
      ? copy.emailRequired
      : inviteFieldError === "invalid"
        ? copy.emailInvalid
        : undefined;

  const shell = (
    <ApplicationShell
      sidebar={
        <Sidebar
          currentId="team"
          items={[
            {
              id: "team",
              label: copy.team,
              href: "#team-directory",
              icon: <TeamNavigationIcon />,
            },
          ]}
          label={copy.workspace}
        />
      }
      topNavbar={
        <TopNavbar
          brand={<span className="team-evaluation__brand" dir="ltr">Northstar</span>}
          contextLabel={copy.shellContext}
        />
      }
      pageHeading={
        <PageHeading
          actions={<Button onClick={openInvitationDialog}>{copy.inviteMember}</Button>}
          description={copy.pageDescription}
          title={copy.pageTitle}
        />
      }
      viewportMode={viewportMode}
    >
      <div className="team-evaluation__page" id="team-directory">
        {invitePageSuccess && (
          <InlineFeedback
            intent="success"
            message={copy.inviteSuccessMessage}
            title={copy.inviteSuccessTitle}
          />
        )}

        <section aria-label={copy.searchLabel} className="team-evaluation__directory-controls">
          <div className="team-evaluation__search">
            <SearchField
              aria-label={copy.searchLabel}
              clearButtonLabel={copy.clearSearch}
              dir={search.includes("@") ? "ltr" : undefined}
              onChange={(event) => setSearch(event.currentTarget.value)}
              onClear={() => setSearch("")}
              placeholder={copy.searchPlaceholder}
              value={search}
            />
          </div>
          <div aria-live="polite" className="team-evaluation__summary" role="status">
            <span>{copy.activeCount(localizedNumber(activeCount))}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.invitedCount(localizedNumber(invitedCount))}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.resultCount(localizedNumber(resultCount))}</span>
          </div>
        </section>

        {!detailAvailable && (
          <p className="team-evaluation__authority-note" role="note">
            {copy.detailUnavailable}
          </p>
        )}

        <section aria-label={copy.team} className="team-evaluation__results">
          {resultCount > 0 ? (
            <div className="team-evaluation__table-overflow">
              <Table
                actionLabel={copy.action}
                primaryLabel={copy.person}
                rows={tableRows}
                secondaryLabel={copy.role}
                statusLabel={copy.status}
              />
            </div>
          ) : (
            <EmptyState
              actions={
                <Button emphasis="secondary" onClick={() => setSearch("")}>{copy.clearSearch}</Button>
              }
              body={copy.noPeopleBody}
              title={copy.noPeopleTitle}
            />
          )}
        </section>
      </div>
    </ApplicationShell>
  );

  return (
    <div
      className="team-evaluation"
      data-language={language}
      data-layout={layoutVariant}
      data-theme={theme}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div
        aria-hidden={selectedRecord ? true : undefined}
        className="team-evaluation__shell"
        ref={shellRootRef}
      >
        {shell}
      </div>

      {selectedRecord && (
        <div
          aria-label={
            currentMember
              ? copy.detailForMember(currentMember.name)
              : copy.detailForInvitation(currentInvitation?.email ?? "")
          }
          aria-modal="true"
          className="team-evaluation__detail-host"
          onKeyDown={handleDetailKeyDown}
          ref={detailHostRef}
          role="dialog"
          tabIndex={-1}
        >
          <SidePanel
            actions={
              currentMember ? (
                <Button disabled={!roleIsDirty} onClick={saveRole}>
                  {roleRequestError ? copy.retrySave : copy.saveChanges}
                </Button>
              ) : undefined
            }
            closeLabel={copy.closeDetails}
            eyebrow={currentMember ? copy.memberDetail : copy.invitationDetail}
            header={
              currentMember ? (
                <div className="team-evaluation__detail-identity">
                  <Avatar initials={currentMember.initials} size="lg" />
                  <div>
                    <h2 className="team-evaluation__detail-name">{currentMember.name}</h2>
                    <p className="team-evaluation__detail-subtitle">{copy.team}</p>
                  </div>
                </div>
              ) : (
                <div className="team-evaluation__detail-identity">
                  <div>
                    <h2 className="team-evaluation__detail-name" dir="ltr">
                      {currentInvitation?.email}
                    </h2>
                    <p className="team-evaluation__detail-subtitle">{copy.invitationPending}</p>
                  </div>
                </div>
              )
            }
            onClose={requestCloseDetail}
            showClose
            style={{
              blockSize: "100%",
              inlineSize: "var(--dse-layout-wide-detail-available-width)",
              minBlockSize: "100%",
            }}
          >
            {currentMember ? (
              <div className="team-evaluation__detail-content">
                <div className="team-evaluation__detail-field">
                  <span className="team-evaluation__detail-label">{copy.status}</span>
                  <StatusBadge label={copy.active} />
                </div>
                <RadioGroup
                  label={copy.role}
                  name="member-role"
                  onValueChange={(value) => {
                    setRoleDraft(value as MemberRole);
                    setRoleRequestError(false);
                    setRoleSaveSuccess(false);
                  }}
                  options={invitationRoleOptions}
                  required
                  value={roleDraft}
                />
                {roleRequestError && (
                  <InlineFeedback
                    intent="error"
                    message={copy.saveFailureMessage}
                    title={copy.saveFailureTitle}
                  />
                )}
                {roleSaveSuccess && (
                  <InlineFeedback
                    intent="success"
                    message={copy.saveSuccessMessage}
                    title={copy.saveSuccessTitle}
                  />
                )}
              </div>
            ) : (
              <dl className="team-evaluation__detail-content">
                <div className="team-evaluation__detail-field">
                  <dt className="team-evaluation__detail-label">{copy.invitationEmail}</dt>
                  <dd className="team-evaluation__detail-value" dir="ltr">
                    {currentInvitation?.email}
                  </dd>
                </div>
                <div className="team-evaluation__detail-field">
                  <dt className="team-evaluation__detail-label">{copy.status}</dt>
                  <dd>
                    <StatusBadge label={copy.invitationPending} />
                  </dd>
                </div>
                <div className="team-evaluation__detail-field">
                  <dt className="team-evaluation__detail-label">{copy.role}</dt>
                  <dd className="team-evaluation__detail-value">
                    {roleLabel(currentInvitation?.role ?? "member", language)}
                  </dd>
                </div>
              </dl>
            )}
          </SidePanel>
        </div>
      )}

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={closeInvitationDialog}>
              {copy.cancel}
            </Button>
            <Button onClick={submitInvitation}>
              {inviteRequestError ? copy.retryInvite : copy.sendInvite}
            </Button>
          </>
        }
        closeLabel={copy.closeInvite}
        description={copy.inviteDialogDescription}
        onOpenChange={(open) => setInviteOpen(open)}
        open={inviteOpen}
        title={copy.inviteDialogTitle}
      >
        <div className="team-evaluation__invite-form">
          {inviteRequestError && (
            <InlineFeedback
              intent="error"
              message={copy.inviteFailureMessage}
              title={copy.inviteFailureTitle}
            />
          )}
          <TextField
            autoComplete="email"
            dir="ltr"
            errorMessage={invitationFieldError}
            id="team-invite-email"
            invalid={inviteFieldError !== null}
            label={copy.emailAddress}
            onChange={(event) => {
              setInviteEmail(event.currentTarget.value);
              setInviteFieldError(null);
            }}
            placeholder={copy.emailPlaceholder}
            required
            type="email"
            value={inviteEmail}
          />
          <RadioGroup
            label={copy.inviteRole}
            name="invite-role"
            onValueChange={(value) => setInviteRole(value as MemberRole)}
            options={invitationRoleOptions}
            required
            value={inviteRole}
          />
        </div>
      </Dialog>

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={keepEditing}>
              {copy.keepEditing}
            </Button>
            <Button onClick={discardRoleChanges} tone="critical">
              {copy.discardChanges}
            </Button>
          </>
        }
        closeLabel={copy.closeConfirmation}
        onOpenChange={(open) => {
          if (!open) keepEditing();
        }}
        open={confirmationOpen}
        title={copy.discardDialogTitle}
      >
        <p className="team-evaluation__confirmation-copy">{copy.discardDialogDescription}</p>
      </Dialog>
    </div>
  );
}
