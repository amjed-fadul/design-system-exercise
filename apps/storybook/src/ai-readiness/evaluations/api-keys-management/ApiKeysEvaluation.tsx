import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Dialog,
  EmptyState,
  InlineFeedback,
  PageHeading,
  RadioGroup,
  SearchField,
  SidePanel,
  StatusBadge,
  Table,
  TextField,
} from "@design-system-exercise/react";

export type ApiKeysLanguage = "en" | "ar";
export type ApiKeysTheme = "light" | "dark";
export type ApiKeysLayout = "auto" | "wide" | "compact";

type Scope = "read-only" | "read-write";
type KeyStatus = "active" | "revoked";

type ApiKeyRecord = {
  id: string;
  name: string;
  prefix: string | null;
  scope: Scope;
  status: KeyStatus;
  createdBy: string;
};

type Copy = {
  title: string;
  description: string;
  search: string;
  searchPlaceholder: string;
  clearSearch: string;
  key: string;
  scope: string;
  status: string;
  action: string;
  details: string;
  detailsFor: (name: string) => string;
  detailEyebrow: string;
  detailDialogName: (name: string) => string;
  closePanel: string;
  closeDialog: string;
  nameLabel: string;
  prefixLabel: string;
  creatorLabel: string;
  createdDateLabel: string;
  unavailableDate: string;
  scopeLabel: string;
  create: string;
  createDescription: string;
  keyName: string;
  keyNamePlaceholder: string;
  nameRequired: string;
  scopeRequired: string;
  prefixUnavailable: string;
  currentAdminEvaluation: string;
  cancel: string;
  createSuccess: string;
  detailUnresolved: string;
  revoke: string;
  revokeTitle: string;
  revokeDescription: string;
  revokeWarning: string;
  revokedSuccess: (name: string) => string;
  active: string;
  revoked: string;
  readOnly: string;
  readWrite: string;
  emptyTitle: string;
  emptyBody: string;
  keysCount: (count: number) => string;
};

const copy: Record<ApiKeysLanguage, Copy> = {
  en: {
    title: "API keys",
    description: "Create and manage keys for workspace integrations.",
    search: "Search API keys",
    searchPlaceholder: "Search by name or key prefix",
    clearSearch: "Clear search",
    key: "API key",
    scope: "Access scope",
    status: "Status",
    action: "Action",
    details: "View details",
    detailsFor: (name) => `View details for ${name}`,
    detailEyebrow: "API key details",
    detailDialogName: (name) => `Details for ${name}`,
    closePanel: "Close panel",
    closeDialog: "Close dialog",
    nameLabel: "Name",
    prefixLabel: "Prefix",
    creatorLabel: "Created by",
    createdDateLabel: "Created date",
    unavailableDate: "Not provided in evaluation fixture",
    scopeLabel: "Access scope",
    create: "Create API key",
    createDescription: "Choose a name and the access this key should have.",
    keyName: "Key name",
    keyNamePlaceholder: "For example, Billing integration",
    nameRequired: "Enter an API key name.",
    scopeRequired: "Choose an access scope.",
    prefixUnavailable: "Not generated (evaluation only)",
    currentAdminEvaluation: "Current administrator (evaluation)",
    cancel: "Cancel",
    createSuccess:
      "API key added to the local evaluation directory. No secret value was generated or stored.",
    detailUnresolved:
      "Contextual detail is unavailable in this compact evaluation because approved guidance does not define a narrow-screen model.",
    revoke: "Revoke key",
    revokeTitle: "Revoke API key?",
    revokeDescription: "Apps using this key will immediately lose access.",
    revokeWarning: "This action cannot be undone.",
    revokedSuccess: (name) => `${name} was revoked.`,
    active: "Active",
    revoked: "Revoked",
    readOnly: "Read only",
    readWrite: "Read and write",
    emptyTitle: "No API keys found",
    emptyBody: "No keys match your search. Try another name or prefix.",
    keysCount: (count) => `${count} ${count === 1 ? "key" : "keys"}`,
  },
  ar: {
    title: "مفاتيح API",
    description: "أنشئ مفاتيح تكامل مساحة العمل وأدرها.",
    search: "ابحث عن مفاتيح API",
    searchPlaceholder: "ابحث بالاسم أو ببادئة المفتاح",
    clearSearch: "مسح البحث",
    key: "مفتاح API",
    scope: "نطاق الوصول",
    status: "الحالة",
    action: "الإجراء",
    details: "عرض التفاصيل",
    detailsFor: (name) => `عرض تفاصيل ${name}`,
    detailEyebrow: "تفاصيل مفتاح API",
    detailDialogName: (name) => `تفاصيل ${name}`,
    closePanel: "إغلاق اللوحة",
    closeDialog: "إغلاق الحوار",
    nameLabel: "الاسم",
    prefixLabel: "البادئة",
    creatorLabel: "أنشأه",
    createdDateLabel: "تاريخ الإنشاء",
    unavailableDate: "غير متوفر في بيانات التقييم",
    scopeLabel: "نطاق الوصول",
    create: "إنشاء مفتاح API",
    createDescription: "اختر اسماً ونطاق الوصول لهذا المفتاح.",
    keyName: "اسم المفتاح",
    keyNamePlaceholder: "مثال: تكامل الفوترة",
    nameRequired: "أدخل اسم مفتاح API.",
    scopeRequired: "اختر نطاق الوصول.",
    prefixUnavailable: "غير مُنشأ (للتقييم فقط)",
    currentAdminEvaluation: "مسؤول مساحة العمل الحالي (للتقييم)",
    cancel: "إلغاء",
    createSuccess: "أُضيف المفتاح إلى دليل التقييم المحلي. لم يتم إنشاء سر أو تخزينه.",
    detailUnresolved:
      "تفاصيل المفتاح غير متاحة في عرض التقييم المدمج، إذ لا يحدد الدليل المعتمد نموذجاً للشاشات الضيقة.",
    revoke: "إلغاء المفتاح",
    revokeTitle: "هل تريد إلغاء مفتاح API؟",
    revokeDescription: "ستفقد التطبيقات التي تستخدم هذا المفتاح إمكانية الوصول فوراً.",
    revokeWarning: "لا يمكن التراجع عن هذا الإجراء.",
    revokedSuccess: (name) => `تم إلغاء ${name}.`,
    active: "نشط",
    revoked: "ملغى",
    readOnly: "قراءة فقط",
    readWrite: "قراءة وكتابة",
    emptyTitle: "لم يتم العثور على مفاتيح API",
    emptyBody: "لا تطابق مفاتيح API بحثك. جرّب اسماً أو بادئة أخرى.",
    keysCount: (count) => `${count} مفاتيح`,
  },
};

