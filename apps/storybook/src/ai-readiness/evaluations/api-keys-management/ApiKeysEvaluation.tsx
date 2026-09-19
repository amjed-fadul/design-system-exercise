import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
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
  Sidebar,
  SidePanel,
  StatusBadge,
  Table,
  TextField,
  TopNavbar,
} from "@design-system-exercise/react";
import { ApplicationShell } from "@design-system-exercise/patterns";

import "./ApiKeysEvaluation.css";

type Language = "en" | "ar";
type Theme = "light" | "dark";
type ViewportMode = "auto" | "expanded" | "compact";
type AccessScope = "read" | "write";
type KeyStatus = "active" | "revoked";

type ApiKeyRecord = {
  id: string;
  name: string;
  prefix: string;
  scope: AccessScope;
  status: KeyStatus;
  createdBy: string;
  createdAt: string | null;
};

export type ApiKeysEvaluationProps = {
  language?: Language;
  theme?: Theme;
  viewportMode?: ViewportMode;
  initialQuery?: string;
  initialCreateOpen?: boolean;
  initialDetailId?: string;
};

const INITIAL_KEYS: ApiKeyRecord[] = [
  {
    id: "production-deploy",
    name: "Production deploy",
    prefix: "nsk_prod_7H2",
    scope: "write",
    status: "active",
    createdBy: "Amal Hassan",
    createdAt: null,
  },
  {
    id: "analytics-reader",
    name: "Analytics reader",
    prefix: "nsk_analytics_4F9",
    scope: "read",
    status: "active",
    createdBy: "Sara Ahmed",
    createdAt: null,
  },
  {
    id: "legacy-integration",
    name: "Legacy integration",
    prefix: "nsk_legacy_2K1",
    scope: "read",
    status: "revoked",
    createdBy: "Amal Hassan",
    createdAt: null,
  },
];

