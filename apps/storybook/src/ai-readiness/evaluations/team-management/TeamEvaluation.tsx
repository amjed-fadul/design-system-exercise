import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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
} from "@design-system-exercise/react";
import { ApplicationShell } from "@design-system-exercise/patterns";

import "./TeamEvaluation.css";

export type TeamRole = "Member" | "Admin";
export type TeamLocale = "en" | "ar";
export type TeamTheme = "light" | "dark";
export type TeamViewportMode = "auto" | "expanded" | "compact";

export interface InviteMemberRequest {
  email: string;
  role: TeamRole;
}

export interface SaveMemberRoleRequest {
  memberId: string;
  role: TeamRole;
}

export interface TeamEvaluationProps {
  locale?: TeamLocale;
  theme?: TeamTheme;
  viewportMode?: TeamViewportMode;
  initialQuery?: string;
  inviteMember?: (request: InviteMemberRequest) => Promise<void>;
  saveMemberRole?: (request: SaveMemberRoleRequest) => Promise<void>;
}

interface PersonRecord {
  id: string;
  name?: string;
  email?: string;
  initials?: string;
  role: TeamRole;
  status: "active" | "invited";
}

interface TeamCopy {
  workspaceContext: string;
  workspaceNavigation: string;
  overviewNav: string;
  projectsNav: string;
  teamNav: string;
  settingsNav: string;
  accountName: string;
  pageTitle: string;
  pageDescription: string;
  workspaceBreadcrumb: string;
  breadcrumbLabel: string;
  inviteMember: string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  person: string;
  role: string;
  status: string;
  details: string;
  active: string;
  invitationPending: string;
  memberRole: string;
  adminRole: string;
  memberRoleDescription: string;
  adminRoleDescription: string;
  noPeopleTitle: string;
  noPeopleBody: (query: string) => string;
  resultSummary: (active: number, invited: number) => string;
  detailsFor: (identity: string) => string;
  inviteTitle: string;
  inviteDescription: string;
  closeInvite: string;
  emailAddress: string;
  emailPlaceholder: string;
  emailGuidance: string;
  invalidEmail: string;
  chooseRole: string;
  cancel: string;
  sendInvitation: string;
  sendingInvitation: string;
  retryInvitation: string;
  inviteErrorTitle: string;
  inviteErrorMessage: string;
  inviteSuccessTitle: string;
  inviteSuccessMessage: (email: string) => string;
  memberDetails: string;
  memberDetailsLabel: (identity: string) => string;
  closeMemberDetails: string;
  editRole: string;
  saveRole: string;
  savingRole: string;
  saveErrorTitle: string;
  saveErrorMessage: string;
  saveSuccessTitle: string;
  saveSuccessMessage: (identity: string) => string;
  discardTitle: string;
  discardDescription: string;
  closeDiscardDialog: string;
  keepEditing: string;
  discardChanges: string;
}