const initialKeys: ApiKeyRecord[] = [
  {
    id: "production-deploy",
    name: "Production deploy",
    prefix: "nsk_prod_7H2",
    scope: "read-write",
    status: "active",
    createdBy: "Amal Hassan",
  },
  {
    id: "analytics-reader",
    name: "Analytics reader",
    prefix: "nsk_analytics_4F9",
    scope: "read-only",
    status: "active",
    createdBy: "Sara Ahmed",
  },
  {
    id: "legacy-integration",
    name: "Legacy integration",
    prefix: "nsk_legacy_2K1",
    scope: "read-only",
    status: "revoked",
    createdBy: "Amal Hassan",
  },
];

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const query = window.matchMedia("(max-width: 1199px)");
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isCompact;
}

export type ApiKeysEvaluationProps = {
  language?: ApiKeysLanguage;
  theme?: ApiKeysTheme;
  layout?: ApiKeysLayout;
};

export function ApiKeysEvaluation({
  language = "en",
  theme = "light",
  layout = "auto",
}: ApiKeysEvaluationProps) {
  const labels = copy[language];
  const compactViewport = useCompactViewport();
  const isCompact = layout === "compact" || (layout === "auto" && compactViewport);
  const resolvedLayout: Exclude<ApiKeysLayout, "auto"> = isCompact ? "compact" : "wide";
  const [keys, setKeys] = useState(initialKeys);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeSuccess, setRevokeSuccess] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftScope, setDraftScope] = useState<Scope | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [scopeError, setScopeError] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);
  const detailHostRef = useRef<HTMLDivElement>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase(language);
  const detailKey = keys.find((key) => key.id === detailId) ?? null;

  const visibleKeys = useMemo(
    () =>
      keys.filter((key) =>
        `${key.name} ${key.prefix ?? ""}`.toLocaleLowerCase(language).includes(normalizedQuery),
      ),
    [keys, language, normalizedQuery],
  );

  const rows = visibleKeys.map((key) => ({
    id: key.id,
    primary: (
      <div className="api-keys-evaluation__key-cell">
        <strong>{key.name}</strong>
        {key.prefix ? <code dir="ltr">{key.prefix}</code> : <span>{labels.prefixUnavailable}</span>}
      </div>
    ),
    secondary: <span>{key.scope === "read-only" ? labels.readOnly : labels.readWrite}</span>,
    status: <StatusBadge label={key.status === "active" ? labels.active : labels.revoked} />,
    action: (
      <Button
        emphasis="text"
        type="button"
        aria-label={labels.detailsFor(key.name)}
        aria-describedby={isCompact ? "api-keys-detail-limit" : undefined}
        disabled={isCompact}
        onClick={(event) => {
          detailTriggerRef.current = event.currentTarget;
          setRevokeSuccess(null);
          setDetailId(key.id);
        }}
      >
        {labels.details}
      </Button>
    ),
    selected: detailId === key.id,
  }));

  useEffect(() => {
    if (!detailKey || !pageContentRef.current || !detailHostRef.current) return;

    const pageContent = pageContentRef.current;
    const wasInert = pageContent.inert;
    const previousAriaHidden = pageContent.getAttribute("aria-hidden");

    pageContent.inert = true;
    pageContent.setAttribute("aria-hidden", "true");
    const firstFocusable = detailHostRef.current.querySelector<HTMLElement>(focusableSelector);
    (firstFocusable ?? detailHostRef.current).focus();

    return () => {
      pageContent.inert = wasInert;
      if (previousAriaHidden === null) {
        pageContent.removeAttribute("aria-hidden");
      } else {
        pageContent.setAttribute("aria-hidden", previousAriaHidden);
      }
      if (detailTriggerRef.current?.isConnected) detailTriggerRef.current.focus();
    };
  }, [detailKey?.id]);

  useEffect(() => {
    if (!revokeSuccess || detailKey?.status !== "revoked" || !detailHostRef.current) return;

    const firstFocusable = detailHostRef.current.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();
  }, [detailKey?.status, revokeSuccess]);

  const closeDetails = () => setDetailId(null);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draftName.trim();
    const nextNameError = name ? null : labels.nameRequired;
    const nextScopeError = draftScope === null;
    setNameError(nextNameError);
    setScopeError(nextScopeError);
    if (!name || !draftScope) return;

    const nextKey: ApiKeyRecord = {
      id: `evaluation-${keys.length + 1}`,
      name,
      prefix: null,
      scope: draftScope,
      status: "active",
      createdBy: labels.currentAdminEvaluation,
    };
    setKeys((currentKeys) => [nextKey, ...currentKeys]);
    setDraftName("");
    setDraftScope(null);
    setNameError(null);
    setScopeError(false);
    setCreationSuccess(labels.createSuccess);
    setCreateOpen(false);
  };

  const handleConfirmRevoke = () => {
    if (!detailKey || detailKey.status !== "active") return;
    setKeys((currentKeys) =>
      currentKeys.map((key) => (key.id === detailKey.id ? { ...key, status: "revoked" } : key)),
    );
    setRevokeSuccess(labels.revokedSuccess(detailKey.name));
    setRevokeOpen(false);
  };

  const handleDetailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (revokeOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
      return;
    }
    if (event.key !== "Tab" || !detailHostRef.current) return;

    const focusable = Array.from(
      detailHostRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true");
    if (focusable.length === 0) {
      event.preventDefault();
      detailHostRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const detailLayer =
    detailKey && typeof document !== "undefined"
      ? createPortal(
          <div
            className="api-keys-evaluation__detail-layer"
            dir={language === "ar" ? "rtl" : "ltr"}
            lang={language}
            data-theme={theme}
            data-language={language === "ar" ? "arabic" : "english"}
          >
            <div
              ref={detailHostRef}
              className="api-keys-evaluation__detail-host"
              role="dialog"
              aria-modal="true"
              aria-label={labels.detailDialogName(detailKey.name)}
              tabIndex={-1}
              onKeyDown={handleDetailKeyDown}
            >
              <SidePanel
                eyebrow={labels.detailEyebrow}
                closeLabel={labels.closePanel}
                className="api-keys-evaluation__panel"
                onClose={closeDetails}
                actions={
                  detailKey.status === "active" ? (
                    <Button tone="critical" type="button" onClick={() => setRevokeOpen(true)}>
                      {labels.revoke}
                    </Button>
                  ) : null
                }
                header={
                  <div className="api-keys-evaluation__detail-heading">
                    <h2>{detailKey.name}</h2>
                  </div>
                }
              >
                <>
                  {revokeSuccess && <InlineFeedback intent="success" message={revokeSuccess} />}
                  <dl className="api-keys-evaluation__metadata">
                    <div>
                      <dt>{labels.nameLabel}</dt>
                      <dd>{detailKey.name}</dd>
                    </div>
                    <div>
                      <dt>{labels.prefixLabel}</dt>
                      <dd>
                        {detailKey.prefix ? (
                          <code dir="ltr">{detailKey.prefix}</code>
                        ) : (
                          <span>{labels.prefixUnavailable}</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{labels.scopeLabel}</dt>
                      <dd>{detailKey.scope === "read-only" ? labels.readOnly : labels.readWrite}</dd>
                    </div>
                    <div>
                      <dt>{labels.status}</dt>
                      <dd>{detailKey.status === "active" ? labels.active : labels.revoked}</dd>
                    </div>
                    <div>
                      <dt>{labels.creatorLabel}</dt>
                      <dd>{detailKey.createdBy}</dd>
                    </div>
                    <div>
                      <dt>{labels.createdDateLabel}</dt>
                      <dd>{labels.unavailableDate}</dd>
                    </div>
                  </dl>
                </>
              </SidePanel>
              <Dialog
                open={revokeOpen}
                onOpenChange={setRevokeOpen}
                title={labels.revokeTitle}
                description={labels.revokeDescription}
                closeLabel={labels.closeDialog}
                actions={
                  <>
                    <Button emphasis="secondary" type="button" onClick={() => setRevokeOpen(false)}>
                      {labels.cancel}
                    </Button>
                    <Button tone="critical" type="button" onClick={handleConfirmRevoke}>
                      {labels.revoke}
                    </Button>
                  </>
                }
              >
                <p>{labels.revokeWarning}</p>
              </Dialog>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
    <div
      id="api-keys"
      className={`api-keys-evaluation api-keys-evaluation--${resolvedLayout}`}
      ref={pageContentRef}
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
      data-theme={theme}
      data-language={language === "ar" ? "arabic" : "english"}
      data-layout-mode={resolvedLayout}
    >
      <main className="api-keys-evaluation__content">
        <PageHeading
          title={labels.title}
          description={labels.description}
          actions={
            <Button type="button" onClick={() => setCreateOpen(true)}>
              {labels.create}
            </Button>
          }
        />

        {creationSuccess && <InlineFeedback intent="success" message={creationSuccess} />}

        <div className="api-keys-evaluation__controls">
          <SearchField
            aria-label={labels.search}
            placeholder={labels.searchPlaceholder}
            clearButtonLabel={labels.clearSearch}
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value)}
            onClear={() => setQuery("")}
          />
          <p className="api-keys-evaluation__count" aria-live="polite">
            {labels.keysCount(visibleKeys.length)}
          </p>
        </div>

        {isCompact && (
          <p id="api-keys-detail-limit" className="api-keys-evaluation__detail-note" role="note">
            {labels.detailUnresolved}
          </p>
        )}

        {visibleKeys.length > 0 ? (
          <div className="api-keys-evaluation__results">
            <Table
              primaryLabel={labels.key}
              secondaryLabel={labels.scope}
              statusLabel={labels.status}
              actionLabel={labels.action}
              rows={rows}
            />
          </div>
        ) : (
          <EmptyState title={labels.emptyTitle} body={labels.emptyBody} />
        )}
      </main>
      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={labels.create}
        description={labels.createDescription}
        closeLabel={labels.closeDialog}
        actions={
          <>
            <Button emphasis="secondary" type="button" onClick={() => setCreateOpen(false)}>
              {labels.cancel}
            </Button>
            <Button type="submit" form="api-key-create-form">
              {labels.create}
            </Button>
          </>
        }
      >
        <form id="api-key-create-form" noValidate onSubmit={handleCreate}>
          <TextField
            label={labels.keyName}
            placeholder={labels.keyNamePlaceholder}
            name="keyName"
            autoComplete="off"
            required
            value={draftName}
            invalid={Boolean(nameError)}
            errorMessage={nameError ?? undefined}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setDraftName(event.currentTarget.value);
              if (event.currentTarget.value.trim()) setNameError(null);
            }}
          />
          <RadioGroup
            label={labels.scopeLabel}
            name="api-key-scope"
            value={draftScope ?? undefined}
            options={[
              { value: "read-only", label: labels.readOnly },
              { value: "read-write", label: labels.readWrite },
            ]}
            onValueChange={(value: string) => {
              setDraftScope(value as Scope);
              setScopeError(false);
            }}
          />
          {scopeError && <InlineFeedback intent="error" message={labels.scopeRequired} />}
        </form>
      </Dialog>
    </div>
    {detailLayer}
    </>
  );
}
