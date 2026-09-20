import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import {
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
  prefix: string | null;
  scope: AccessScope;
  status: KeyStatus;
  createdBy: string;
  createdByDirection: "ltr" | "rtl";
  createdDate: string | null;
};

export type ApiKeysEvaluationProps = {
  language?: Language;
  theme?: Theme;
  viewportMode?: ViewportMode;
};

type LocaleCopy = {
  account: string;
  appContext: string;
  navigation: string;
  navigationItem: string;
  title: string;
  description: string;
  createAction: string;
  createTitle: string;
  createDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  nameSupporting: string;
  nameError: string;
  scopeLabel: string;
  readScope: string;
  readScopeDescription: string;
  writeScope: string;
  writeScopeDescription: string;
  cancel: string;
  createKey: string;
  createError: string;
  createSuccess: string;
  prefixNotGenerated: string;
  createdByForNewKey: string;
  detailDialogName: (name: string) => string;
  detailEyebrow: string;
  detailName: string;
  prefixLabel: string;
  scopeLabelDetail: string;
  statusLabelDetail: string;
  createdByLabel: string;
  createdDateLabel: string;
  dateNotProvided: string;
  secretNotShown: string;
  closePanel: string;
  closeDialog: string;
  revokeAction: string;
  revokeDialogTitle: string;
  revokeDialogDescription: (name: string) => string;
  revokeConfirmationBody: string;
  revokeConfirm: string;
  revokeSuccess: (name: string) => string;
  narrowDetailUnresolved: string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  resultCount: (count: number) => string;
  keyColumn: string;
  scopeColumn: string;
  statusColumn: string;
  actionColumn: string;
  active: string;
  revoked: string;
  details: string;
  viewDetailsFor: (name: string) => string;
  emptyTitle: string;
  emptyBody: string;
  clearSearchAction: string;
};

const fixtureKeys: ApiKeyRecord[] = [
  {
    id: "production-deploy",
    name: "Production deploy",
    prefix: "nsk_prod_7H2",
    scope: "write",
    status: "active",
    createdBy: "Amal Hassan",
    createdByDirection: "ltr",
    createdDate: null,
  },
  {
    id: "analytics-reader",
    name: "Analytics reader",
    prefix: "nsk_analytics_4F9",
    scope: "read",
    status: "active",
    createdBy: "Sara Ahmed",
    createdByDirection: "ltr",
    createdDate: null,
  },
  {
    id: "legacy-integration",
    name: "Legacy integration",
    prefix: "nsk_legacy_2K1",
    scope: "read",
    status: "revoked",
    createdBy: "Amal Hassan",
    createdByDirection: "ltr",
    createdDate: null,
  },
];