const COPY: Record<TeamLocale, TeamCopy> = {
  en: {
    workspaceContext: "Workspace administration",
    workspaceNavigation: "WORKSPACE",
    overviewNav: "Overview",
    projectsNav: "Projects",
    teamNav: "Team",
    settingsNav: "Settings",
    accountName: "Amal Hassan",
    pageTitle: "Team & access",
    pageDescription: "Manage workspace members, invitations, and access roles.",
    workspaceBreadcrumb: "Workspace",
    breadcrumbLabel: "Breadcrumbs",
    inviteMember: "Invite member",
    searchLabel: "Search people",
    searchPlaceholder: "Search by name or email",
    clearSearch: "Clear search",
    person: "Person",
    role: "Role",
    status: "Status",
    details: "Details",
    active: "Active",
    invitationPending: "Invitation pending",
    memberRole: "Member",
    adminRole: "Admin",
    memberRoleDescription: "Can work in the workspace without managing access.",
    adminRoleDescription: "Can manage members, invitations, and workspace settings.",
    noPeopleTitle: "No people found",
    noPeopleBody: (query) =>
      `No names or email addresses match “${query}”. Try a different search or clear it to see everyone.`,
    resultSummary: (active, invited) => `${active} active · ${invited} invited`,
    detailsFor: (identity) => `View details for ${identity}`,
    inviteTitle: "Invite a member",
    inviteDescription: "Send one person an invitation and choose their workspace role.",
    closeInvite: "Close invite dialog",
    emailAddress: "Email address",
    emailPlaceholder: "name@example.com",
    emailGuidance: "The invitation will be sent to this address.",
    invalidEmail: "Enter a valid email address.",
    chooseRole: "Choose a role",
    cancel: "Cancel",
    sendInvitation: "Send invitation",
    sendingInvitation: "Sending invitation…",
    retryInvitation: "Retry invitation",
    inviteErrorTitle: "Invitation not sent",
    inviteErrorMessage: "Your entries are still here. Check the address or try again.",
    inviteSuccessTitle: "Invitation sent",
    inviteSuccessMessage: (email) => `${email} was added as a pending invitation.`,
    memberDetails: "MEMBER DETAILS",
    memberDetailsLabel: (identity) => `Member details: ${identity}`,
    closeMemberDetails: "Close member details",
    editRole: "Edit role",
    saveRole: "Save role",
    savingRole: "Saving role…",
    saveErrorTitle: "Role not saved",
    saveErrorMessage: "The saved role has not changed. Review your selection and try again.",
    saveSuccessTitle: "Role updated",
    saveSuccessMessage: (identity) => `${identity} now has the selected workspace role.`,
    discardTitle: "Discard unsaved role change?",
    discardDescription: "The selected role has not been saved. Discard it or keep editing.",
    closeDiscardDialog: "Close discard changes dialog",
    keepEditing: "Keep editing",
    discardChanges: "Discard changes",
  },
  ar: {
    workspaceContext: "إدارة مساحة العمل",
    workspaceNavigation: "مساحة العمل",
    overviewNav: "نظرة عامة",
    projectsNav: "المشاريع",
    teamNav: "الفريق",
    settingsNav: "الإعدادات",
    accountName: "أمل حسن",
    pageTitle: "الفريق والصلاحيات",
    pageDescription: "إدارة أعضاء مساحة العمل والدعوات وأدوار الوصول.",
    workspaceBreadcrumb: "مساحة العمل",
    breadcrumbLabel: "مسار التنقل",
    inviteMember: "دعوة عضو",
    searchLabel: "البحث عن أشخاص",
    searchPlaceholder: "البحث بالاسم أو البريد الإلكتروني",
    clearSearch: "مسح البحث",
    person: "الشخص",
    role: "الدور",
    status: "الحالة",
    details: "التفاصيل",
    active: "نشط",
    invitationPending: "الدعوة معلّقة",
    memberRole: "عضو",
    adminRole: "مسؤول",
    memberRoleDescription: "يمكنه العمل في مساحة العمل دون إدارة الصلاحيات.",
    adminRoleDescription: "يمكنه إدارة الأعضاء والدعوات وإعدادات مساحة العمل.",
    noPeopleTitle: "لم يتم العثور على أشخاص",
    noPeopleBody: (query) =>
      `لا توجد أسماء أو عناوين بريد إلكتروني تطابق «${query}». جرّب بحثًا آخر أو امسحه لعرض الجميع.`,
    resultSummary: (active, invited) => `${active} نشط · ${invited} مدعو`,
    detailsFor: (identity) => `عرض تفاصيل ${identity}`,
    inviteTitle: "دعوة عضو",
    inviteDescription: "أرسل دعوة إلى شخص واحد واختر دوره في مساحة العمل.",
    closeInvite: "إغلاق نافذة الدعوة",
    emailAddress: "البريد الإلكتروني",
    emailPlaceholder: "name@example.com",
    emailGuidance: "ستُرسل الدعوة إلى هذا العنوان.",
    invalidEmail: "أدخل عنوان بريد إلكتروني صالحًا.",
    chooseRole: "اختر دورًا",
    cancel: "إلغاء",
    sendInvitation: "إرسال الدعوة",
    sendingInvitation: "جارٍ إرسال الدعوة…",
    retryInvitation: "إعادة محاولة الدعوة",
    inviteErrorTitle: "لم تُرسل الدعوة",
    inviteErrorMessage: "ما زالت بياناتك محفوظة. تحقق من العنوان أو حاول مرة أخرى.",
    inviteSuccessTitle: "أُرسلت الدعوة",
    inviteSuccessMessage: (email) => `أُضيف ${email} كدعوة معلّقة.`,
    memberDetails: "تفاصيل العضو",
    memberDetailsLabel: (identity) => `تفاصيل العضو: ${identity}`,
    closeMemberDetails: "إغلاق تفاصيل العضو",
    editRole: "تعديل الدور",
    saveRole: "حفظ الدور",
    savingRole: "جارٍ حفظ الدور…",
    saveErrorTitle: "لم يُحفظ الدور",
    saveErrorMessage: "لم يتغير الدور المحفوظ. راجع اختيارك وحاول مرة أخرى.",
    saveSuccessTitle: "تم تحديث الدور",
    saveSuccessMessage: (identity) => `أصبح دور ${identity} هو الدور المحدد في مساحة العمل.`,
    discardTitle: "هل تريد تجاهل تغيير الدور غير المحفوظ؟",
    discardDescription: "لم يُحفظ الدور المحدد. يمكنك تجاهله أو متابعة التعديل.",
    closeDiscardDialog: "إغلاق نافذة تجاهل التغييرات",
    keepEditing: "متابعة التعديل",
    discardChanges: "تجاهل التغييرات",
  },
};