const copy = {
  en: {
    workspace: "WORKSPACE",
    workspaceAdministration: "Workspace administration",
    overview: "Overview",
    projects: "Projects",
    team: "Team",
    apiKeys: "API keys",
    settings: "Settings",
    accountRole: "Workspace admin",
    breadcrumbs: "Breadcrumbs",
    pageDescription:
      "Create and manage credentials that connect services to your workspace.",
    createKey: "Create API key",
    searchLabel: "Search API keys by name or key prefix",
    searchPlaceholder: "Search by name or prefix",
    clearSearch: "Clear API key search",
    resultOne: "1 API key",
    resultMany: "API keys",
    keyColumn: "API key",
    accessColumn: "Access",
    statusColumn: "Status",
    detailsColumn: "Details",
    details: "View",
    viewDetails: "View details for",
    active: "Active",
    revoked: "Revoked",
    read: "Read only",
    write: "Read and write",
    noResults: "No API keys found",
    noResultsBody: "No names or key prefixes match this search.",
    clearFilters: "Clear search",
    createTitle: "Create API key",
    createDescription:
      "Give the key a recognizable name and choose the access it needs.",
    displayName: "Display name",
    displayNameHelp: "Use a name that identifies the service or integration.",
    displayNamePlaceholder: "For example, Staging deploy",
    displayNameError: "Enter a display name.",
    scope: "Access scope",
    readDescription: "View workspace data without making changes.",
    writeDescription: "View and change workspace data.",
    cancel: "Cancel",
    create: "Create key",
    createdTitle: "API key created",
    createdMessage: "was added to the workspace.",
    detailEyebrow: "API KEY DETAILS",
    detailModalLabel: "API key details",
    closePanel: "Close API key details",
    close: "Close",
    name: "Name",
    prefix: "Key prefix",
    status: "Status",
    createdBy: "Created by",
    createdDate: "Created date",
    dateUnavailable: "Not provided",
    revoke: "Revoke key",
    revokeTitle: "Revoke API key?",
    revokeDescription:
      "This key will stop working immediately. This action cannot be undone.",
    revokeBody: "Services using this key will lose access to the workspace.",
    revokeConfirm: "Revoke API key",
    revokedTitle: "API key revoked",
    revokedMessage: "This key can no longer access the workspace.",
    closeDialog: "Close dialog",
  },
  ar: {
    workspace: "مساحة العمل",
    workspaceAdministration: "إدارة مساحة العمل",
    overview: "نظرة عامة",
    projects: "المشاريع",
    team: "الفريق",
    apiKeys: "مفاتيح API",
    settings: "الإعدادات",
    accountRole: "مسؤول مساحة العمل",
    breadcrumbs: "مسار التنقل",
    pageDescription:
      "أنشئ بيانات الاعتماد التي تربط الخدمات بمساحة العمل وأدِرها.",
    createKey: "إنشاء مفتاح API",
    searchLabel: "البحث عن مفاتيح API بالاسم أو بادئة المفتاح",
    searchPlaceholder: "ابحث بالاسم أو البادئة",
    clearSearch: "مسح البحث عن مفاتيح API",
    resultOne: "مفتاح API واحد",
    resultMany: "مفاتيح API",
    keyColumn: "مفتاح API",
    accessColumn: "الوصول",
    statusColumn: "الحالة",
    detailsColumn: "التفاصيل",
    details: "عرض",
    viewDetails: "عرض تفاصيل",
    active: "نشط",
    revoked: "ملغى",
    read: "قراءة فقط",
    write: "قراءة وكتابة",
    noResults: "لم يتم العثور على مفاتيح API",
    noResultsBody: "لا توجد أسماء أو بادئات مفاتيح تطابق هذا البحث.",
    clearFilters: "مسح البحث",
    createTitle: "إنشاء مفتاح API",
    createDescription: "امنح المفتاح اسماً واضحاً واختر مستوى الوصول المطلوب.",
    displayName: "اسم العرض",
    displayNameHelp: "استخدم اسماً يعرّف الخدمة أو التكامل.",
    displayNamePlaceholder: "مثال: نشر بيئة الاختبار",
    displayNameError: "أدخل اسم عرض.",
    scope: "نطاق الوصول",
    readDescription: "عرض بيانات مساحة العمل دون إجراء تغييرات.",
    writeDescription: "عرض بيانات مساحة العمل وتغييرها.",
    cancel: "إلغاء",
    create: "إنشاء المفتاح",
    createdTitle: "تم إنشاء مفتاح API",
    createdMessage: "تمت إضافته إلى مساحة العمل.",
    detailEyebrow: "تفاصيل مفتاح API",
    detailModalLabel: "تفاصيل مفتاح API",
    closePanel: "إغلاق تفاصيل مفتاح API",
    close: "إغلاق",
    name: "الاسم",
    prefix: "بادئة المفتاح",
    status: "الحالة",
    createdBy: "أنشأه",
    createdDate: "تاريخ الإنشاء",
    dateUnavailable: "غير متوفر",
    revoke: "إلغاء المفتاح",
    revokeTitle: "هل تريد إلغاء مفتاح API؟",
    revokeDescription:
      "سيتوقف هذا المفتاح عن العمل فوراً. لا يمكن التراجع عن هذا الإجراء.",
    revokeBody: "ستفقد الخدمات التي تستخدم هذا المفتاح إمكانية الوصول.",
    revokeConfirm: "إلغاء مفتاح API",
    revokedTitle: "تم إلغاء مفتاح API",
    revokedMessage: "لم يعد بإمكان هذا المفتاح الوصول إلى مساحة العمل.",
    closeDialog: "إغلاق مربع الحوار",
  },
} as const;

function ProductIcon({ children }: { children: ReactNode }) {
  return (
    <span className="apiKeysEvaluation__productIcon" aria-hidden="true">
      {children}
    </span>
  );
}

function GridIcon() {
  return (
    <ProductIcon>
      <svg viewBox="0 0 20 20" focusable="false">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="12" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="12" width="5" height="5" rx="1" />
        <rect x="12" y="12" width="5" height="5" rx="1" />
      </svg>
    </ProductIcon>
  );
}

function FolderIcon() {
  return (
    <ProductIcon>
      <svg viewBox="0 0 20 20" focusable="false">
        <path d="M2.75 5.5h5l1.5 2h8v8.75h-14.5z" />
      </svg>
    </ProductIcon>
  );
}

function PeopleIcon() {
  return (
    <ProductIcon>
      <svg viewBox="0 0 20 20" focusable="false">
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="14" cy="8" r="2" />
        <path d="M2.75 16c.4-3 2-4.5 4.25-4.5s3.85 1.5 4.25 4.5M11.5 12.25c2.85-.65 4.8.65 5.5 3.75" />
      </svg>
    </ProductIcon>
  );
}

function KeyIcon() {
  return (
    <ProductIcon>
      <svg viewBox="0 0 20 20" focusable="false">
        <circle cx="6.5" cy="10" r="3.5" />
        <path d="M10 10h7M14 10v2M16.5 10v2" />
      </svg>
    </ProductIcon>
  );
}