const copy: Record<Language, LocaleCopy> = {
  en: {
    account: "Workspace admin",
    appContext: "Workspace administration",
    navigation: "WORKSPACE",
    navigationItem: "API keys",
    title: "API keys",
    description: "Manage credentials that connect your workspace to the Northstar API.",
    createAction: "Create API key",
    createTitle: "Create API key",
    createDescription:
      "Choose a display name and one access scope. This evaluation does not generate or display a secret token.",
    nameLabel: "Key name",
    namePlaceholder: "e.g. CI deployment",
    nameSupporting: "Use a name that helps your team recognize this key.",
    nameError: "Enter a name for this API key.",
    scopeLabel: "Access scope",
    readScope: "Read only",
    readScopeDescription: "Can read workspace resources.",
    writeScope: "Read and write",
    writeScopeDescription: "Can read and change workspace resources.",
    cancel: "Cancel",
    createKey: "Create key",
    createError:
      "No API key was created. Enter a name and choose an access scope before trying again.",
    createSuccess:
      "API key created in this evaluation. No secret token was generated or displayed.",
    prefixNotGenerated: "Not generated in this evaluation",
    createdByForNewKey: "Workspace admin (evaluation)",
    detailDialogName: (name) => `${name} details`,
    detailEyebrow: "API KEY DETAILS",
    detailName: "Key name",
    prefixLabel: "Key prefix",
    scopeLabelDetail: "Access scope",
    statusLabelDetail: "Status",
    createdByLabel: "Created by",
    createdDateLabel: "Created date",
    dateNotProvided: "Not supplied in this evaluation",
    secretNotShown: "This evaluation never displays or stores a secret token.",
    closePanel: "Close key details",
    closeDialog: "Close dialog",
    revokeAction: "Revoke API key",
    revokeDialogTitle: "Revoke API key?",
    revokeDialogDescription: (name) =>
      `Revoking ${name} marks it inactive in this evaluation. No production request is sent.`,
    revokeConfirmationBody: "Confirm only if you intend to mark this key revoked.",
    revokeConfirm: "Confirm revoke",
    revokeSuccess: (name) => `${name} was marked revoked in this evaluation. No production request was sent.`,
    narrowDetailUnresolved:
      "Narrow-screen key details are unresolved. This evaluation does not introduce a drawer or alternate navigation model.",
    searchLabel: "Search API keys",
    searchPlaceholder: "Search by name or key prefix",
    clearSearch: "Clear search",
    resultCount: (count: number) => `${count} ${count === 1 ? "key" : "keys"}`,
    keyColumn: "API key",
    scopeColumn: "Access scope",
    statusColumn: "Status",
    actionColumn: "Details",
    active: "Active",
    revoked: "Revoked",
    details: "Details",
    viewDetailsFor: (name: string) => `View details for ${name}`,
    emptyTitle: "No API keys found",
    emptyBody: "No key names or prefixes match your search. Try another query or clear the search.",
    clearSearchAction: "Clear search",
  },
  ar: {
    account: "مسؤول مساحة العمل",
    appContext: "إدارة مساحة العمل",
    navigation: "مساحة العمل",
    navigationItem: "مفاتيح API",
    title: "مفاتيح API",
    description: "أدِر بيانات الاعتماد التي تربط مساحة العمل بواجهة Northstar البرمجية.",
    createAction: "إنشاء مفتاح API",
    createTitle: "إنشاء مفتاح API",
    createDescription:
      "اختر اسمًا ظاهرًا ونطاق وصول واحدًا. لا ينشئ هذا التقييم رمزًا سريًا ولا يعرضه.",
    nameLabel: "اسم المفتاح",
    namePlaceholder: "مثال: نشر CI",
    nameSupporting: "اختر اسمًا يساعد فريقك على التعرّف على هذا المفتاح.",
    nameError: "أدخل اسمًا لمفتاح API هذا.",
    scopeLabel: "نطاق الوصول",
    readScope: "قراءة فقط",
    readScopeDescription: "يمكنه قراءة موارد مساحة العمل.",
    writeScope: "قراءة وكتابة",
    writeScopeDescription: "يمكنه قراءة موارد مساحة العمل وتعديلها.",
    cancel: "إلغاء",
    createKey: "إنشاء المفتاح",
    createError:
      "لم يتم إنشاء مفتاح API. أدخل اسمًا واختر نطاق وصول قبل المحاولة مجددًا.",
    createSuccess:
      "تم إنشاء مفتاح API ضمن هذا التقييم. لم يتم إنشاء رمز سري أو عرضه.",
    prefixNotGenerated: "لم يتم إنشاؤها في هذا التقييم",
    createdByForNewKey: "مسؤول مساحة العمل (التقييم)",
    detailDialogName: (name) => `تفاصيل ${name}`,
    detailEyebrow: "تفاصيل مفتاح API",
    detailName: "اسم المفتاح",
    prefixLabel: "بادئة المفتاح",
    scopeLabelDetail: "نطاق الوصول",
    statusLabelDetail: "الحالة",
    createdByLabel: "أُنشئ بواسطة",
    createdDateLabel: "تاريخ الإنشاء",
    dateNotProvided: "غير متوفر في بيانات هذا التقييم",
    secretNotShown: "لا يعرض هذا التقييم رمزًا سريًا ولا يخزّنه.",
    closePanel: "إغلاق تفاصيل المفتاح",
    closeDialog: "إغلاق مربع الحوار",
    revokeAction: "إلغاء مفتاح API",
    revokeDialogTitle: "إلغاء مفتاح API؟",
    revokeDialogDescription: (name) =>
      `سيؤدي إلغاء ${name} إلى وضعه كملغى ضمن هذا التقييم. لن يُرسل أي طلب إلى بيئة الإنتاج.`,
    revokeConfirmationBody: "أكّد فقط إذا كنت تريد وضع هذا المفتاح كملغى.",
    revokeConfirm: "تأكيد الإلغاء",
    revokeSuccess: (name) => `تم وضع ${name} كملغى ضمن هذا التقييم. لم يُرسل أي طلب إلى بيئة الإنتاج.`,
    narrowDetailUnresolved:
      "سلوك تفاصيل المفاتيح على الشاشات الضيقة غير محسوم. لا يضيف هذا التقييم درجًا أو نموذج تنقّل بديلًا.",
    searchLabel: "البحث في مفاتيح API",
    searchPlaceholder: "ابحث بالاسم أو ببادئة المفتاح",
    clearSearch: "مسح البحث",
    resultCount: (count: number) => `${new Intl.NumberFormat("ar").format(count)} مفاتيح`,
    keyColumn: "مفتاح API",
    scopeColumn: "نطاق الوصول",
    statusColumn: "الحالة",
    actionColumn: "التفاصيل",
    active: "نشط",
    revoked: "ملغى",
    details: "التفاصيل",
    viewDetailsFor: (name: string) => `عرض تفاصيل ${name}`,
    emptyTitle: "لم يتم العثور على مفاتيح API",
    emptyBody: "لا تتطابق أسماء المفاتيح أو بادئاتها مع البحث. جرّب عبارة أخرى أو امسح البحث.",
    clearSearchAction: "مسح البحث",
  },
};

function KeyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="api-keys-icon"
      fill="none"
      focusable="false"
      viewBox="0 0 20 20"
    >
      <circle cx="7" cy="10" r="3" />
      <path d="M10 10h6m-2 0v2m-2-2v2" />
    </svg>
  );
}

function matchesKeySearch(key: ApiKeyRecord, query: string, language: Language) {
  const normalizedQuery = query.trim().toLocaleLowerCase(language === "ar" ? "ar" : "en");
  if (!normalizedQuery) return true;

  return `${key.name} ${key.prefix ?? ""}`
    .toLocaleLowerCase(language === "ar" ? "ar" : "en")
    .includes(normalizedQuery);
}

export function ApiKeysEvaluation({
  language = "en",
  theme = "light",
  viewportMode = "auto",
}: ApiKeysEvaluationProps) {
  const text = copy[language];
  const direction = language === "ar" ? "rtl" : "ltr";
  const [query, setQuery] = useState("");
  const [keys, setKeys] = useState<ApiKeyRecord[]>(() => [...fixtureKeys]);
  const [createOpen, setCreateOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [scopeDraft, setScopeDraft] = useState<AccessScope | undefined>();
  const [createAttempted, setCreateAttempted] = useState(false);
  const [pageNotice, setPageNotice] = useState<string | null>(null);
  const [interactionNotice, setInteractionNotice] = useState<string | null>(null);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const createdKeyCount = useRef(0);
  const detailHostRef = useRef<HTMLDivElement | null>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const previousDetailIdRef = useRef<string | null>(null);
  const previousSelectedStatusRef = useRef<KeyStatus | null>(null);
  const searchControlRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const tokenLanguage = language === "ar" ? "arabic" : "english";
    const previous = {
      theme: root.getAttribute("data-theme"),
      tokenLanguage: root.getAttribute("data-language"),
      language: root.getAttribute("lang"),
      direction: root.getAttribute("dir"),
      colorScheme: root.style.colorScheme,
    };

    root.setAttribute("data-theme", theme);
    root.setAttribute("data-language", tokenLanguage);
    root.setAttribute("lang", language);
    root.setAttribute("dir", direction);
    root.style.colorScheme = theme;

    return () => {
      if (previous.theme === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previous.theme);

      if (previous.tokenLanguage === null) root.removeAttribute("data-language");
      else root.setAttribute("data-language", previous.tokenLanguage);

      if (previous.language === null) root.removeAttribute("lang");
      else root.setAttribute("lang", previous.language);

      if (previous.direction === null) root.removeAttribute("dir");
      else root.setAttribute("dir", previous.direction);

      root.style.colorScheme = previous.colorScheme;
    };
  }, [direction, language, theme]);

  const filteredKeys = keys.filter((key) => matchesKeySearch(key, query, language));
  const selectedKey = keys.find((key) => key.id === selectedKeyId) ?? null;

  useEffect(() => {
    if (selectedKeyId) {
      previousDetailIdRef.current = selectedKeyId;
      const host = detailHostRef.current;
      const firstControl = host?.querySelector<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (firstControl ?? host)?.focus();
      return;
    }

    if (previousDetailIdRef.current) {
      const trigger = detailTriggerRef.current;
      if (trigger?.isConnected) trigger.focus();
      else searchControlRef.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
      detailTriggerRef.current = null;
      previousDetailIdRef.current = null;
    }
  }, [selectedKeyId]);

  useEffect(() => {
    if (!selectedKey) {
      previousSelectedStatusRef.current = null;
      return;
    }

    const becameRevoked =
      previousSelectedStatusRef.current === "active" && selectedKey.status === "revoked";
    previousSelectedStatusRef.current = selectedKey.status;

    if (becameRevoked && !revokeOpen) {
      detailHostRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus();
    }
  }, [revokeOpen, selectedKey]);

  const closeDetails = () => {
    setSelectedKeyId(null);
    setRevokeOpen(false);
  };

  const canOpenDetails = () => {
    if (viewportMode === "compact") return false;
    if (viewportMode === "expanded" || typeof window === "undefined") return true;
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(min-width: 1200px)").matches;
    }
    return window.innerWidth >= 1200;
  };

  const openDetails = (key: ApiKeyRecord, trigger: HTMLButtonElement) => {
    if (!canOpenDetails()) {
      setInteractionNotice(text.narrowDetailUnresolved);
      return;
    }

    setInteractionNotice(null);
    detailTriggerRef.current = trigger;
    setSelectedKeyId(key.id);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setPageNotice(null);
    if (selectedKeyId) {
      const selected = keys.find((key) => key.id === selectedKeyId);
      if (selected && !matchesKeySearch(selected, value, language)) closeDetails();
    }
  };

  const handleDetailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (revokeOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
      return;
    }

    if (event.key !== "Tab") return;
    const host = detailHostRef.current;
    if (!host) return;

    const focusable = Array.from(
      host.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
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
  };

  const confirmRevoke = () => {
    if (!selectedKey || selectedKey.status !== "active") return;
    setKeys((current) =>
      current.map((key) =>
        key.id === selectedKey.id ? { ...key, status: "revoked" } : key,
      ),
    );
    setPageNotice(text.revokeSuccess(selectedKey.name));
    setRevokeOpen(false);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setNameDraft("");
    setScopeDraft(undefined);
    setCreateAttempted(false);
  };

  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameDraft.trim() || !scopeDraft) {
      setCreateAttempted(true);
      return;
    }

    createdKeyCount.current += 1;
    setKeys((current) => [
      {
        id: `evaluation-key-${createdKeyCount.current}`,
        name: nameDraft.trim(),
        prefix: null,
        scope: scopeDraft,
        status: "active",
        createdBy: text.createdByForNewKey,
        createdByDirection: direction,
        createdDate: null,
      },
      ...current,
    ]);
    setQuery("");
    setPageNotice(text.createSuccess);
    closeCreate();
  };

  const tableRows = filteredKeys.map((key) => ({
    id: key.id,
    primary: (
      <div className="api-key-identity">
        <span className="api-key-identity__name">{key.name}</span>
        <span
          className={
            key.prefix
              ? "api-key-identity__prefix"
              : "api-key-identity__prefix api-key-identity__prefix--placeholder"
          }
          dir={key.prefix ? "ltr" : direction}
        >
          {key.prefix ?? text.prefixNotGenerated}
        </span>
      </div>
    ),
    secondary: key.scope === "read" ? text.readScope : text.writeScope,
    status: <StatusBadge label={key.status === "active" ? text.active : text.revoked} />,
    action: (
      <Button
        aria-label={text.viewDetailsFor(key.name)}
        emphasis="text"
        onClick={(event) => openDetails(key, event.currentTarget)}
        type="button"
      >
        {text.details}
      </Button>
    ),
    selected: key.id === selectedKeyId,
  }));

  return (
    <div
      className="api-keys-evaluation"
      data-language={language === "ar" ? "arabic" : "english"}
      data-theme={theme}
      data-viewport-mode={viewportMode}
      dir={direction}
      lang={language}
    >
      <div
        aria-hidden={selectedKeyId ? true : undefined}
        className="api-keys-workspace"
        inert={Boolean(selectedKeyId)}
      >
      <ApplicationShell
        topNavbar={
          <TopNavbar
            account={<span className="api-keys-account">{text.account}</span>}
            brand={<span className="api-keys-brand" dir="ltr">Northstar</span>}
            contextLabel={text.appContext}
          />
        }
        sidebar={
          <Sidebar
            currentId="api-keys"
            items={[
              {
                id: "api-keys",
                label: text.navigationItem,
                href: "#api-keys",
                icon: <KeyIcon />,
              },
            ]}
            label={text.navigation}
          />
        }
        pageHeading={
          <PageHeading
            actions={
              <Button onClick={() => setCreateOpen(true)} type="button">
                {text.createAction}
              </Button>
            }
            description={text.description}
            title={text.title}
          />
        }
        viewportMode={viewportMode}
      >
        <section className="api-keys-directory" id="api-keys">
          {pageNotice ? (
            <InlineFeedback intent="success" message={pageNotice} />
          ) : null}
          <div className="api-keys-directory__controls">
            <div className="api-keys-directory__search" ref={searchControlRef}>
              <SearchField
                aria-label={text.searchLabel}
                clearButtonLabel={text.clearSearch}
                onChange={(event) => updateQuery(event.currentTarget.value)}
                onClear={() => updateQuery("")}
                placeholder={text.searchPlaceholder}
                value={query}
              />
            </div>
            <p aria-live="polite" className="api-keys-directory__summary">
              {text.resultCount(filteredKeys.length)}
            </p>
          </div>

          <p aria-live="polite" className="api-keys-directory__narrow-note">
            {interactionNotice ?? text.narrowDetailUnresolved}
          </p>

          {filteredKeys.length > 0 ? (
            <div className="api-keys-directory__results">
              <Table
                actionLabel={text.actionColumn}
                primaryLabel={text.keyColumn}
                rows={tableRows}
                secondaryLabel={text.scopeColumn}
                statusLabel={text.statusColumn}
              />
            </div>
          ) : (
            <EmptyState
              actions={
                <Button emphasis="secondary" onClick={() => updateQuery("")} type="button">
                  {text.clearSearchAction}
                </Button>
              }
              body={text.emptyBody}
              title={text.emptyTitle}
            />
          )}
        </section>
      </ApplicationShell>
      </div>

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={closeCreate} type="button">
              {text.cancel}
            </Button>
            <Button form="api-key-create-form" type="submit">
              {text.createKey}
            </Button>
          </>
        }
        closeLabel={text.closeDialog}
        description={text.createDescription}
        onOpenChange={(open) => {
          if (open) setCreateOpen(true);
          else closeCreate();
        }}
        open={createOpen}
        title={text.createTitle}
      >
        <form className="api-key-create-form" id="api-key-create-form" noValidate onSubmit={submitCreate}>
          <TextField
            errorMessage={text.nameError}
            id="api-key-name"
            invalid={createAttempted && !nameDraft.trim()}
            label={text.nameLabel}
            onChange={(event) => setNameDraft(event.currentTarget.value)}
            placeholder={text.namePlaceholder}
            required
            supportingText={text.nameSupporting}
            value={nameDraft}
          />
          <RadioGroup
            label={text.scopeLabel}
            name="api-key-access-scope"
            onValueChange={(value) => setScopeDraft(value as AccessScope)}
            options={[
              { value: "read", label: text.readScope, description: text.readScopeDescription },
              { value: "write", label: text.writeScope, description: text.writeScopeDescription },
            ]}
            required
            value={scopeDraft}
          />
          {createAttempted && (!nameDraft.trim() || !scopeDraft) ? (
            <InlineFeedback intent="error" message={text.createError} />
          ) : null}
        </form>
      </Dialog>

      {selectedKey
        ? createPortal(
            <div
              className="api-key-detail-layer"
              data-theme={theme}
              dir={direction}
              lang={language}
            >
              <div aria-hidden="true" className="api-key-detail-backdrop" />
              <div
                aria-label={text.detailDialogName(selectedKey.name)}
                aria-modal="true"
                className="api-key-detail-host"
                onKeyDown={handleDetailKeyDown}
                ref={detailHostRef}
                role="dialog"
                tabIndex={-1}
              >
                <SidePanel
                  actions={
                    selectedKey.status === "active" ? (
                      <Button
                        onClick={() => setRevokeOpen(true)}
                        tone="critical"
                        type="button"
                      >
                        {text.revokeAction}
                      </Button>
                    ) : null
                  }
                  className="api-key-detail-panel"
                  closeLabel={text.closePanel}
                  eyebrow={text.detailEyebrow}
                  header={
                    <div className="api-key-detail-header">
                      <h3 className="api-key-detail-header__name">{selectedKey.name}</h3>
                      <span
                        className={
                          selectedKey.prefix
                            ? "api-key-identity__prefix"
                            : "api-key-identity__prefix api-key-identity__prefix--placeholder"
                        }
                        dir={selectedKey.prefix ? "ltr" : direction}
                      >
                        {selectedKey.prefix ?? text.prefixNotGenerated}
                      </span>
                    </div>
                  }
                  onClose={closeDetails}
                  style={{
                    blockSize: "100%",
                    inlineSize: "var(--dse-layout-primitive-detail-inline-width)",
                    maxBlockSize: "100%",
                    minBlockSize: 0,
                  }}
                >
                  <div className="api-key-detail-body">
                    <dl className="api-key-metadata">
                      <div className="api-key-metadata__item">
                        <dt>{text.detailName}</dt>
                        <dd>{selectedKey.name}</dd>
                      </div>
                      <div className="api-key-metadata__item">
                        <dt>{text.prefixLabel}</dt>
                        <dd>
                          <span
                            className={
                              selectedKey.prefix
                                ? "api-key-identity__prefix"
                                : "api-key-identity__prefix api-key-identity__prefix--placeholder"
                            }
                            dir={selectedKey.prefix ? "ltr" : direction}
                          >
                            {selectedKey.prefix ?? text.prefixNotGenerated}
                          </span>
                        </dd>
                      </div>
                      <div className="api-key-metadata__item">
                        <dt>{text.scopeLabelDetail}</dt>
                        <dd>{selectedKey.scope === "read" ? text.readScope : text.writeScope}</dd>
                      </div>
                      <div className="api-key-metadata__item">
                        <dt>{text.statusLabelDetail}</dt>
                        <dd>
                          <StatusBadge
                            label={selectedKey.status === "active" ? text.active : text.revoked}
                          />
                        </dd>
                      </div>
                      <div className="api-key-metadata__item">
                        <dt>{text.createdByLabel}</dt>
                        <dd dir={selectedKey.createdByDirection}>{selectedKey.createdBy}</dd>
                      </div>
                      <div className="api-key-metadata__item">
                        <dt>{text.createdDateLabel}</dt>
                        <dd>{selectedKey.createdDate ?? text.dateNotProvided}</dd>
                      </div>
                    </dl>
                    <p className="api-key-detail-body__note">{text.secretNotShown}</p>
                  </div>
                </SidePanel>
              </div>

              <Dialog
                actions={
                  <>
                    <Button
                      emphasis="secondary"
                      onClick={() => setRevokeOpen(false)}
                      type="button"
                    >
                      {text.cancel}
                    </Button>
                    <Button onClick={confirmRevoke} tone="critical" type="button">
                      {text.revokeConfirm}
                    </Button>
                  </>
                }
                closeLabel={text.closeDialog}
                description={text.revokeDialogDescription(selectedKey.name)}
                onOpenChange={setRevokeOpen}
                open={revokeOpen}
                title={text.revokeDialogTitle}
              >
                <p className="api-key-revoke-confirmation">
                  {text.revokeConfirmationBody}
                </p>
              </Dialog>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