const INITIAL_PEOPLE: PersonRecord[] = [
  { id: "amal-hassan", name: "Amal Hassan", initials: "AH", role: "Admin", status: "active" },
  { id: "sara-ahmed", name: "Sara Ahmed", initials: "SA", role: "Member", status: "active" },
  { id: "omar-khalid", name: "Omar Khalid", initials: "OK", role: "Member", status: "active" },
  { id: "invitee-one", email: "invitee.one@example.com", role: "Member", status: "invited" },
  { id: "invitee-two", email: "invitee.two@example.com", role: "Member", status: "invited" },
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const successfulInvite = () => Promise.resolve();
const successfulRoleSave = () => Promise.resolve();

function EvaluationIcon({ name }: { name: "home" | "projects" | "team" | "settings" | "brand" }) {
  const paths = {
    home: <path d="M3 9.5 10 3l7 6.5V17H6V9.5" />,
    projects: <path d="M3 5.5h6l2 2h6v9H3z" />,
    team: (
      <>
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="14" cy="8" r="2" />
        <path d="M2.5 17c.5-3 2-4.5 4.5-4.5s4 1.5 4.5 4.5M11.5 13c2.8-.7 5 .7 6 3.5" />
      </>
    ),
    settings: (
      <>
        <circle cx="10" cy="10" r="3" />
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
      </>
    ),
    brand: <path d="m10 2 1.7 6.3L18 10l-6.3 1.7L10 18l-1.7-6.3L2 10l6.3-1.7z" />,
  };

  return (
    <svg className="team-evaluation__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="var(--dse-icons-stroke-default)"
      >
        {paths[name]}
      </g>
    </svg>
  );
}

function identityOf(person: PersonRecord) {
  return person.name ?? person.email ?? "";
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

export function TeamEvaluation({
  locale = "en",
  theme = "light",
  viewportMode = "expanded",
  initialQuery = "",
  inviteMember = successfulInvite,
  saveMemberRole = successfulRoleSave,
}: TeamEvaluationProps) {
  const t = COPY[locale];
  const [people, setPeople] = useState<PersonRecord[]>(INITIAL_PEOPLE);
  const [query, setQuery] = useState(initialQuery);
  const [pageFeedback, setPageFeedback] = useState<{ email: string } | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Member");
  const [inviteInvalid, setInviteInvalid] = useState(false);
  const [invitePhase, setInvitePhase] = useState<"idle" | "pending" | "error">("idle");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<TeamRole>("Member");
  const [savePhase, setSavePhase] = useState<"idle" | "pending" | "error" | "success">("idle");
  const [discardOpen, setDiscardOpen] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const detailHostRef = useRef<HTMLDivElement>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const detailWasOpenRef = useRef(false);
  const keepEditingRef = useRef<HTMLButtonElement>(null);

  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filteredPeople = useMemo(
    () =>
      people.filter((person) => {
        if (!normalizedQuery) return true;
        return [person.name, person.email].some((value) =>
          value?.toLocaleLowerCase(locale).includes(normalizedQuery),
        );
      }),
    [locale, normalizedQuery, people],
  );

  const activeCount = filteredPeople.filter((person) => person.status === "active").length;
  const invitedCount = filteredPeople.filter((person) => person.status === "invited").length;
  const selectedPerson = people.find((person) => person.id === selectedId) ?? null;
  const detailDirty = Boolean(selectedPerson && selectedPerson.role !== draftRole);

  useEffect(() => {
    const documentRoot = document.documentElement;
    const previous = {
      direction: documentRoot.getAttribute("dir"),
      language: documentRoot.getAttribute("lang"),
      theme: documentRoot.getAttribute("data-theme"),
      languageMode: documentRoot.getAttribute("data-language"),
    };

    documentRoot.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    documentRoot.setAttribute("lang", locale);
    documentRoot.setAttribute("data-theme", theme);
    documentRoot.setAttribute("data-language", locale === "ar" ? "arabic" : "english");

    return () => {
      const restore = (name: string, value: string | null) => {
        if (value === null) documentRoot.removeAttribute(name);
        else documentRoot.setAttribute(name, value);
      };
      restore("dir", previous.direction);
      restore("lang", previous.language);
      restore("data-theme", previous.theme);
      restore("data-language", previous.languageMode);
    };
  }, [locale, theme]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    if (selectedId) {
      shell.setAttribute("inert", "");
      shell.setAttribute("aria-hidden", "true");
    } else {
      shell.removeAttribute("inert");
      shell.removeAttribute("aria-hidden");
    }

    return () => {
      shell.removeAttribute("inert");
      shell.removeAttribute("aria-hidden");
    };
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      detailWasOpenRef.current = true;
      const host = detailHostRef.current;
      const target = host?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? host;
      target?.focus();
      return;
    }

    if (detailWasOpenRef.current) {
      detailWasOpenRef.current = false;
      detailTriggerRef.current?.focus();
    }
  }, [selectedId]);

  const openInvite = () => {
    setInviteEmail("");
    setInviteRole("Member");
    setInviteInvalid(false);
    setInvitePhase("idle");
    setInviteOpen(true);
  };

  const closeInvite = () => {
    setInviteOpen(false);
    setInvitePhase("idle");
    setInviteInvalid(false);
  };

  const submitInvite = async (event?: FormEvent) => {
    event?.preventDefault();
    const email = inviteEmail.trim();

    if (!isValidEmail(email)) {
      setInviteInvalid(true);
      setInvitePhase("idle");
      return;
    }

    setInviteInvalid(false);
    setInvitePhase("pending");

    try {
      await inviteMember({ email, role: inviteRole });
      setPeople((current) => [
        ...current,
        {
          id: `invited-${email.toLocaleLowerCase("en-US")}`,
          email,
          role: inviteRole,
          status: "invited",
        },
      ]);
      setPageFeedback({ email });
      closeInvite();
    } catch {
      setInvitePhase("error");
    }
  };

  const openDetails = (person: PersonRecord, trigger: HTMLButtonElement) => {
    detailTriggerRef.current = trigger;
    setSelectedId(person.id);
    setDraftRole(person.role);
    setSavePhase("idle");
    setDiscardOpen(false);
  };

  const closeDetails = () => {
    setSelectedId(null);
    setSavePhase("idle");
    setDiscardOpen(false);
  };

  const requestDetailClose = () => {
    if (detailDirty) {
      setDiscardOpen(true);
      return;
    }
    closeDetails();
  };

  const saveRole = async () => {
    if (!selectedPerson || !detailDirty) return;
    setSavePhase("pending");

    try {
      await saveMemberRole({ memberId: selectedPerson.id, role: draftRole });
      setPeople((current) =>
        current.map((person) =>
          person.id === selectedPerson.id ? { ...person, role: draftRole } : person,
        ),
      );
      setSavePhase("success");
    } catch {
      setSavePhase("error");
    }
  };

  const handleDetailKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (discardOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      requestDetailClose();
      return;
    }

    if (event.key !== "Tab") return;
    const host = detailHostRef.current;
    if (!host) return;
    const focusable = Array.from(host.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) {
      event.preventDefault();
      host.focus();
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

  const roleOptions = [
    { value: "Member", label: t.memberRole, description: t.memberRoleDescription },
    { value: "Admin", label: t.adminRole, description: t.adminRoleDescription },
  ] as const;

  const tableRows = filteredPeople.map((person) => {
    const identity = identityOf(person);
    return {
      id: person.id,
      primary: (
        <div className="team-evaluation__identity">
          <Avatar initials={person.initials} />
          {person.email ? (
            <span className="team-evaluation__email" dir="ltr">
              {person.email}
            </span>
          ) : (
            <span>{person.name}</span>
          )}
        </div>
      ),
      secondary: person.role === "Admin" ? t.adminRole : t.memberRole,
      status: (
        <StatusBadge label={person.status === "active" ? t.active : t.invitationPending} />
      ),
      action:
        person.status === "active" ? (
          <Button
            emphasis="text"
            aria-label={t.detailsFor(identity)}
            onClick={(event) => openDetails(person, event.currentTarget)}
          >
            {t.details}
          </Button>
        ) : null,
      selected: selectedId === person.id,
    };
  });

  const navigationItems = [
    { id: "overview", label: t.overviewNav, href: "#overview", icon: <EvaluationIcon name="home" /> },
    {
      id: "projects",
      label: t.projectsNav,
      href: "#projects",
      icon: <EvaluationIcon name="projects" />,
    },
    { id: "team", label: t.teamNav, href: "#team", icon: <EvaluationIcon name="team" /> },
    {
      id: "settings",
      label: t.settingsNav,
      href: "#settings",
      icon: <EvaluationIcon name="settings" />,
    },
  ];

  return (
    <div
      className="team-evaluation"
      data-language={locale === "ar" ? "arabic" : "english"}
      data-layout-mode={viewportMode}
      data-testid="team-evaluation"
      data-theme={theme}
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      <div ref={shellRef} className="team-evaluation__shell">
        <ApplicationShell
          viewportMode={viewportMode}
          topNavbar={
            <TopNavbar
              contextLabel={t.workspaceContext}
              brand={
                <div className="team-evaluation__brand">
                  <EvaluationIcon name="brand" />
                  <span className="team-evaluation__brand-word" dir="ltr">
                    Northstar
                  </span>
                </div>
              }
              account={
                <div className="team-evaluation__account">
                  <span>{t.accountName}</span>
                  <Avatar initials={locale === "ar" ? "أح" : "AH"} />
                </div>
              }
            />
          }
          sidebar={
            <Sidebar
              mode={viewportMode === "auto" ? undefined : viewportMode}
              label={t.workspaceNavigation}
              items={navigationItems}
              currentId="team"
            />
          }
          pageHeading={
            <PageHeading
              title={t.pageTitle}
              description={t.pageDescription}
              breadcrumbs={
                <Breadcrumbs
                  ancestors={[{ label: t.workspaceBreadcrumb, href: "#workspace" }]}
                  currentLabel={t.pageTitle}
                  ariaLabel={t.breadcrumbLabel}
                />
              }
              actions={<Button onClick={openInvite}>{t.inviteMember}</Button>}
            />
          }
        >
          <div className="team-evaluation__directory">
            {pageFeedback ? (
              <InlineFeedback
                intent="success"
                title={t.inviteSuccessTitle}
                message={t.inviteSuccessMessage(pageFeedback.email)}
              />
            ) : null}

            <div className="team-evaluation__controls">
              <div className="team-evaluation__search">
                <SearchField
                  aria-label={t.searchLabel}
                  clearButtonLabel={t.clearSearch}
                  placeholder={t.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  onClear={() => setQuery("")}
                />
              </div>
              <p className="team-evaluation__summary" aria-live="polite">
                {t.resultSummary(activeCount, invitedCount)}
              </p>
            </div>

            <div className="team-evaluation__results">
              {tableRows.length > 0 ? (
                <Table
                  rows={tableRows}
                  primaryLabel={t.person}
                  secondaryLabel={t.role}
                  statusLabel={t.status}
                  actionLabel={t.details}
                />
              ) : (
                <EmptyState
                  title={t.noPeopleTitle}
                  body={t.noPeopleBody(query.trim())}
                  actions={
                    <Button emphasis="secondary" onClick={() => setQuery("")}>
                      {t.clearSearch}
                    </Button>
                  }
                />
              )}
            </div>
          </div>

          <Dialog
            open={inviteOpen}
            onOpenChange={(open) => (open ? setInviteOpen(true) : closeInvite())}
            title={t.inviteTitle}
            description={t.inviteDescription}
            closeLabel={t.closeInvite}
            actions={
              <div className="team-evaluation__actions">
                <Button emphasis="secondary" disabled={invitePhase === "pending"} onClick={closeInvite}>
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  form="team-evaluation-invite-form"
                  loading={invitePhase === "pending"}
                  loadingLabel={t.sendingInvitation}
                >
                  {invitePhase === "error" ? t.retryInvitation : t.sendInvitation}
                </Button>
              </div>
            }
          >
            <form
              id="team-evaluation-invite-form"
              className="team-evaluation__form"
              noValidate
              onSubmit={submitInvite}
            >
              <TextField
                label={t.emailAddress}
                type="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                supportingText={t.emailGuidance}
                value={inviteEmail}
                onChange={(event) => {
                  setInviteEmail(event.currentTarget.value);
                  if (inviteInvalid) setInviteInvalid(false);
                  if (invitePhase === "error") setInvitePhase("idle");
                }}
                invalid={inviteInvalid}
                errorMessage={t.invalidEmail}
                required
                disabled={invitePhase === "pending"}
                dir="ltr"
              />
              <RadioGroup
                label={t.chooseRole}
                name="invite-role"
                options={roleOptions}
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value as TeamRole)}
                required
              />
              {invitePhase === "error" ? (
                <InlineFeedback
                  intent="error"
                  title={t.inviteErrorTitle}
                  message={t.inviteErrorMessage}
                />
              ) : null}
            </form>
          </Dialog>
        </ApplicationShell>
      </div>

      {selectedPerson ? (
        <div
          ref={detailHostRef}
          className="team-evaluation__detail-host"
          role="dialog"
          aria-modal="true"
          aria-label={t.memberDetailsLabel(identityOf(selectedPerson))}
          tabIndex={-1}
          onKeyDown={handleDetailKeyDown}
        >
          <SidePanel
            className="team-evaluation__detail-panel"
            eyebrow={t.memberDetails}
            closeLabel={t.closeMemberDetails}
            onClose={requestDetailClose}
            header={
              <div className="team-evaluation__detail-identity">
                <Avatar initials={selectedPerson.initials} size="lg" />
                <div>
                  <h2 className="team-evaluation__detail-name">{selectedPerson.name}</h2>
                  <StatusBadge label={t.active} />
                </div>
              </div>
            }
            actions={
              <div className="team-evaluation__actions">
                <Button emphasis="secondary" disabled={savePhase === "pending"} onClick={requestDetailClose}>
                  {t.cancel}
                </Button>
                <Button
                  loading={savePhase === "pending"}
                  loadingLabel={t.savingRole}
                  disabled={!detailDirty}
                  onClick={saveRole}
                >
                  {t.saveRole}
                </Button>
              </div>
            }
          >
            <div className="team-evaluation__detail-body">
              <RadioGroup
                label={t.editRole}
                name={`member-role-${selectedPerson.id}`}
                options={roleOptions}
                value={draftRole}
                onValueChange={(value) => {
                  setDraftRole(value as TeamRole);
                  setSavePhase("idle");
                }}
                required
              />
              {savePhase === "error" ? (
                <InlineFeedback
                  intent="error"
                  title={t.saveErrorTitle}
                  message={t.saveErrorMessage}
                />
              ) : null}
              {savePhase === "success" ? (
                <InlineFeedback
                  intent="success"
                  title={t.saveSuccessTitle}
                  message={t.saveSuccessMessage(identityOf(selectedPerson))}
                />
              ) : null}
            </div>
          </SidePanel>

          <Dialog
            open={discardOpen}
            onOpenChange={setDiscardOpen}
            title={t.discardTitle}
            closeLabel={t.closeDiscardDialog}
            initialFocusRef={keepEditingRef}
            actions={
              <div className="team-evaluation__actions">
                <Button ref={keepEditingRef} emphasis="secondary" onClick={() => setDiscardOpen(false)}>
                  {t.keepEditing}
                </Button>
                <Button tone="critical" onClick={closeDetails}>
                  {t.discardChanges}
                </Button>
              </div>
            }
          >
            <p className="team-evaluation__confirmation-copy">{t.discardDescription}</p>
          </Dialog>
        </div>
      ) : null}
    </div>
  );
}