function SettingsIcon() {
  return (
    <ProductIcon>
      <svg viewBox="0 0 20 20" focusable="false">
        <circle cx="10" cy="10" r="2.5" />
        <path d="M10 2.75v2M10 15.25v2M2.75 10h2M15.25 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4" />
      </svg>
    </ProductIcon>
  );
}

function formatCreatedDate(
  value: string | null,
  language: Language,
  fallback: string,
) {
  if (!value) return fallback;

  return new Intl.DateTimeFormat(language === "ar" ? "ar-AE" : "en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ApiKeysEvaluation({
  language = "en",
  theme = "light",
  viewportMode = "expanded",
  initialQuery = "",
  initialCreateOpen = false,
  initialDetailId,
}: ApiKeysEvaluationProps) {
  const text = copy[language];
  const [keys, setKeys] = useState<ApiKeyRecord[]>(INITIAL_KEYS);
  const [query, setQuery] = useState(initialQuery);
  const [createOpen, setCreateOpen] = useState(initialCreateOpen);
  const [displayName, setDisplayName] = useState("");
  const [scope, setScope] = useState<AccessScope>("read");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [createdName, setCreatedName] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialDetailId ?? null,
  );
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [recentlyRevokedId, setRecentlyRevokedId] = useState<string | null>(
    null,
  );
  const shellRef = useRef<HTMLDivElement>(null);
  const detailHostRef = useRef<HTMLDivElement>(null);
  const detailTriggerRef = useRef<HTMLElement | null>(null);
  const nextKeyNumber = useRef(1);

  const selectedKey = keys.find((key) => key.id === selectedId) ?? null;

  const filteredKeys = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(
      language === "ar" ? "ar-AE" : "en-US",
    );

    if (!normalizedQuery) return keys;

    return keys.filter((key) => {
      const name = key.name.toLocaleLowerCase(
        language === "ar" ? "ar-AE" : "en-US",
      );
      return (
        name.includes(normalizedQuery) ||
        key.prefix.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [keys, language, query]);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    const previousLanguage = root.getAttribute("data-language");
    const previousDirection = root.getAttribute("dir");
    const previousLang = root.getAttribute("lang");

    root.setAttribute("data-theme", theme);
    root.setAttribute(
      "data-language",
      language === "ar" ? "arabic" : "english",
    );
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", language);

    return () => {
      const restore = (name: string, value: string | null) => {
        if (value === null) root.removeAttribute(name);
        else root.setAttribute(name, value);
      };

      restore("data-theme", previousTheme);
      restore("data-language", previousLanguage);
      restore("dir", previousDirection);
      restore("lang", previousLang);
    };
  }, [language, theme]);

  useLayoutEffect(() => {
    if (!selectedId) return;

    const shell = shellRef.current;
    const firstControl = detailHostRef.current?.querySelector<HTMLElement>(
      "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])",
    );
    (firstControl ?? detailHostRef.current)?.focus();
    shell?.setAttribute("inert", "");
    shell?.setAttribute("aria-hidden", "true");

    return () => {
      shell?.removeAttribute("inert");
      shell?.removeAttribute("aria-hidden");
    };
  }, [selectedId]);

  function openDetails(id: string, trigger: HTMLElement) {
    detailTriggerRef.current = trigger;
    setRecentlyRevokedId(null);
    setSelectedId(id);
  }

  function closeDetails() {
    const trigger = detailTriggerRef.current;
    setRevokeOpen(false);
    setSelectedId(null);
    requestAnimationFrame(() => trigger?.focus());
  }

  function handleDetailKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (revokeOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
      return;
    }

    if (event.key !== "Tab") return;

    const controls = Array.from(
      detailHostRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ) ?? [],
    );
    if (controls.length === 0) {
      event.preventDefault();
      detailHostRef.current?.focus();
      return;
    }

    const first = controls[0]!;
    const last = controls[controls.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function resetCreateFlow() {
    setCreateOpen(false);
    setDisplayName("");
    setScope("read");
    setNameInvalid(false);
  }

  function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = displayName.trim();
    if (!cleanName) {
      setNameInvalid(true);
      return;
    }

    const sequence = nextKeyNumber.current;
    nextKeyNumber.current += 1;
    const id = `created-key-${sequence}`;
    const prefix = `nsk_created_${String(sequence).padStart(3, "0")}`;
    const createdAt = new Date().toISOString();
    setKeys((current) => [
      ...current,
      {
        id,
        name: cleanName,
        prefix,
        scope,
        status: "active",
        createdBy: "Amal Hassan",
        createdAt,
      },
    ]);
    setQuery("");
    setCreatedName(cleanName);
    resetCreateFlow();
  }

  function confirmRevoke() {
    if (!selectedKey || selectedKey.status !== "active") return;

    const revokedId = selectedKey.id;
    setKeys((current) =>
      current.map((key) =>
        key.id === revokedId ? { ...key, status: "revoked" } : key,
      ),
    );
    setRecentlyRevokedId(revokedId);
    setRevokeOpen(false);
    requestAnimationFrame(() => {
      const firstControl = detailHostRef.current?.querySelector<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      (firstControl ?? detailHostRef.current)?.focus();
    });
  }

  const navigationItems = [
    { id: "overview", label: text.overview, href: "#overview", icon: <GridIcon /> },
    { id: "projects", label: text.projects, href: "#projects", icon: <FolderIcon /> },
    { id: "team", label: text.team, href: "#team", icon: <PeopleIcon /> },
    { id: "api-keys", label: text.apiKeys, href: "#api-keys", icon: <KeyIcon /> },
    { id: "settings", label: text.settings, href: "#settings", icon: <SettingsIcon /> },
  ];

  const tableRows = filteredKeys.map((key) => ({
    id: key.id,
    primary: (
      <span className="apiKeysEvaluation__keyIdentity">
        <span className="apiKeysEvaluation__keyName">{key.name}</span>
        <span className="apiKeysEvaluation__prefix" dir="ltr">
          {key.prefix}
        </span>
      </span>
    ),
    secondary: text[key.scope],
    status: <StatusBadge label={text[key.status]} />,
    action: (
      <Button
        emphasis="text"
        aria-label={`${text.viewDetails} ${key.name}`}
        onClick={(event) => openDetails(key.id, event.currentTarget)}
      >
        {text.details}
      </Button>
    ),
    selected: selectedId === key.id,
  }));

  const resultSummary =
    filteredKeys.length === 1
      ? text.resultOne
      : `${new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US").format(filteredKeys.length)} ${text.resultMany}`;

  return (
    <div
      className="apiKeysEvaluation"
      data-theme={theme}
      data-language={language === "ar" ? "arabic" : "english"}
      data-shell-mode={viewportMode}
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
    >
      <div
        ref={shellRef}
        className="apiKeysEvaluation__shell"
      >
        <ApplicationShell
          viewportMode={viewportMode}
          topNavbar={
            <TopNavbar
              brand={
                <strong className="apiKeysEvaluation__brand" dir="ltr">
                  Northstar
                </strong>
              }
              contextLabel={text.workspaceAdministration}
              account={
                <span className="apiKeysEvaluation__account">
                  <span className="apiKeysEvaluation__accountText">
                    <strong>Amal Hassan</strong>
                    <span>{text.accountRole}</span>
                  </span>
                  <Avatar initials="AH" />
                </span>
              }
            />
          }
          sidebar={
            <Sidebar
              mode={viewportMode === "expanded" ? "expanded" : "compact"}
              label={text.workspace}
              items={navigationItems}
              currentId="api-keys"
            />
          }
          pageHeading={
            <PageHeading
              title={text.apiKeys}
              description={text.pageDescription}
              breadcrumbs={
                <Breadcrumbs
                  ancestors={[{ label: text.settings, href: "#settings" }]}
                  currentLabel={text.apiKeys}
                  ariaLabel={text.breadcrumbs}
                />
              }
              actions={
                <Button
                  onClick={() => {
                    setCreatedName(null);
                    setCreateOpen(true);
                  }}
                >
                  {text.createKey}
                </Button>
              }
            />
          }
        >
          <section className="apiKeysEvaluation__directory" aria-label={text.apiKeys}>
            {createdName ? (
              <InlineFeedback
                intent="success"
                title={text.createdTitle}
                message={`${createdName} ${text.createdMessage}`}
              />
            ) : null}

            <div className="apiKeysEvaluation__controls">
              <SearchField
                aria-label={text.searchLabel}
                clearButtonLabel={text.clearSearch}
                placeholder={text.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                onClear={() => setQuery("")}
              />
              <p className="apiKeysEvaluation__resultSummary" aria-live="polite">
                {resultSummary}
              </p>
            </div>

            <div className="apiKeysEvaluation__results">
              {filteredKeys.length > 0 ? (
                <Table
                  rows={tableRows}
                  primaryLabel={text.keyColumn}
                  secondaryLabel={text.accessColumn}
                  statusLabel={text.statusColumn}
                  actionLabel={text.detailsColumn}
                />
              ) : (
                <EmptyState
                  title={text.noResults}
                  body={text.noResultsBody}
                  actions={
                    <Button emphasis="secondary" onClick={() => setQuery("")}>
                      {text.clearFilters}
                    </Button>
                  }
                />
              )}
            </div>
          </section>
        </ApplicationShell>
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (open) setCreateOpen(true);
          else resetCreateFlow();
        }}
        title={text.createTitle}
        description={text.createDescription}
        closeLabel={text.closeDialog}
        actions={
          <>
            <Button emphasis="secondary" onClick={resetCreateFlow}>
              {text.cancel}
            </Button>
            <Button type="submit" form="api-key-create-form">
              {text.create}
            </Button>
          </>
        }
      >
        <form
          id="api-key-create-form"
          className="apiKeysEvaluation__createForm"
          onSubmit={submitCreate}
          noValidate
        >
          <TextField
            label={text.displayName}
            supportingText={text.displayNameHelp}
            errorMessage={text.displayNameError}
            invalid={nameInvalid}
            required
            placeholder={text.displayNamePlaceholder}
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.currentTarget.value);
              if (event.currentTarget.value.trim()) setNameInvalid(false);
            }}
          />
          <RadioGroup
            label={text.scope}
            name="api-key-scope"
            value={scope}
            onValueChange={(value) => setScope(value as AccessScope)}
            options={[
              {
                value: "read",
                label: text.read,
                description: text.readDescription,
              },
              {
                value: "write",
                label: text.write,
                description: text.writeDescription,
              },
            ]}
          />
        </form>
      </Dialog>

      {selectedKey ? (
        <div
          ref={detailHostRef}
          className="apiKeysEvaluation__detailHost"
          role="dialog"
          aria-modal="true"
          aria-label={text.detailModalLabel}
          tabIndex={-1}
          onKeyDown={handleDetailKeyboard}
        >
          <div className="apiKeysEvaluation__detailBackdrop" aria-hidden="true" />
          <SidePanel
            className="apiKeysEvaluation__detailPanel"
            eyebrow={text.detailEyebrow}
            closeLabel={text.closePanel}
            onClose={closeDetails}
            header={
              <div className="apiKeysEvaluation__detailHeader">
                <h2>{selectedKey.name}</h2>
                <span className="apiKeysEvaluation__prefix" dir="ltr">
                  {selectedKey.prefix}
                </span>
              </div>
            }
            actions={
              <>
                <Button emphasis="secondary" onClick={closeDetails}>
                  {text.close}
                </Button>
                {selectedKey.status === "active" ? (
                  <Button tone="critical" onClick={() => setRevokeOpen(true)}>
                    {text.revoke}
                  </Button>
                ) : null}
              </>
            }
          >
            <div className="apiKeysEvaluation__detailBody">
              {recentlyRevokedId === selectedKey.id ? (
                <InlineFeedback
                  intent="success"
                  title={text.revokedTitle}
                  message={text.revokedMessage}
                />
              ) : null}
              <dl className="apiKeysEvaluation__detailList">
                <div>
                  <dt>{text.name}</dt>
                  <dd>{selectedKey.name}</dd>
                </div>
                <div>
                  <dt>{text.prefix}</dt>
                  <dd className="apiKeysEvaluation__prefix" dir="ltr">
                    {selectedKey.prefix}
                  </dd>
                </div>
                <div>
                  <dt>{text.scope}</dt>
                  <dd>{text[selectedKey.scope]}</dd>
                </div>
                <div>
                  <dt>{text.status}</dt>
                  <dd>
                    <StatusBadge label={text[selectedKey.status]} />
                  </dd>
                </div>
                <div>
                  <dt>{text.createdBy}</dt>
                  <dd>{selectedKey.createdBy}</dd>
                </div>
                <div>
                  <dt>{text.createdDate}</dt>
                  <dd>
                    {formatCreatedDate(
                      selectedKey.createdAt,
                      language,
                      text.dateUnavailable,
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </SidePanel>
        </div>
      ) : null}

      <Dialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        title={text.revokeTitle}
        description={
          selectedKey
            ? `${text.revokeDescription} ${selectedKey.name}`
            : text.revokeDescription
        }
        closeLabel={text.closeDialog}
        actions={
          <>
            <Button emphasis="secondary" onClick={() => setRevokeOpen(false)}>
              {text.cancel}
            </Button>
            <Button tone="critical" onClick={confirmRevoke}>
              {text.revokeConfirm}
            </Button>
          </>
        }
      >
        <p className="apiKeysEvaluation__confirmBody">{text.revokeBody}</p>
      </Dialog>
    </div>
  );
}
